import Navbar from "@/components/Navbar";

export default function PageShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">{title}</h1>
        {children}
      </main>
    </div>
  );
}