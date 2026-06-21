import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <nav className="border-b px-6 py-4 flex gap-6 items-center">
        <span className="font-semibold">WarmPath</span>
        <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
          Home
        </Link>
        <Link href="/dashboard/contacts" className="text-sm text-muted-foreground hover:text-foreground">
          Contacts
        </Link>
        <Link href="/dashboard/roles" className="text-sm text-muted-foreground hover:text-foreground">
          Roles
        </Link>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  );
}
