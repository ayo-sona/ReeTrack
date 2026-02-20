import React, { useState } from "react";
import { Search, Send, Download, ChevronDown } from "lucide-react";

// Forces light colour scheme on all native inputs — prevents browser dark mode inversion
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
  lastReminder: string | null;
  remindersSent: number;
  amountDue: number;
}

interface RemindersTableProps {
  members: Member[];
  onSendReminder: (memberIds: number[]) => void;
  onSelectMembers?: (memberIds: number[]) => void;
}

type FilterStatus = "all" | "upcoming" | "overdue";
type ActiveTab    = "active" | "history";

const reminderHistory = [
  { id: 1, memberName: "Jane Smith",     type: "email" as const, sentDate: "2026-01-02", status: "delivered" as const, template: "Overdue Payment"  },
  { id: 2, memberName: "John Doe",       type: "sms"   as const, sentDate: "2025-12-28", status: "delivered" as const, template: "Upcoming Expiry"  },
  { id: 3, memberName: "Sarah Williams", type: "email" as const, sentDate: "2026-01-01", status: "opened"    as const, template: "Upcoming Expiry"  },
  { id: 4, memberName: "David Brown",    type: "sms"   as const, sentDate: "2025-12-30", status: "delivered" as const, template: "Final Notice"     },
];

// ─── Sub-components ─────────────────────────────────────────────────────────

function Avatar({ name }: { name: string }) {
  return (
    <div className="relative w-8 h-8 flex-shrink-0">
      <span
        className="absolute left-0 top-1 bottom-1 w-[2px] rounded-full"
        style={{ backgroundColor: "#0D9488" }}
      />
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
        style={{ backgroundColor: "#F3F4F6", color: "#0D9488" }}
      >
        {(name || "U").charAt(0).toUpperCase()}
      </div>
    </div>
  );
}

function StatusPill({ member }: { member: Member }) {
  const isOverdue = member.status === "overdue";
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold"
      style={{
        backgroundColor: isOverdue ? "rgba(239,68,68,0.08)" : "rgba(245,158,11,0.08)",
        color: isOverdue ? "#DC2626" : "#B45309",
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: isOverdue ? "#EF4444" : "#F59E0B" }}
      />
      {isOverdue ? `${Math.abs(member.daysUntilExpiry)}d overdue` : `${member.daysUntilExpiry}d left`}
    </span>
  );
}

function ChannelBadge({ type }: { type: "email" | "sms" }) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold"
      style={{
        backgroundColor: type === "email" ? "rgba(13,148,136,0.08)" : "rgba(240,101,67,0.08)",
        color: type === "email" ? "#0D9488" : "#F06543",
      }}
    >
      {type === "email" ? "Email" : "SMS"}
    </span>
  );
}

function DeliveryBadge({ status }: { status: "delivered" | "opened" }) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold"
      style={{
        backgroundColor: status === "opened" ? "rgba(13,148,136,0.08)" : "#F3F4F6",
        color: status === "opened" ? "#0D9488" : "#9CA3AF",
      }}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// Mobile card for a single active-reminder member
