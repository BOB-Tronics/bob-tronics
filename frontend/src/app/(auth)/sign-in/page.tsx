import AuthExperience from "@/components/auth/AuthExperience";

export const metadata = { title: "Sign In · BOB TRONICS" };

export default function SignInPage() {
  return <AuthExperience initialMode="sign-in" />;
}
