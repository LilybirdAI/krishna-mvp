"use client";

import { useEffect, useState } from "react";
import PageShell from "@/components/PageShell";
import AuthGuard from "@/components/AuthGuard";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: string;
  full_name: string | null;
  bio: string | null;
};

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const loadProfiles = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, bio")
        .order("created_at", { ascending: false });

      if (error) {
        setStatus(error.message);
        setLoading(false);
        return;
      }

      if (data) {
        setProfiles(data);
      }

      setLoading(false);
    };

    loadProfiles();
  }, []);

  return (
    <AuthGuard>
      <PageShell title="Discover">
        {status ? (
          <div className="mb-4 rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-700 shadow-sm">
            {status}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-md">
            <p className="text-gray-600">Loading users...</p>
          </div>
        ) : profiles.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-md">
            <p className="text-gray-600">No users found yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-md"
              >
                <h2 className="mb-2 text-lg font-semibold text-gray-900">
                  {profile.full_name || "Unnamed User"}
                </h2>
                <p className="text-sm text-gray-600">
                  {profile.bio || "No bio yet."}
                </p>
              </div>
            ))}
          </div>
        )}
      </PageShell>
    </AuthGuard>
  );
}