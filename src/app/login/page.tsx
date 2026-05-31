import Link from "next/link";
import AuthForm from "@/components/auth/AuthForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <div className="min-h-screen grid place-items-center px-5">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center gap-3 justify-center mb-8">
          <div className="w-11 h-11 rounded-xl grid place-items-center font-bold text-white"
            style={{ background: "linear-gradient(135deg, var(--bd-green), var(--accent))" }}>N</div>
          <div>
            <div className="font-bold text-lg leading-tight">Nation Inside</div>
            <div className="text-[11px] uppercase tracking-widest text-muted">Member Portal</div>
          </div>
        </Link>
        <div className="panel p-6">
          <h1 className="text-xl font-bold mb-1">Welcome back</h1>
          <p className="text-sm text-muted mb-5">Sign in to your member account.</p>
          <AuthForm mode="login" next={next} />
        </div>
      </div>
    </div>
  );
}
