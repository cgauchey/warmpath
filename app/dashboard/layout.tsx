import Link from "next/link";
import { PillButton } from "@/components/brand/pill-button";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-brand-base">
      <nav className="bg-brand-base sticky top-0 z-10 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-8">
          <Link href="/dashboard" className="text-white font-black text-lg tracking-tight lowercase">
            warmpath
          </Link>
          <div className="flex gap-2">
            <PillButton variant="outlined" color="white" size="sm" asChild>
              <Link href="/dashboard/roles">roles</Link>
            </PillButton>
            <PillButton variant="outlined" color="white" size="sm" asChild>
              <Link href="/dashboard/companies">companies</Link>
            </PillButton>
            <PillButton variant="outlined" color="white" size="sm" asChild>
              <Link href="/dashboard/contacts">contacts</Link>
            </PillButton>
            <PillButton variant="outlined" color="white" size="sm" asChild>
              <Link href="/dashboard/profile">profile</Link>
            </PillButton>
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10 bg-background">{children}</main>
    </div>
  );
}
