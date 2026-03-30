"use client";

import { useEffect, useState } from "react";
import PageShell from "@/components/PageShell";
import AuthGuard from "@/components/AuthGuard";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email ?? "");
    };

    getUser();
  }, []);

  return (
    <AuthGuard>
      <PageShell title="Dashboard">
        <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-md">
          <p className="text-sm text-gray-500">Logged in as</p>
          <p className="text-lg font-semibold text-gray-900">
            {email || "Loading..."}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-md text-gray-900">
            <h2 className="mb-2 font-semibold text-gray-900">Welcome Back</h2>
            <p className="text-sm text-gray-600">
              Your activity will show here.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-md text-gray-900">
            <h2 className="mb-2 font-semibold text-gray-900">Connections</h2>
            <p className="text-3xl font-bold text-gray-900">12</p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-md text-gray-900">
            <h2 className="mb-2 font-semibold text-gray-900">Messages</h2>
            <p className="text-3xl font-bold text-gray-900">4</p>
          </div>
        </div>
      </PageShell>
    </AuthGuard>
  );
}