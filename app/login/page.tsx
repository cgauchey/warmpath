"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  async function handleLogin() {
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });
    setSent(true);
  }

  if (sent) return <p className="p-8">Check your email for a login link.</p>;

  return (
    <div className="flex flex-col gap-4 p-8 max-w-sm mx-auto mt-20">
      <h1 className="text-xl font-semibold">WarmPath</h1>
      <Input
        type="email"
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button onClick={handleLogin}>Send magic link</Button>
    </div>
  );
}
