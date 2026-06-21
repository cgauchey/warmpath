import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center gap-8">
          <Link href="/dashboard" className="font-semibold tracking-tight">
            WarmPath
          </Link>
          <div className="flex gap-6">
            <Link href="/dashboard/contacts" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contacts
            </Link>
            <Link href="/dashboard/roles" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Roles
            </Link>
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">{children}</main>
    </div>
  );
}
