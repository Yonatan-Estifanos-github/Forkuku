export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F9F7F2] font-serif admin-theme">
      {children}
    </div>
  );
}
