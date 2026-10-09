// Login page: bypass parent admin layout (no sidebar shell).
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
