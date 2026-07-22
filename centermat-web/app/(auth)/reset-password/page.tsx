import { Suspense } from "react";
import ResetPasswordPage from "./reset-password";
import { LoginLayout } from "@/app/ui"; // Adjust path if needed

export default function Page() {
  return (
    <Suspense
      fallback={
        <LoginLayout sidebarHeader="Centermat">
          <div className="flex justify-center items-center h-48">
            <p className="font-display animate-pulse uppercase font-black text-lg">
              Loading password reset...
            </p>
          </div>
        </LoginLayout>
      }
    >
      <ResetPasswordPage />
    </Suspense>
  );
}
