"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { signIn, signUp, type AuthState } from "@/lib/auth/actions";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl py-3 font-semibold text-white disabled:opacity-60"
      style={{ background: "linear-gradient(135deg, var(--bd-green), var(--accent))" }}
    >
      {pending ? "Please wait…" : label}
    </button>
  );
}

export default function AuthForm({ mode, next }: { mode: "login" | "register"; next?: string }) {
  const action = mode === "login" ? signIn : signUp;
  const [state, formAction] = useActionState<AuthState, FormData>(action, {});

  return (
    <form action={formAction} className="space-y-4">
      {mode === "register" && (
        <>
          <Field name="full_name" label="Full name" placeholder="Your full name" required />
          <Field name="phone" label="Phone (optional)" placeholder="+8801…" />
        </>
      )}
      <Field name="email" label="Email" type="email" placeholder="you@example.com" required />
      <Field name="password" label="Password" type="password" placeholder="••••••••" required />
      {next && <input type="hidden" name="next" value={next} />}

      {state.error && (
        <p className="text-sm text-[var(--danger)] bg-[var(--danger)]/10 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}

      <SubmitButton label={mode === "login" ? "Sign in" : "Create account"} />

      <p className="text-sm text-muted text-center">
        {mode === "login" ? (
          <>New member? <Link href="/register" className="text-[var(--accent)] hover:underline">Register</Link></>
        ) : (
          <>Already a member? <Link href="/login" className="text-[var(--accent)] hover:underline">Sign in</Link></>
        )}
      </p>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  placeholder,
  required,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-1 w-full px-3 py-2.5 rounded-xl bg-[#0d1626] border border-border outline-none focus:border-[var(--accent)] text-sm"
      />
    </label>
  );
}
