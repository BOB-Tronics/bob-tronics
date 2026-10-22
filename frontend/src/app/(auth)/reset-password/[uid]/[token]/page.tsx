import { Suspense } from "react";
import Card from "@/components/ui/Card";
import ResetPasswordScreen from "@/components/auth/ResetPasswordScreen";

export const dynamic = "force-dynamic";

export default async function ResetPasswordTokenPage({
  params,
}: {
  params: Promise<{ uid: string; token: string }>;
}) {
  const { uid, token } = await params;
  return (
    <div className="auth-background flex min-h-screen items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <Suspense fallback={<Card>Loading...</Card>}>
          <ResetPasswordScreen routeUid={uid} routeToken={token} />
        </Suspense>
      </div>
    </div>
  );
}
