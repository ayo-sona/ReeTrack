"use client";

import { useState, useMemo } from "react";
import {
  Send,
  Search,
  CheckSquare,
  Square,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { membersApi } from "@/lib/organizationAPI/membersApi";
import { useQuery } from "@tanstack/react-query";
import { Member } from "@/types/organization";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import apiClient from "@/lib/apiClient";

interface TransformedMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string | null; // ✅ added
}

const PAGE_SIZE = 6;

export default function PingsPage() {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [showSendModal, setShowSendModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [page, setPage] = useState(1);

  const {
    data: rawMembers,
    isLoading: isLoadingMembers,
    error: membersError,
  } = useQuery({
    queryKey: ["members"],
    queryFn: () => membersApi.getAll(page, PAGE_SIZE, "all"),
  });

  const members = useMemo(() => {
    if (!rawMembers?.data) return [];
    return rawMembers.data.map((member: Member): TransformedMember => {
      const user = member.user;
      return {
        id: member.id,
        name: `${user.first_name} ${user.last_name}`.trim(),
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatar_url ?? null, // ✅ added
      };
    });
  }, [rawMembers]);

  const filteredMembers = useMemo(() => {
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [members, searchQuery]);

  const handleSelectMember = (id: string) =>
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const handleSelectAll = () =>
    setSelectedMembers(
      selectedMembers.length === filteredMembers.length &&
        filteredMembers.length > 0
        ? []
        : filteredMembers.map((m) => m.id),
    );

  const handleSendPing = async (data: {
    message: string;
    subject?: string;
    additionalNotes?: string;
  }) => {
    try {
      const selectedMemberEmails = selectedMembers
        .map((id) => members.find((m) => m.id === id)?.email || "")
        .filter((email) => email !== "");

      if (selectedMemberEmails.length === 0) {
        toast.error("Please select at least one member");
        return;
      }

      setIsSending(true);
      const response = await apiClient.post("notifications/email/custom", {
        to: selectedMemberEmails,
        subject: data.subject || "Notification from ReeTrack",
        context: { content: data.message },
      });

      if (response.data.statusCode === 201) {
        toast.success(
          `Notification sent to ${response.data.data.results.success} member${selectedMemberEmails.length !== 1 ? "s" : ""}`,
        );
      }

      setShowSendModal(false);
      setSelectedMembers([]);
    } catch (error: any) {
      const { data } = error.response;
      toast.error(
        data.message || "Failed to send notification. Please try again.",
      );
    } finally {
      setIsSending(false);
    }
  };

  if (isLoadingMembers) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] font-[Nunito,sans-serif]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gray-100 border-t-[#0D9488] rounded-full animate-spin" />
          <p className="text-sm text-[#9CA3AF]">Loading members...</p>
        </div>
      </div>
    );
  }

  if (membersError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center font-[Nunito,sans-serif]">
        <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
        <p className="text-base font-bold text-[#1F2937] mb-1">
          Error loading members
        </p>
        <p className="text-sm text-[#9CA3AF] mb-4">
          {membersError instanceof Error
            ? membersError.message
            : "Failed to load members"}
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  const allFilteredSelected =
    selectedMembers.length === filteredMembers.length &&
    filteredMembers.length > 0;

  return (
    <div className="font-[Nunito,sans-serif] bg-[#F9FAFB] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#0D9488] mb-1">
              Communications
            </p>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1F2937]">
              Member Notifications
            </h1>
            <p className="text-sm text-[#9CA3AF] mt-0.5">
              Send reminders and updates to your members
            </p>
          </div>
          <div className="self-start sm:self-auto mt-2 sm:mt-0">
            <span className="text-xs font-semibold text-[#9CA3AF]">
              <span className="text-[#1F2937] font-extrabold">
                {members.length}
              </span>{" "}
              total members
            </span>
          </div>
        </div>

        {/* Member Selection */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="px-5 sm:px-6 py-4 border-b border-gray-100 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-sm font-bold text-[#0D9488] uppercase tracking-wide">
                Select Members
              </h2>
              <Button
                variant="default"
                size="default"
                disabled={selectedMembers.length === 0}
                onClick={() => setShowSendModal(true)}
                className="w-full sm:w-auto"
              >
                <Send className="w-4 h-4" />
                Send to {selectedMembers.length}{" "}
                {selectedMembers.length === 1 ? "member" : "members"}
              </Button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-[#E5E7EB] rounded-lg bg-[#F9FAFB] text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 focus:border-[#0D9488] transition"
              />
            </div>

            <button
              onClick={handleSelectAll}
              className="flex items-center gap-1.5 text-sm font-semibold text-[#0D9488] hover:text-[#0B7A70] transition-colors self-start"
            >
              {allFilteredSelected ? (
                <>
                  <CheckSquare className="w-4 h-4" /> Deselect all
                </>
              ) : (
                <>
                  <Square className="w-4 h-4" /> Select all (
                  {filteredMembers.length})
                </>
              )}
            </button>
          </div>

          {/* Member list */}
          <div className="divide-y divide-gray-50 max-h-[480px] overflow-y-auto">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => {
                const isSelected = selectedMembers.includes(member.id);
                const initials = member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);

                return (
                  <label
                    key={member.id}
                    className={clsx(
                      "flex items-center gap-3 sm:gap-4 px-5 sm:px-6 py-3.5 cursor-pointer transition-colors",
                      isSelected ? "bg-[#0D9488]/5" : "hover:bg-[#F9FAFB]",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectMember(member.id)}
                      className="w-4 h-4 rounded border-[#E5E7EB]/30 accent-[#0D9488] dark:accent-white focus:ring-[#0D9488]/30 flex-shrink-0"
                    />

                    {/* ✅ Avatar */}
                    <div className="w-8 h-8 rounded-full bg-[#0D9488]/10 flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                      {member.avatarUrl ? (
                        <Image
                          src={member.avatarUrl}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-xs font-bold text-[#0D9488]">
                          {initials}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#1F2937] truncate">
                        {member.name}
                      </p>
                      <p className="text-xs text-[#9CA3AF] truncate">
                        {member.email}
                      </p>
                    </div>
                  </label>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <Search className="w-8 h-8 text-gray-200 mb-3" />
                <p className="text-sm font-bold text-[#1F2937] mb-0.5">
                  No members found
                </p>
                <p className="text-xs text-[#9CA3AF]">
                  Try adjusting your search
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showSendModal && (
        <SendModal
          selectedCount={selectedMembers.length}
          onClose={() => setShowSendModal(false)}
          onSend={handleSendPing}
          isSending={isSending}
        />
      )}
    </div>
  );
}

function SendModal({
  selectedCount,
  onClose,
  onSend,
  isSending,
}: {
  selectedCount: number;
  onClose: () => void;
  onSend: (data: {
    message: string;
    subject?: string;
    additionalNotes?: string;
  }) => Promise<void>;
  isSending: boolean;
}) {
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (message.trim() && !isSending) {
      await onSend({ message, subject: subject.trim() || undefined });
    }
  };

  const templates = [
    "Your membership has expired. Renew today to regain access to all facilities.",
    "Don't forget to check in today! We'd love to see you.",
    "Welcome to our community! We're excited to have you on board.",
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/20 backdrop-blur-sm px-0 sm:px-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-xl rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        <div className="px-5 sm:px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="text-base sm:text-lg font-extrabold text-[#1F2937]">
            Send to {selectedCount} {selectedCount === 1 ? "member" : "members"}
          </h2>
          <p className="text-xs sm:text-sm text-[#9CA3AF] mt-0.5">
            Choose a template or write your own message
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-5 sm:px-6 py-5 space-y-5">
          <div>
            <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-2">
              Subject (Optional)
            </p>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject..."
              disabled={isSending}
              className="w-full px-4 py-3 text-sm border border-[#E5E7EB] rounded-lg bg-[#F9FAFB] text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 focus:border-[#0D9488] transition disabled:opacity-50"
            />
          </div>

          <div>
            <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-2">
              Your Message
            </p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder="Type your message here..."
              disabled={isSending}
              required
              className="w-full px-4 py-3 text-sm border border-[#E5E7EB] rounded-lg bg-[#F9FAFB] text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0D9488]/30 focus:border-[#0D9488] resize-none transition disabled:opacity-50"
            />
            <p className="text-xs text-[#9CA3AF] mt-1.5">
              {message.length} characters
            </p>
          </div>

          <div>
            <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-2">
              Quick Templates
            </p>
            <div className="space-y-2">
              {templates.map((t, i) => (
                <button
                  key={i}
                  type="button"
                  disabled={isSending}
                  onClick={() => {
                    setMessage(t);
                    setSubject("Notification from ReeTrack");
                  }}
                  className={clsx(
                    "w-full text-left px-4 py-3 text-sm rounded-lg border transition-colors leading-relaxed",
                    message === t
                      ? "border-[#0D9488] bg-[#0D9488]/5 text-[#1F2937] font-semibold"
                      : "border-[#E5E7EB] bg-[#F9FAFB] text-[#1F2937] hover:border-[#0D9488]/40",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              className="flex-1"
              disabled={!message.trim() || isSending}
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Send Now
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
