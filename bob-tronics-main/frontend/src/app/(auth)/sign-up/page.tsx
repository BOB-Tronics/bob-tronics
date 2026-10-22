import AuthExperience from "@/components/auth/AuthExperience";

export const metadata = { title: "Create Account · BOB TRONICS" };

export default function SignUpPage() {
  return <AuthExperience initialMode="sign-up" />;
}
