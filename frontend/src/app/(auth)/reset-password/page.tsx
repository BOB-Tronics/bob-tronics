import { Suspense } from "react";
import Card from "@/components/ui/Card";
import ResetPasswordScreen from "@/components/auth/ResetPasswordScreen";

export default function ResetPasswordPage() {
  return (
    <div className="auth-background flex min-h-screen items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <Suspense fallback={<Card>Loading...</Card>}>
          <ResetPasswordScreen />
        </Suspense>
      </div>
    </div>
  );
}
