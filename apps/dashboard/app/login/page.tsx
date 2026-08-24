import type { Metadata } from "next";
import { LoginPageClient } from "../../components/login-page-client";

export const metadata: Metadata = {
  title: "Anmelden",
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return <LoginPageClient />;
}
