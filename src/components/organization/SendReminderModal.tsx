import React, { useState } from "react";
import { X, Send, CheckCircle, Eye, EyeOff, ChevronDown } from "lucide-react";

// Forces light colour scheme on native elements — prevents browser dark mode inversion
const FIELD_STYLE: React.CSSProperties = {
  colorScheme: "light",
  backgroundColor: "#F9FAFB",
  color: "#1F2937",
};

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  membershipType: string;
  expiryDate: string;
  daysUntilExpiry: number;
  status: "upcoming" | "overdue";
  amountDue: number;
}

interface ReminderTemplate {
  id: number;
  name: string;
  subject: string;
  message: string;
  type?: "upcoming" | "overdue" | "final";
}

interface SendReminderData {
  memberIds: number[];
  channel: "email" | "sms" | "both";
  templateId: number;
  customMessage?: string;
  scheduledDate?: string;
}

interface SendReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMembers: Member[];
  onSend: (data: SendReminderData) => void;
}

const DEFAULT_TEMPLATES: ReminderTemplate[] = [
  {
    id: 1, type: "upcoming", name: "Upcoming Expiry — Friendly",
    subject: "Your Membership Expires Soon",
    message: `Hi {name},\n\nThis is a friendly reminder that your {membershipType} membership expires on {expiryDate}.\n\nRenewal amount: ₦{amount}\n\nThank you for being a valued member.`,
  },
  {
    id: 2, type: "overdue", name: "Overdue Payment — Urgent",
    subject: "Payment Overdue — Action Required",
    message: `Hi {name},\n\nYour {membershipType} membership expired on {expiryDate}. Please make a payment of ₦{amount} to reactivate your account.\n\nIf you've already paid, please disregard this message.`,
  },
  {
    id: 3, type: "final", name: "Final Notice — Critical",
    subject: "Final Notice — Membership Suspension Imminent",
    message: `Hi {name},\n\nFinal notice: your membership has been overdue since {expiryDate}. Your account will be suspended within 48 hours without payment of ₦{amount}.`,
  },
  {
    id: 4, type: "upcoming", name: "Gentle Reminder",
    subject: "A Friendly Note About Your Membership",
    message: `Hello {name},\n\nJust a gentle note that your {membershipType} membership expires on {expiryDate}. We'd love to have you continue!\n\nRenewal: ₦{amount}`,
  },
];

const TYPE_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  upcoming: { label: "Friendly", bg: "rgba(13,148,136,0.08)", color: "#0D9488" },
  overdue:  { label: "Urgent",   bg: "rgba(240,101,67,0.08)", color: "#F06543" },
  final:    { label: "Critical", bg: "rgba(239,68,68,0.08)",  color: "#DC2626" },
};

// ─── Sub-components ─────────────────────────────────────────────────────────

function Avatar({ name }: { name: string }) {
  return (
    <div className="relative w-9 h-9 flex-shrink-0">
      <span
        className="absolute left-0 top-1 bottom-1 w-[2px] rounded-full"
        style={{ backgroundColor: "#0D9488" }}
      />
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold"
        style={{ backgroundColor: "#F3F4F6", color: "#0D9488" }}
      >
        {(name || "U").charAt(0).toUpperCase()}
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-4" style={{ color: "#9CA3AF" }}>
      {children}
    </p>
  );
}

function Divider() {
  return <div className="my-6" style={{ borderTop: "1px solid #F3F4F6" }} />;
}

// ─── Main modal ─────────────────────────────────────────────────────────────

