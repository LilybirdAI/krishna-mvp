"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-md"
      >
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Log In</h1>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-900">
            Email
          </label>
          <input
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-900">
            Password
          </label>
          <input
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>

        {error ? (
          <p className="mb-4 text-sm text-red-600">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-black px-4 py-3 text-white disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log In"}
</button>
 <button
  type="submit"
  disabled={loading}
  className="w-full rounded-xl bg-black px-4 py-3 text-white disabled:opacity-50"
>
  {loading ? "Logging in..." : "Log In"}
</button>

<p className="mt-4 text-center text-sm text-gray-600">
  Need an account?{" "}
  <a href="/signup" className="font-medium text-black underline">
    Sign up
  </a>
</p>

</form>
</main>
);
}