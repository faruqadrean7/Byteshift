import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

/**
 * Neon Object Storage (S3-compatible) helper.
 *
 * Credentials, endpoint and region are read from the AWS-standard env vars
 * that Neon injects (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY,
 * AWS_ENDPOINT_URL_S3, AWS_REGION). Neon requires path-style addressing, so
 * the only explicit client option is `forcePathStyle: true`.
 *
 * The bucket is expected to be `public_read`, so stored objects are served
 * directly from `${AWS_ENDPOINT_URL_S3}/<bucket>/<key>` without presigning.
 */

const BUCKET = process.env.STORAGE_BUCKET || "uploads";

function getEndpoint(): string | undefined {
  return process.env.AWS_ENDPOINT_URL_S3 || process.env.AWS_ENDPOINT_URL;
}

/** True only when all required S3 env vars are present. */
export function isS3Configured(): boolean {
  return Boolean(
    process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY &&
      getEndpoint() &&
      process.env.AWS_REGION
  );
}

let cached: S3Client | null = null;
function getClient(): S3Client {
  if (!cached) {
    // The SDK picks up credentials, endpoint and region from the AWS_* env
    // chain automatically; path-style is mandatory for Neon.
    cached = new S3Client({ forcePathStyle: true });
  }
  return cached;
}

/**
 * Upload a file to the Neon bucket and return its public URL.
 * A long immutable cache header is safe because every key is unique.
 */
export async function uploadToS3(opts: {
  key: string;
  body: Buffer;
  contentType: string;
}): Promise<string> {
  const endpoint = getEndpoint();
  if (!endpoint) throw new Error("AWS_ENDPOINT_URL_S3 is not configured");

  await getClient().send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: opts.key,
      Body: opts.body,
      ContentType: opts.contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  return `${endpoint.replace(/\/+$/, "")}/${BUCKET}/${opts.key}`;
}