export const SendReminderModal: React.FC<SendReminderModalProps> = ({
  isOpen,
  onClose,
  selectedMembers,
  onSend,
}) => {
  const [channel,       setChannel]       = useState<"email" | "sms" | "both">("email");
  const [templateId,    setTemplateId]    = useState(1);
  const [customMessage, setCustomMessage] = useState("");
  const [scheduleFor,   setScheduleFor]   = useState<"now" | "later">("now");
  const [scheduledDate, setScheduledDate] = useState("");
  const [showPreview,   setShowPreview]   = useState(false);
  const [previewIdx,    setPreviewIdx]    = useState(0);

  if (!isOpen) return null;

  const template      = DEFAULT_TEMPLATES.find((t) => t.id === templateId);
  const previewMember = selectedMembers[previewIdx];

  const renderPreview = (m: Member) => {
    if (!template) return "";
    return (
      template.message
        .replace(/{name}/g, m.name)
        .replace(/{membershipType}/g, m.membershipType)
        .replace(/{expiryDate}/g, m.expiryDate)
        .replace(/{amount}/g, m.amountDue.toLocaleString()) +
      (customMessage ? `\n\n---\n\n${customMessage}` : "")
    );
  };

  const emailCount = channel === "email" || channel === "both" ? selectedMembers.length : 0;
  const smsCount   = channel === "sms"   || channel === "both" ? selectedMembers.length : 0;
  const totalCost  = emailCount * 2 + smsCount * 10;

  const handleSend = () => {
    onSend({
      memberIds:     selectedMembers.map((m) => m.id),
      channel,
      templateId,
      customMessage: customMessage || undefined,
      scheduledDate: scheduleFor === "later" ? scheduledDate : undefined,
    });
    setChannel("email"); setTemplateId(1); setCustomMessage("");
    setScheduleFor("now"); setScheduledDate("");
    onClose();
  };

  const CHANNELS: { value: "email" | "sms" | "both"; label: string; cost: string; note: string }[] = [
    { value: "email", label: "Email", cost: "₦2 / send",  note: "25–30% open rate" },
    { value: "sms",   label: "SMS",   cost: "₦10 / send", note: "90–95% open rate" },
    { value: "both",  label: "Both",  cost: "₦12 / send", note: "Max reach"        },
  ];

  const inputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "#0D9488";
    e.currentTarget.style.boxShadow   = "0 0 0 3px rgba(13,148,136,0.12)";
  };
  const inputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "#E5E7EB";
    e.currentTarget.style.boxShadow   = "none";
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
      style={{ backgroundColor: "rgba(17,24,39,0.45)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="w-full sm:max-w-2xl max-h-[95dvh] sm:max-h-[92vh] flex flex-col overflow-hidden sm:rounded-2xl rounded-t-2xl"
        style={{
          backgroundColor: "#FFFFFF",
          boxShadow: "0 8px 40px rgba(13,148,136,0.12), 0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between px-5 sm:px-7 py-5 sm:py-6 border-b flex-shrink-0"
          style={{ borderColor: "#E5E7EB" }}
        >
          <div>
            <h2
              className="text-base sm:text-lg font-bold"
              style={{ color: "#1F2937", letterSpacing: "-0.02em" }}
            >
              Send Payment Reminder
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>
              {selectedMembers.length} member{selectedMembers.length !== 1 ? "s" : ""} selected
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors ml-3 flex-shrink-0"
            style={{ color: "#9CA3AF" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F3F4F6")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-5 sm:py-6 space-y-6">

          {/* Recipients */}
          <div>
            <SectionLabel>Recipients</SectionLabel>
            <div
              className="rounded-xl border overflow-hidden"
              style={{ borderColor: "#E5E7EB", maxHeight: 180, overflowY: "auto" }}
            >
              {selectedMembers.map((m, i) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between px-4 py-3"
                  style={{
                    borderBottom: i < selectedMembers.length - 1 ? "1px solid #F3F4F6" : "none",
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={m.name} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: "#1F2937", letterSpacing: "-0.01em" }}>
                        {m.name}
                      </p>
                      <p className="text-xs truncate" style={{ color: "#9CA3AF" }}>{m.email}</p>
                    </div>
                  </div>
                  <div className="text-right ml-3 flex-shrink-0">
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold"
                      style={{
                        backgroundColor: m.status === "overdue" ? "rgba(239,68,68,0.08)" : "rgba(245,158,11,0.08)",
                        color: m.status === "overdue" ? "#DC2626" : "#B45309",
                      }}
                    >
                      {m.status === "overdue"
                        ? `${Math.abs(m.daysUntilExpiry)}d overdue`
                        : `${m.daysUntilExpiry}d left`}
                    </span>
                    <p className="text-xs font-semibold mt-0.5" style={{ color: "#1F2937" }}>
                      ₦{m.amountDue.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-2 px-1">
              <span className="text-xs" style={{ color: "#9CA3AF" }}>Total outstanding</span>
              <span className="text-sm font-bold" style={{ color: "#0D9488" }}>
                ₦{selectedMembers.reduce((s, m) => s + m.amountDue, 0).toLocaleString()}
              </span>
            </div>
          </div>

          <Divider />

          {/* Channel selector — 3 cols on sm+, 1 col on mobile */}
          <div>
            <SectionLabel>Delivery channel</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {CHANNELS.map((ch) => {
                const active = channel === ch.value;
                return (
                  <button
                    key={ch.value}
                    onClick={() => setChannel(ch.value)}
                    className="p-4 rounded-xl text-left transition-all duration-150"
                    style={{
                      border: `2px solid ${active ? "#0D9488" : "#E5E7EB"}`,
                      backgroundColor: active ? "rgba(13,148,136,0.05)" : "#FFFFFF",
                    }}
                  >
                    <p className="text-sm font-bold mb-0.5" style={{ color: active ? "#0D9488" : "#1F2937" }}>
                      {ch.label}
                    </p>
                    <p className="text-[11px] font-semibold" style={{ color: active ? "#0D9488" : "#9CA3AF" }}>
                      {ch.cost}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: "#D1D5DB" }}>{ch.note}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <Divider />

          {/* Templates */}
          <div>
            <SectionLabel>Message template</SectionLabel>
            <div className="space-y-2">
              {DEFAULT_TEMPLATES.map((t) => {
                const active = templateId === t.id;
                const badge  = TYPE_BADGE[t.type ?? "upcoming"];
                return (
                  <button
                    key={t.id}
                    onClick={() => setTemplateId(t.id)}
                    className="w-full flex items-center justify-between p-4 rounded-xl text-left transition-all duration-150"
                    style={{
                      border: `2px solid ${active ? "#0D9488" : "#E5E7EB"}`,
                      backgroundColor: active ? "rgba(13,148,136,0.05)" : "#FFFFFF",
                    }}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <p className="text-sm font-semibold" style={{ color: active ? "#0D9488" : "#1F2937" }}>
                          {t.name}
                        </p>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                          style={{ backgroundColor: badge.bg, color: badge.color }}
                        >
                          {badge.label}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: "#9CA3AF" }}>{t.subject}</p>
                    </div>
                    {active && <CheckCircle className="w-4 h-4 flex-shrink-0 ml-3" style={{ color: "#0D9488" }} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview */}
          {template && (
            <>
              <Divider />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <SectionLabel>Preview</SectionLabel>
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center gap-1.5 text-xs font-semibold -mt-4 transition-colors"
                    style={{ color: "#0D9488" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#0B7A70")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#0D9488")}
                  >
                    {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    {showPreview ? "Hide" : "Personalize"}
                  </button>
                </div>

                {showPreview && selectedMembers.length > 1 && (
                  <div className="relative mb-3">
                    <select
                      value={previewIdx}
                      onChange={(e) => setPreviewIdx(Number(e.target.value))}
                      className="w-full pl-3 pr-8 py-2 text-xs rounded-lg border focus:outline-none appearance-none"
                      style={{ ...FIELD_STYLE, border: "1px solid #E5E7EB" }}
                      onFocus={inputFocus}
                      onBlur={inputBlur}
                    >
                      {selectedMembers.map((m, i) => (
                        <option key={m.id} value={i}>{m.name}</option>
                      ))}
                    </select>
                    <ChevronDown
                      className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: "#9CA3AF" }}
                    />
                  </div>
                )}

                <div
                  className="rounded-xl p-4"
                  style={{ backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB" }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#D1D5DB" }}>
                    Subject
                  </p>
                  <p className="text-sm font-semibold mb-4" style={{ color: "#1F2937" }}>{template.subject}</p>
                  <div
                    className="text-xs font-mono leading-relaxed whitespace-pre-wrap"
                    style={{ color: "#9CA3AF" }}
                  >
                    {showPreview && previewMember ? renderPreview(previewMember) : template.message}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {["{name}", "{membershipType}", "{expiryDate}", "{amount}"].map((v) => (
                    <span
                      key={v}
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md"
                      style={{ backgroundColor: "rgba(13,148,136,0.08)", color: "#0D9488" }}
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          <Divider />

          {/* Personal note */}
          <div>
            <SectionLabel>Personal note (optional)</SectionLabel>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={3}
              placeholder="Add a personal message appended to the template…"
              className="w-full px-3 py-2.5 text-sm rounded-xl border resize-none focus:outline-none transition-colors"
              style={{ ...FIELD_STYLE, border: "1px solid #E5E7EB" }}
              onFocus={inputFocus}
              onBlur={inputBlur}
            />
          </div>

          <Divider />

          {/* Schedule */}
          <div>
            <SectionLabel>Delivery schedule</SectionLabel>
            <div className="space-y-2">
              {[
                { value: "now",   label: "Send immediately",   desc: "Reminders are sent right away"   },
                { value: "later", label: "Schedule for later", desc: "Choose a specific date and time" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-150"
                  style={{
                    border: `2px solid ${scheduleFor === opt.value ? "#0D9488" : "#E5E7EB"}`,
                    backgroundColor: scheduleFor === opt.value ? "rgba(13,148,136,0.05)" : "#FFFFFF",
                  }}
                >
                  <input
                    type="radio"
                    value={opt.value}
                    checked={scheduleFor === opt.value}
                    onChange={() => setScheduleFor(opt.value as "now" | "later")}
                    style={{ accentColor: "#0D9488", colorScheme: "light", flexShrink: 0 }}
                  />
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: scheduleFor === opt.value ? "#0D9488" : "#1F2937" }}
                    >
                      {opt.label}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>{opt.desc}</p>
                  </div>
                </label>
              ))}

              {scheduleFor === "later" && (
                <input
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full mt-2 px-3 py-2 text-sm rounded-xl border focus:outline-none transition-colors"
                  style={{ ...FIELD_STYLE, border: "1px solid #E5E7EB" }}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                />
              )}
            </div>
          </div>

          <Divider />

          {/* Cost summary */}
          <div
            className="rounded-xl p-4 sm:p-5"
            style={{ backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold" style={{ color: "#1F2937" }}>Estimated cost</p>
                <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>
                  {channel === "email" && `${selectedMembers.length} email${selectedMembers.length !== 1 ? "s" : ""} × ₦2`}
                  {channel === "sms"   && `${selectedMembers.length} SMS × ₦10`}
                  {channel === "both"  && `${selectedMembers.length} email + ${selectedMembers.length} SMS`}
                </p>
              </div>
              <p className="text-2xl font-bold" style={{ color: "#0D9488", letterSpacing: "-0.02em" }}>
                ₦{totalCost.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-5 sm:px-7 py-4 sm:py-5 border-t flex-shrink-0"
          style={{ borderColor: "#E5E7EB", backgroundColor: "#F9FAFB" }}
        >
          <button
            onClick={onClose}
            className="px-4 sm:px-5 py-2 text-sm font-semibold transition-colors"
            style={{ color: "#9CA3AF" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#1F2937")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={scheduleFor === "later" && !scheduledDate}
            className="flex items-center gap-2 px-5 sm:px-6 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#F06543" }}
            onMouseEnter={(e) => {
              if (!(scheduleFor === "later" && !scheduledDate))
                e.currentTarget.style.backgroundColor = "#D85436";
            }}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#F06543")}
          >
            <Send className="w-3.5 h-3.5" />
            {scheduleFor === "now" ? "Send now" : "Schedule"}
          </button>
        </div>

        {/* Brand line */}
        <div
          className="h-[3px] flex-shrink-0"
          style={{ background: "linear-gradient(to right, #0D9488, rgba(13,148,136,0.15), transparent)" }}
        />
      </div>
    </div>
  );
};