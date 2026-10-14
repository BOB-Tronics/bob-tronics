import AuthPanel from "@/components/account/AuthPanel";

export const metadata = { title: "Sign in · BOB TRONICS" };

export default function AccountOverviewPage() {
  return (
    <section className="flex min-h-[calc(100svh-100px)] items-center justify-center bg-[linear-gradient(135deg,#fff_0%,#f4f5f8_52%,#e8ebf2_100%)] px-4 py-10 sm:px-8 lg:min-h-[calc(100svh-116px)]">
      <AuthPanel />
    </section>
  );
}