function MemberCard({
  member,
  selected,
  onToggle,
  onSend,
}: {
  member: Member;
  selected: boolean;
  onToggle: () => void;
  onSend: () => void;
}) {
  return (
    <div
      className="p-4 rounded-xl border transition-colors"
      style={{
        backgroundColor: selected ? "rgba(13,148,136,0.03)" : "#FFFFFF",
        borderColor: selected ? "rgba(13,148,136,0.3)" : "#E5E7EB",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggle}
            style={{ accentColor: "#0D9488", colorScheme: "light", flexShrink: 0 }}
          />
          <Avatar name={member.name} />
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: "#1F2937", letterSpacing: "-0.01em" }}>
              {member.name}
            </p>
            <p className="text-xs truncate" style={{ color: "#9CA3AF" }}>{member.email}</p>
          </div>
        </div>
        <button
          onClick={onSend}
          className="flex-shrink-0 text-xs font-bold transition-colors"
          style={{ color: "#0D9488" }}
        >
          Send
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 items-center">
        <span
          className="text-[11px] font-bold px-2.5 py-0.5 rounded-md"
          style={{ backgroundColor: "rgba(13,148,136,0.08)", color: "#0D9488" }}
        >
          {member.membershipType}
        </span>
        <StatusPill member={member} />
        <span className="text-sm font-semibold ml-auto" style={{ color: "#1F2937" }}>
          ₦{member.amountDue.toLocaleString()}
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs" style={{ color: "#9CA3AF" }}>Expires {member.expiryDate}</span>
        {member.lastReminder && (
          <span className="text-xs" style={{ color: "#D1D5DB" }}>
            Last sent {member.lastReminder}
            {member.remindersSent > 0 && ` ×${member.remindersSent}`}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

export const RemindersTable: React.FC<RemindersTableProps> = ({
  members,
  onSendReminder,
  onSelectMembers,
}) => {
  const [selected, setSelected] = useState<number[]>([]);
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState<FilterStatus>("all");
  const [tab,      setTab]      = useState<ActiveTab>("active");

  const filtered = members.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || m.status === filter;
    return matchSearch && matchFilter;
  });

  const toggleMember = (id: number) => {
    const next = selected.includes(id)
      ? selected.filter((x) => x !== id)
      : [...selected, id];
    setSelected(next);
    onSelectMembers?.(next);
  };

  const toggleAll = () => {
    const next = selected.length === filtered.length ? [] : filtered.map((m) => m.id);
    setSelected(next);
    onSelectMembers?.(next);
  };

  const COL_LABEL: React.CSSProperties = {
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#9CA3AF",
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #E5E7EB",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 4px 24px rgba(13,148,136,0.06)",
      }}
    >
      {/* ── Tab bar ── */}
      <div
        className="flex border-b px-4 sm:px-6"
        style={{ backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }}
      >
        {(["active", "history"] as ActiveTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="relative py-4 px-3 sm:px-4 text-sm font-semibold transition-colors duration-150 whitespace-nowrap"
            style={{ color: tab === t ? "#0D9488" : "#9CA3AF" }}
          >
            {t === "active" ? "Active Reminders" : "History"}
            {tab === t && (
              <span
                className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                style={{ backgroundColor: "#0D9488" }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="p-4 sm:p-6">

        {/* ══ ACTIVE TAB ══════════════════════════════════════════════════ */}
        {tab === "active" && (
          <>
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <Search
                  className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#9CA3AF" }}
                />
                <input
                  type="text"
                  placeholder="Search members…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border focus:outline-none transition-colors"
                  style={{
                    ...FIELD_STYLE,
                    border: "1px solid #E5E7EB",
                    width: "100%",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#0D9488";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(13,148,136,0.12)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#E5E7EB";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              <div className="flex gap-3">
                <div className="relative flex-1 sm:flex-none">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as FilterStatus)}
                    className="w-full pl-3 pr-8 py-2 text-sm rounded-lg border focus:outline-none appearance-none transition-colors"
                    style={{ ...FIELD_STYLE, border: "1px solid #E5E7EB" }}
                  >
                    <option value="all">All</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="overdue">Overdue</option>
                  </select>
                  <ChevronDown
                    className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: "#9CA3AF" }}
                  />
                </div>

                <button
                  onClick={() => selected.length > 0 && onSendReminder(selected)}
                  disabled={selected.length === 0}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                  style={{ backgroundColor: "#F06543" }}
                  onMouseEnter={(e) => { if (selected.length > 0) e.currentTarget.style.backgroundColor = "#D85436"; }}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#F06543")}
                >
                  <Send className="w-3.5 h-3.5" />
                  Send{selected.length > 0 ? ` (${selected.length})` : ""}
                </button>
              </div>
            </div>

            {/* ── Mobile card list ── */}
            <div className="sm:hidden space-y-3">
              {filtered.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  selected={selected.includes(member.id)}
                  onToggle={() => toggleMember(member.id)}
                  onSend={() => onSendReminder([member.id])}
                />
              ))}
              {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-sm font-semibold" style={{ color: "#9CA3AF" }}>No members match your search</p>
                  <p className="text-xs mt-1" style={{ color: "#D1D5DB" }}>Try adjusting your filters</p>
                </div>
              )}
            </div>

            {/* ── Desktop table ── */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid #E5E7EB", backgroundColor: "#F9FAFB" }}>
                    <th className="px-4 py-3 text-left w-8">
                      <input
                        type="checkbox"
                        checked={selected.length === filtered.length && filtered.length > 0}
                        onChange={toggleAll}
                        style={{ accentColor: "#0D9488", colorScheme: "light" }}
                      />
                    </th>
                    {["Member", "Membership", "Expiry", "Status", "Due", "Last sent", ""].map((col) => (
                      <th key={col} className="px-4 py-3 text-left">
                        <span style={COL_LABEL}>{col}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((member) => (
                    <tr
                      key={member.id}
                      className="transition-colors duration-150"
                      style={{ borderBottom: "1px solid #F3F4F6" }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F9FAFB")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selected.includes(member.id)}
                          onChange={() => toggleMember(member.id)}
                          style={{ accentColor: "#0D9488", colorScheme: "light" }}
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={member.name} />
                          <div>
                            <p className="text-sm font-semibold" style={{ color: "#1F2937", letterSpacing: "-0.01em" }}>
                              {member.name}
                            </p>
                            <p className="text-xs" style={{ color: "#9CA3AF" }}>{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className="text-[11px] font-bold px-2.5 py-0.5 rounded-md"
                          style={{ backgroundColor: "rgba(13,148,136,0.08)", color: "#0D9488" }}
                        >
                          {member.membershipType}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm" style={{ color: "#9CA3AF" }}>{member.expiryDate}</span>
                      </td>
                      <td className="px-4 py-4"><StatusPill member={member} /></td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-semibold" style={{ color: "#1F2937" }}>
                          ₦{member.amountDue.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm" style={{ color: "#9CA3AF" }}>
                          {member.lastReminder || "—"}
                          {member.remindersSent > 0 && (
                            <span className="ml-1.5 text-[10px] font-bold" style={{ color: "#D1D5DB" }}>
                              ×{member.remindersSent}
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => onSendReminder([member.id])}
                          className="text-xs font-bold transition-colors"
                          style={{ color: "#0D9488" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#0B7A70")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "#0D9488")}
                        >
                          Send
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16">
                  <p className="text-sm font-semibold" style={{ color: "#9CA3AF" }}>No members match your search</p>
                  <p className="text-xs mt-1" style={{ color: "#D1D5DB" }}>Try adjusting your filters</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ══ HISTORY TAB ═════════════════════════════════════════════════ */}
        {tab === "history" && (
          <>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold" style={{ color: "#1F2937", letterSpacing: "-0.02em" }}>
                  Reminder History
                </h3>
                <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>All sent reminders</p>
              </div>
              <button
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border transition-colors"
                style={{
                  color: "#1F2937",
                  backgroundColor: "#F9FAFB",
                  borderColor: "#E5E7EB",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FFFFFF")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#F9FAFB")}
              >
                <Download className="w-3.5 h-3.5" style={{ color: "#9CA3AF" }} />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>

            {/* Mobile history cards */}
            <div className="sm:hidden space-y-3">
              {reminderHistory.map((r) => (
                <div
                  key={r.id}
                  className="p-4 rounded-xl border"
                  style={{ backgroundColor: "#FAFAFA", borderColor: "#E5E7EB" }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar name={r.memberName} />
                      <span className="text-sm font-semibold truncate" style={{ color: "#1F2937" }}>
                        {r.memberName}
                      </span>
                    </div>
                    <DeliveryBadge status={r.status} />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 items-center">
                    <ChannelBadge type={r.type} />
                    <span className="text-xs" style={{ color: "#9CA3AF" }}>{r.template}</span>
                    <span className="text-xs ml-auto" style={{ color: "#D1D5DB" }}>{r.sentDate}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop history table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid #E5E7EB", backgroundColor: "#F9FAFB" }}>
                    {["Member", "Channel", "Template", "Sent", "Status"].map((col) => (
                      <th key={col} className="px-4 py-3 text-left">
                        <span style={COL_LABEL}>{col}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reminderHistory.map((r) => (
                    <tr
                      key={r.id}
                      className="transition-colors duration-150"
                      style={{ borderBottom: "1px solid #F3F4F6" }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F9FAFB")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={r.memberName} />
                          <span className="text-sm font-semibold" style={{ color: "#1F2937" }}>{r.memberName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4"><ChannelBadge type={r.type} /></td>
                      <td className="px-4 py-4"><span className="text-sm" style={{ color: "#9CA3AF" }}>{r.template}</span></td>
                      <td className="px-4 py-4"><span className="text-sm" style={{ color: "#9CA3AF" }}>{r.sentDate}</span></td>
                      <td className="px-4 py-4"><DeliveryBadge status={r.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Brand line */}
      <div
        className="h-[3px]"
        style={{ background: "linear-gradient(to right, #0D9488, rgba(13,148,136,0.15), transparent)" }}
      />
    </div>
  );
};