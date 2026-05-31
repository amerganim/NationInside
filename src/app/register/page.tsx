import Link from "next/link";
import AuthForm from "@/components/auth/AuthForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid place-items-center px-5 py-10">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center gap-3 justify-center mb-8">
          <div className="w-11 h-11 rounded-xl grid place-items-center font-bold text-white"
            style={{ background: "linear-gradient(135deg, var(--bd-green), var(--accent))" }}>N</div>
          <div>
            <div className="font-bold text-lg leading-tight">Nation Inside</div>
            <div className="text-[11px] uppercase tracking-widest text-muted">Member Registration</div>
          </div>
        </Link>
        <div className="panel p-6">
          <h1 className="text-xl font-bold mb-1">Join the party</h1>
          <p className="text-sm text-muted mb-5">
            Create your account. A district admin will verify you before full access.
          </p>
          <AuthForm mode="register" />
        </div>
      </div>
    </div>
  );
}
