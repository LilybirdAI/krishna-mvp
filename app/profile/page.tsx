"use client";

import { useEffect, useState } from "react";
import PageShell from "@/components/PageShell";
import AuthGuard from "@/components/AuthGuard";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError) {
        setMessage(userError.message);
        return;
      }

      const user = userData.user;

      if (!user) {
        setMessage("No logged in user found.");
        return;
      }

      setUserId(user.id);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        setMessage(profileError.message);
        return;
      }

      if (profile) {
        setFullName(profile.full_name || "");
        setBio(profile.bio || "");
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      full_name: fullName,
      bio: bio,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Profile saved.");
  };

  return (
    <AuthGuard>
      <PageShell title="Profile">
        <div className="max-w-xl rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
          {message ? (
            <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
              {message}
            </div>
          ) : null}

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Full Name
            </label>
            <input
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Bio
            </label>
            <textarea
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="rounded-xl bg-black px-6 py-3 text-white disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </PageShell>
    </AuthGuard>
  );
}