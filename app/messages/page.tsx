"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import PageShell from "@/components/PageShell";
import AuthGuard from "@/components/AuthGuard";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: string;
  full_name: string | null;
};

type Message = {
  id: string;
  body: string;
  sender_id: string;
  recipient_id: string;
  created_at?: string;
};

export default function MessagesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [status, setStatus] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        setStatus(error.message);
        return;
      }

      if (data.user) {
        setUserId(data.user.id);
      } else {
        setStatus("No logged in user found.");
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    const loadProfiles = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name")
        .order("created_at", { ascending: false });

      if (error) {
        setStatus(error.message);
        return;
      }

      if (data) {
        setProfiles(data);
      }
    };

    loadProfiles();
  }, []);

  const selectedProfile = useMemo(() => {
    return profiles.find((p) => p.id === selectedUser) || null;
  }, [profiles, selectedUser]);

  const getDisplayName = (id: string) => {
    if (id === userId) return "You";
    return profiles.find((p) => p.id === id)?.full_name || "User";
  };

  const formatTime = (value?: string) => {
    if (!value) return "";
    return new Date(value).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const loadConversation = async () => {
    if (!userId || !selectedUser) return;

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${userId},recipient_id.eq.${selectedUser}),and(sender_id.eq.${selectedUser},recipient_id.eq.${userId})`
      )
      .order("created_at", { ascending: true });

    if (error) {
      setStatus(error.message);
      return;
    }

    if (data) {
      setMessages(data);
    }
  };

  useEffect(() => {
    if (!userId || !selectedUser) return;

    loadConversation();

    const interval = setInterval(() => {
      loadConversation();
    }, 2000);

    return () => clearInterval(interval);
  }, [userId, selectedUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    setStatus("");

    if (!userId) {
      setStatus("User not loaded yet.");
      return;
    }

    if (!selectedUser) {
      setStatus("Select a user first.");
      return;
    }

    if (!newMessage.trim()) {
      setStatus("Type a message first.");
      return;
    }

    const { error } = await supabase.from("messages").insert({
      sender_id: userId,
      recipient_id: selectedUser,
      body: newMessage.trim(),
    });

    if (error) {
      setStatus(error.message);
      return;
    }

    setNewMessage("");
    loadConversation();
  };

  return (
    <AuthGuard>
      <PageShell title="Messages">
        {status ? (
          <div className="mb-4 rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-700 shadow-sm">
            {status}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-md">
            <h2 className="mb-3 font-semibold text-gray-900">Users</h2>

            <div className="space-y-2">
              {profiles.length === 0 ? (
                <p className="text-sm text-gray-500">No users found.</p>
              ) : (
                profiles.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedUser(p.id)}
                    className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                      selectedUser === p.id
                        ? "border-black bg-gray-100 text-gray-900"
                        : "border-gray-200 bg-white text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <p className="font-medium">{p.full_name || "Unnamed"}</p>
                    <p className="text-xs text-gray-500">
                      {p.id === userId ? "Your profile" : "Open conversation"}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="col-span-2 flex h-[70vh] flex-col rounded-2xl border border-gray-100 bg-white shadow-md">
            <div className="border-b border-gray-100 px-4 py-4">
              <h2 className="font-semibold text-gray-900">
                {selectedProfile
                  ? `Chat with ${selectedProfile.full_name || "User"}`
                  : "Select a user"}
              </h2>
              <p className="text-sm text-gray-500">
                {selectedProfile
                  ? "Messages refresh automatically."
                  : "Choose someone on the left to start chatting."}
              </p>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {!selectedUser ? (
                <div className="flex h-full items-center justify-center text-sm text-gray-500">
                  Select a user to start chatting.
                </div>
              ) : messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-gray-500">
                  No messages yet. Send the first one.
                </div>
              ) : (
                messages.map((m) => {
                  const isMine = m.sender_id === userId;

                  return (
                    <div
                      key={m.id}
                      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                    >
                      <div className="max-w-[80%]">
                        <p
                          className={`mb-1 text-xs ${
                            isMine ? "text-right text-gray-500" : "text-left text-gray-500"
                          }`}
                        >
                          {getDisplayName(m.sender_id)} • {formatTime(m.created_at)}
                        </p>

                        <div
                          className={`rounded-2xl px-4 py-3 ${
                            isMine
                              ? "bg-black text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          {m.body}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              <div ref={bottomRef} />
            </div>

            <div className="border-t border-gray-100 px-4 py-4">
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={
                    selectedUser ? "Type a message..." : "Select a user first"
                  }
                  disabled={!selectedUser}
                />
                <button
                  onClick={handleSend}
                  disabled={!selectedUser}
                  className="rounded-xl bg-black px-5 py-3 text-white disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </PageShell>
    </AuthGuard>
  );
}