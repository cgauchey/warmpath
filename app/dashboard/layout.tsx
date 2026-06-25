import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <nav className="border-b border-border/60 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center gap-10">
          <Link href="/dashboard" className="font-semibold tracking-tight text-foreground">
            WarmPath
          </Link>
          <div className="flex gap-8">
            <Link href="/dashboard/contacts" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contacts
            </Link>
            <Link href="/dashboard/roles" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Roles
            </Link>
            <Link href="/dashboard/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Profile
            </Link>
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">{children}</main>
    </div>
  );
}
