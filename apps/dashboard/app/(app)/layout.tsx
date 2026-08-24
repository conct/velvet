"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "../../components/sidebar";
import { useAuth } from "../../lib/auth-context";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { ready, token, staff } = useAuth();

  useEffect(() => {
    if (ready && !token) router.replace("/login");
  }, [ready, token, router]);

  if (!ready || !token) return null;

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <main className="min-h-screen w-full min-w-0 flex-1 overflow-y-auto px-4 py-6 md:px-10 md:py-10">
        {staff && staff.venue.status !== "VERIFIED" && (
          <div className="mb-6 rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-gold">
            „{staff.venue.name}“ ist noch nicht freigegeben — Einlass per QR-Code und Bewertungen funktionieren
            erst nach Prüfung durch VELVET.
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
