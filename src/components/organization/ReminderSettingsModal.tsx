import React, { useState } from "react";
import { X, Save, AlertCircle } from "lucide-react";

// Force light color scheme on all native elements — prevents browser dark mode from
// inverting input/select backgrounds and text colours.
const FIELD_STYLE: React.CSSProperties = {
  colorScheme: "light",
  backgroundColor: "#F9FAFB",
  color: "#1F2937",
  borderColor: "#E5E7EB",
};

interface ReminderSettings {
  autoRemindersEnabled: boolean;
  firstReminderDays: number;
  secondReminderDays: number;
  thirdReminderDays: number;
  overdueReminderDays: number;
  maxReminders: number;
  preferredChannel: "email" | "sms" | "both";
  emailEnabled: boolean;
  smsEnabled: boolean;
  sendingStartHour: number;
  sendingEndHour: number;
  sendOnWeekends: boolean;
  defaultUpcomingTemplate: number;
  defaultOverdueTemplate: number;
  minDaysBeforeReminder: number;
  stopRemindersAfterDays: number;
}

interface ReminderSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ReminderSettings;
  onSave: (settings: ReminderSettings) => void;
}

type Tab = "automation" | "channels" | "timing" | "advanced";

const TABS: { id: Tab; label: string }[] = [
  { id: "automation", label: "Automation" },
  { id: "channels",   label: "Channels"   },
  { id: "timing",     label: "Timing"     },
  { id: "advanced",   label: "Advanced"   },
];

// ─── Primitives ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-4"
       style={{ color: "#9CA3AF" }}>
      {children}
    </p>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold mb-1.5" style={{ color: "#1F2937" }}>
      {children}
    </label>
  );
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "#9CA3AF" }}>
      {children}
    </p>
  );
}

