import os
import uuid
from typing import Dict
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from backend.app.core.security import require_admin_user
from backend.app.core.config import settings

router = APIRouter(dependencies=[Depends(require_admin_user)])

ALLOWED_EXTENSIONS = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/avif": ".avif",
}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

def get_s3_client():
    if not (settings.AWS_ACCESS_KEY_ID and settings.AWS_SECRET_ACCESS_KEY and settings.AWS_BUCKET_NAME):
        return None
    import boto3
    from botocore.config import Config
    
    kwargs = {
        "aws_access_key_id": settings.AWS_ACCESS_KEY_ID,
        "aws_secret_access_key": settings.AWS_SECRET_ACCESS_KEY,
        "region_name": settings.AWS_REGION or "us-east-1",
        "config": Config(s3={"addressing_style": "path"}),
    }
    if settings.AWS_ENDPOINT_URL_S3:
        kwargs["endpoint_url"] = settings.AWS_ENDPOINT_URL_S3
    return boto3.client("s3", **kwargs)

@router.post("", response_model=Dict[str, str])
async def upload_file(file: UploadFile = File(...)):
    content_type = file.content_type or ""
    if content_type not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tipe file tidak didukung. Harap unggah JPG, PNG, WebP, GIF, atau AVIF (SVG tidak diizinkan demi keamanan).",
        )

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ukuran file melebihi batas maksimal 5 MB.",
        )

    ext = ALLOWED_EXTENSIONS[content_type]
    filename = f"{uuid.uuid4().hex}{ext}"
    s3_key = f"uploads/{filename}"

    s3_client = get_s3_client()
    if s3_client:
        try:
            s3_client.put_object(
                Bucket=settings.AWS_BUCKET_NAME,
                Key=s3_key,
                Body=contents,
                ContentType=content_type,
            )
            # Public URL
            if settings.PUBLIC_MEDIA_URL_PREFIX:
                public_url = f"{settings.PUBLIC_MEDIA_URL_PREFIX.rstrip('/')}/{s3_key}"
            elif settings.AWS_ENDPOINT_URL_S3:
                public_url = f"{settings.AWS_ENDPOINT_URL_S3.rstrip('/')}/{settings.AWS_BUCKET_NAME}/{s3_key}"
            else:
                public_url = f"https://{settings.AWS_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/{s3_key}"
            return {"url": public_url, "key": s3_key}
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Gagal mengunggah ke cloud storage: {str(e)}",
            )
    else:
        # Fallback to local disk under Next.js public/uploads
        local_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../../public/uploads"))
        os.makedirs(local_dir, exist_ok=True)
        local_path = os.path.join(local_dir, filename)
        with open(local_path, "wb") as f:
            f.write(contents)
        return {"url": f"/uploads/{filename}", "key": filename}