function Input({
  value,
  onChange,
  type = "number",
  min,
  max,
}: {
  value: number | string;
  onChange: (v: number | string) => void;
  type?: string;
  min?: number;
  max?: number;
}) {
  return (
    <input
      type={type}
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
      className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none transition-colors duration-150"
      style={{
        ...FIELD_STYLE,
        border: "1px solid #E5E7EB",
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
  );
}

function SelectInput({
  value,
  onChange,
  children,
}: {
  value: number | string;
  onChange: (v: number) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none appearance-none transition-colors duration-150"
      style={{
        ...FIELD_STYLE,
        border: "1px solid #E5E7EB",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "#0D9488";
        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(13,148,136,0.12)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "#E5E7EB";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {children}
    </select>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none"
      style={{ backgroundColor: checked ? "#0D9488" : "#E5E7EB" }}
    >
      <span
        className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200"
        style={{ transform: checked ? "translateX(24px)" : "translateX(4px)" }}
      />
    </button>
  );
}

function Divider() {
  return <div className="my-6" style={{ borderTop: "1px solid #F3F4F6" }} />;
}

// ─── Tab bar ───────────────────────────────────────────────────────────────

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    // Scrollable on mobile so all 4 tabs are reachable
    <div
      className="flex border-b overflow-x-auto px-2 sm:px-6 scrollbar-none"
      style={{ backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }}
    >
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className="relative flex-shrink-0 py-4 px-3 sm:px-4 text-sm font-semibold transition-colors duration-150 whitespace-nowrap"
          style={{ color: active === tab.id ? "#0D9488" : "#9CA3AF" }}
        >
          {tab.label}
          {active === tab.id && (
            <span
              className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
              style={{ backgroundColor: "#0D9488" }}
            />
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Automation tab ────────────────────────────────────────────────────────

function AutomationTab({
  s,
  update,
}: {
  s: ReminderSettings;
  update: <K extends keyof ReminderSettings>(k: K, v: ReminderSettings[K]) => void;
}) {
  return (
    <div className="space-y-6">
      <div
        className="flex items-center justify-between p-4 rounded-xl border"
        style={{
          backgroundColor: s.autoRemindersEnabled ? "rgba(13,148,136,0.04)" : "#F9FAFB",
          borderColor: s.autoRemindersEnabled ? "rgba(13,148,136,0.2)" : "#E5E7EB",
        }}
      >
        <div className="pr-4">
          <p className="text-sm font-semibold" style={{ color: "#1F2937" }}>Automated Reminders</p>
          <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>
            Automatically send reminders based on membership expiry
          </p>
        </div>
        <Toggle checked={s.autoRemindersEnabled} onChange={(v) => update("autoRemindersEnabled", v)} />
      </div>

      {s.autoRemindersEnabled && (
        <>
          <Divider />
          <SectionLabel>Reminder Schedule</SectionLabel>

          {/* 2-col on sm+, 1-col on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(
              [
                ["firstReminderDays",   "1st reminder — days before expiry"],
                ["secondReminderDays",  "2nd reminder — days before expiry"],
                ["thirdReminderDays",   "3rd reminder — days before expiry"],
                ["overdueReminderDays", "Overdue — repeat every X days"],
              ] as [keyof ReminderSettings, string][]
            ).map(([key, label]) => (
              <div key={key}>
                <FieldLabel>{label}</FieldLabel>
                <Input
                  value={s[key] as number}
                  onChange={(v) => update(key, v as ReminderSettings[typeof key])}
                  min={1}
                  max={90}
                />
              </div>
            ))}
          </div>

          <div
            className="flex gap-3 p-4 rounded-xl"
            style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A" }}
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#F59E0B" }} />
            <div className="text-xs leading-relaxed" style={{ color: "#92400E" }}>
              <p className="font-semibold mb-1">Recommended</p>
              14 days → 7 days → 3 days before expiry, then every 3 days overdue.
            </div>
          </div>

          <Divider />
          <SectionLabel>Limits</SectionLabel>
          <div>
            <FieldLabel>Max reminders per member</FieldLabel>
            <Input
              value={s.maxReminders}
              onChange={(v) => update("maxReminders", v as number)}
              min={1}
              max={20}
            />
            <FieldHint>Stop automated reminders after this many attempts.</FieldHint>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Channels tab ──────────────────────────────────────────────────────────

function ChannelsTab({
  s,
  update,
}: {
  s: ReminderSettings;
  update: <K extends keyof ReminderSettings>(k: K, v: ReminderSettings[K]) => void;
}) {
  const options: { value: "email" | "sms" | "both"; label: string; sub: string; cost: string; rate: string }[] = [
    { value: "email", label: "Email", sub: "Most cost-effective", cost: "₦2 / send",  rate: "25–30% open rate" },
    { value: "sms",   label: "SMS",   sub: "Highest open rate",   cost: "₦10 / send", rate: "90–95% open rate" },
    { value: "both",  label: "Both",  sub: "Maximum reach",       cost: "₦12 / send", rate: "Combined" },
  ];

  return (
    <div className="space-y-6">
      <SectionLabel>Preferred delivery channel</SectionLabel>

      {/* 3-col on sm+, 1-col on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {options.map((opt) => {
          const active = s.preferredChannel === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => update("preferredChannel", opt.value)}
              className="p-4 rounded-xl text-left transition-all duration-150"
              style={{
                border: `2px solid ${active ? "#0D9488" : "#E5E7EB"}`,
                backgroundColor: active ? "rgba(13,148,136,0.05)" : "#FFFFFF",
              }}
            >
              <p className="text-sm font-bold mb-0.5" style={{ color: active ? "#0D9488" : "#1F2937" }}>
                {opt.label}
              </p>
              <p className="text-[11px] mb-2" style={{ color: "#9CA3AF" }}>{opt.sub}</p>
              <p className="text-[11px] font-semibold" style={{ color: active ? "#0D9488" : "#9CA3AF" }}>
                {opt.cost}
              </p>
              <p className="text-[10px]" style={{ color: "#D1D5DB" }}>{opt.rate}</p>
            </button>
          );
        })}
      </div>

      <Divider />
      <SectionLabel>Channel toggles</SectionLabel>
      <div className="space-y-3">
        {[
          { key: "emailEnabled" as const, label: "Email", desc: "Send to member's registered email address" },
          { key: "smsEnabled"   as const, label: "SMS",   desc: "Send to member's registered phone number"  },
        ].map(({ key, label, desc }) => (
          <div
            key={key}
            className="flex items-center justify-between p-4 rounded-xl border"
            style={{ backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }}
          >
            <div className="pr-4">
              <p className="text-sm font-semibold" style={{ color: "#1F2937" }}>{label}</p>
              <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>{desc}</p>
            </div>
            <Toggle checked={s[key]} onChange={(v) => update(key, v)} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Timing tab ────────────────────────────────────────────────────────────

function TimingTab({
  s,
  update,
}: {
  s: ReminderSettings;
  update: <K extends keyof ReminderSettings>(k: K, v: ReminderSettings[K]) => void;
}) {
  return (
    <div className="space-y-6">
      <SectionLabel>Sending hours</SectionLabel>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel>Start time</FieldLabel>
          <SelectInput value={s.sendingStartHour} onChange={(v) => update("sendingStartHour", v)}>
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>{i.toString().padStart(2, "0")}:00</option>
            ))}
          </SelectInput>
        </div>
        <div>
          <FieldLabel>End time</FieldLabel>
          <SelectInput value={s.sendingEndHour} onChange={(v) => update("sendingEndHour", v)}>
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>{i.toString().padStart(2, "0")}:00</option>
            ))}
          </SelectInput>
        </div>
      </div>
      <FieldHint>Recommended: 09:00 – 18:00 for better engagement.</FieldHint>

      <Divider />

      <div className="flex items-center justify-between">
        <div className="pr-4">
          <p className="text-sm font-semibold" style={{ color: "#1F2937" }}>Send on weekends</p>
          <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>Allow reminders on Saturdays and Sundays</p>
        </div>
        <Toggle checked={s.sendOnWeekends} onChange={(v) => update("sendOnWeekends", v)} />
      </div>
    </div>
  );
}

// ─── Advanced tab ──────────────────────────────────────────────────────────

function AdvancedTab({
  s,
  update,
}: {
  s: ReminderSettings;
  update: <K extends keyof ReminderSettings>(k: K, v: ReminderSettings[K]) => void;
}) {
  return (
    <div className="space-y-6">
      <SectionLabel>Thresholds</SectionLabel>
      <div className="space-y-5">
        <div>
          <FieldLabel>Minimum days before first reminder</FieldLabel>
          <Input
            value={s.minDaysBeforeReminder}
            onChange={(v) => update("minDaysBeforeReminder", v as number)}
            min={1}
            max={90}
          />
          <FieldHint>Skip reminders for memberships expiring sooner than this.</FieldHint>
        </div>
        <div>
          <FieldLabel>Stop reminders after (days overdue)</FieldLabel>
          <Input
            value={s.stopRemindersAfterDays}
            onChange={(v) => update("stopRemindersAfterDays", v as number)}
            min={1}
            max={365}
          />
          <FieldHint>Automatically stop sending after account is overdue by this many days.</FieldHint>
        </div>
      </div>

      <Divider />
      <SectionLabel>Default templates</SectionLabel>
      <div className="space-y-4">
        <div>
          <FieldLabel>Upcoming expiry template</FieldLabel>
          <SelectInput
            value={s.defaultUpcomingTemplate}
            onChange={(v) => update("defaultUpcomingTemplate", v)}
          >
            <option value={1}>Upcoming Expiry — Friendly</option>
            <option value={4}>Gentle Reminder</option>
          </SelectInput>
        </div>
        <div>
          <FieldLabel>Overdue payment template</FieldLabel>
          <SelectInput
            value={s.defaultOverdueTemplate}
            onChange={(v) => update("defaultOverdueTemplate", v)}
          >
            <option value={2}>Overdue Payment — Urgent</option>
            <option value={3}>Final Notice — Critical</option>
          </SelectInput>
        </div>
      </div>
    </div>
  );
}

// ─── Main modal ────────────────────────────────────────────────────────────

export const ReminderSettingsModal: React.FC<ReminderSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [local, setLocal]        = useState<ReminderSettings>(settings);
  const [tab, setTab]            = useState<Tab>("automation");
  const [hasChanges, setChanges] = useState(false);

  if (!isOpen) return null;

  const update = <K extends keyof ReminderSettings>(k: K, v: ReminderSettings[K]) => {
    setLocal((prev) => ({ ...prev, [k]: v }));
    setChanges(true);
  };

  const handleSave  = () => { onSave(local); setChanges(false); onClose(); };
  const handleReset = () => { setLocal(settings); setChanges(false); };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
      style={{ backgroundColor: "rgba(17,24,39,0.45)", backdropFilter: "blur(4px)" }}
    >
      <div
        // Full-screen sheet on mobile, centred modal on sm+
        className="w-full sm:max-w-2xl max-h-[95dvh] sm:max-h-[90vh] flex flex-col overflow-hidden sm:rounded-2xl rounded-t-2xl"
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
              Reminder Settings
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>
              Configure automated payment reminder preferences
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 ml-3">
            {hasChanges && (
              <span
                className="hidden sm:inline text-[11px] font-semibold px-2.5 py-1 rounded-full"
                style={{ color: "#92400E", backgroundColor: "#FFFBEB", border: "1px solid #FDE68A" }}
              >
                Unsaved changes
              </span>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg transition-colors flex-shrink-0"
              style={{ color: "#9CA3AF" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F3F4F6")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile unsaved pill */}
        {hasChanges && (
          <div
            className="sm:hidden px-5 py-2 text-center text-[11px] font-semibold"
            style={{ color: "#92400E", backgroundColor: "#FFFBEB", borderBottom: "1px solid #FDE68A" }}
          >
            Unsaved changes
          </div>
        )}

        {/* Tabs */}
        <TabBar active={tab} onChange={setTab} />

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-5 sm:py-7">
          {tab === "automation" && <AutomationTab s={local} update={update} />}
          {tab === "channels"   && <ChannelsTab   s={local} update={update} />}
          {tab === "timing"     && <TimingTab     s={local} update={update} />}
          {tab === "advanced"   && <AdvancedTab   s={local} update={update} />}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-5 sm:px-7 py-4 sm:py-5 border-t flex-shrink-0"
          style={{ borderColor: "#E5E7EB", backgroundColor: "#F9FAFB" }}
        >
          <button
            onClick={handleReset}
            disabled={!hasChanges}
            className="text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ color: "#9CA3AF" }}
            onMouseEnter={(e) => { if (hasChanges) e.currentTarget.style.color = "#1F2937"; }}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
          >
            Reset
          </button>
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="px-4 sm:px-5 py-2 text-sm font-semibold rounded-lg border transition-colors"
              style={{ color: "#1F2937", borderColor: "#E5E7EB", backgroundColor: "#FFFFFF" }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 sm:px-5 py-2 text-sm font-semibold text-white rounded-lg flex items-center gap-2 transition-colors duration-150"
              style={{ backgroundColor: "#0D9488" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0B7A70")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0D9488")}
            >
              <Save className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save settings</span>
              <span className="sm:hidden">Save</span>
            </button>
          </div>
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