"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  User,
  Save,
  Loader2,
  UserPlus,
  Landmark,
  Pen,
  Users,
  X,
  Link2,
  Copy,
  Check,
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import apiClient from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { InviteStaffModal } from "@/components/organization/InviteStaffModal";
import AddSubaccountModal from "@/components/organization/AddSubaccountModal";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { Spinner } from "@heroui/react";

type Tab = "organisation" | "profile" | "team" | "banking";
type PwStep = "otp" | "passwords";

const inputBase =
  "w-full rounded-lg border px-4 py-2.5 text-sm transition focus:outline-none focus:ring-2";
const inputActive =
  "border-[#E5E7EB] bg-white text-[#1F2937] focus:border-[#0D9488] focus:ring-[#0D9488]/20";
const inputLocked =
  "border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF] cursor-not-allowed select-none";
const labelClass =
  "block text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-1.5";

function Field({
  id, label, type = "text", value, onChange, disabled, placeholder,
}: {
  id: string; label: string; type?: string; value: string;
  onChange?: (v: string) => void; disabled?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>{label}</label>
      <input
        id={id} type={type} value={value} placeholder={placeholder}
        disabled={disabled} onChange={(e) => onChange?.(e.target.value)}
        className={clsx(inputBase, disabled ? inputLocked : inputActive)}
      />
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 sm:px-6 py-4 border-b border-gray-100">
        <p className="text-sm font-bold text-[#1F2937]">{title}</p>
        {subtitle && <p className="text-xs text-[#9CA3AF] mt-0.5">{subtitle}</p>}
      </div>
      <div className="px-5 sm:px-6 py-5 space-y-4">{children}</div>
    </div>
  );
}

// ── Password helpers ──────────────────────────────────────────────────────────
function PasswordInput({ label, hint, value, onChange, disabled = false, placeholder = "" }: any) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {hint && <p className="text-xs text-[#9CA3AF] mb-1.5">{hint}</p>}
      <div className="relative">
        <input
          type={show ? "text" : "password"} value={value} placeholder={placeholder}
          disabled={disabled} onChange={(e) => onChange?.(e.target.value)}
          className={clsx(inputBase, inputActive, "pr-10")}
        />
        <button type="button" onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1F2937] transition-colors">
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
}

function getStrength(pw: string) {
  let s = 0;
  if (pw.length >= 8)           s++;
  if (pw.length >= 12)          s++;
  if (/[A-Z]/.test(pw))         s++;
  if (/[0-9]/.test(pw))         s++;
  if (/[^A-Za-z0-9]/.test(pw))  s++;
  if (s <= 1) return { score: s, label: "Weak",   color: "#EF4444" };
  if (s <= 2) return { score: s, label: "Fair",   color: "#F59E0B" };
  if (s <= 3) return { score: s, label: "Good",   color: "#3B82F6" };
              return { score: s, label: "Strong", color: "#0D9488" };
}

function PasswordStrength({ password }: { password: string }) {
  const { score, label, color } = getStrength(password);
  const filled = Math.ceil((score / 5) * 4);
  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ height: "3px", flex: 1, borderRadius: "99px", background: i < filled ? color : "#E5E7EB", transition: "background 300ms" }} />
        ))}
      </div>
      <p style={{ fontSize: "11px", fontWeight: 600, color, marginTop: "4px" }}>{label}</p>
    </div>
  );
}

// ── Change Password Modal ─────────────────────────────────────────────────────
function ChangePasswordModal({ email, onClose }: { email: string; onClose: () => void }) {
  const [step, setStep]                       = useState<PwStep>("otp");
  const [otp, setOtp]                         = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sendingCode, setSendingCode]         = useState(false);
  const [codeSent, setCodeSent]               = useState(false);
  const [saving, setSaving]                   = useState(false);

  const sendCode = async () => {
    try {
      setSendingCode(true);
      await apiClient.post("/auth/forgot-password", { email });
      toast.success("Code sent to your email");
      setCodeSent(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send code");
    } finally {
      setSendingCode(false);
    }
  };

  const handleSave = async () => {
    if (!currentPassword)                { toast.error("Enter your current password"); return; }
    if (!newPassword)                    { toast.error("Enter a new password"); return; }
    if (newPassword.length < 8)          { toast.error("Password must be at least 8 characters"); return; }
    if (newPassword !== confirmPassword) { toast.error("Passwords do not match"); return; }
    try {
      setSaving(true);
      await apiClient.post("/auth/reset-password", { email, token: otp, password: newPassword });
      toast.success("Password changed successfully!");
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[51] flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="bg-white rounded-2xl w-full max-w-[440px] shadow-2xl overflow-hidden pointer-events-auto font-[Nunito,sans-serif]">

          {/* Header */}
          <div className="flex items-start justify-between px-6 pt-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0D9488]/10 flex items-center justify-center">
                <Lock size={16} className="text-[#0D9488]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#1F2937]">Change Password</p>
                <p className="text-xs text-[#9CA3AF]">
                  {step === "otp" ? "Step 1 of 2 — Verify it's you" : "Step 2 of 2 — Set new password"}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#1F2937] transition-colors p-1">
              <X size={18} />
            </button>
          </div>

          {/* Progress */}
          <div className="flex gap-1.5 px-6 pt-4">
            {[0, 1].map((i) => (
              <div key={i} style={{ height: "3px", flex: 1, borderRadius: "99px", background: (i === 0 || step === "passwords") ? "#0D9488" : "#E5E7EB", transition: "background 400ms" }} />
            ))}
          </div>

          {/* Body */}
          <div className="p-6">
            <AnimatePresence mode="wait">

              {/* Step 1 — OTP */}
              {step === "otp" && (
                <motion.div key="otp"
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-5"
                >
                  <p className="text-sm text-[#9CA3AF] leading-relaxed">
                    We'll send a one-time code to <strong className="text-[#1F2937]">{email}</strong> to verify your identity.
                  </p>

                  {/* Send code row */}
                  <div className="flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={15} className={codeSent ? "text-[#0D9488]" : "text-[#9CA3AF]"} />
                      <span className={clsx("text-sm font-semibold", codeSent ? "text-[#0D9488]" : "text-[#1F2937]")}>
                        {codeSent ? "Code sent!" : "Send code to email"}
                      </span>
                    </div>
                    <button onClick={sendCode} disabled={sendingCode}
                      className="text-sm font-bold text-[#0D9488] hover:text-[#0B7A70] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                      {sendingCode ? "Sending..." : codeSent ? "Resend" : "Send"}
                    </button>
                  </div>

                  {/* OTP input */}
                  <div>
                    <label className={labelClass}>Enter 6-digit code</label>
                    <input
                      type="text" inputMode="numeric" placeholder="000000" value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="w-full rounded-xl border border-[#E5E7EB] bg-white text-center text-3xl font-extrabold tracking-[0.4em] text-[#1F2937] py-4 focus:outline-none focus:ring-2 focus:border-[#0D9488] focus:ring-[#0D9488]/20 transition"
                    />
                  </div>

                  <Button variant="secondary" className="w-full" disabled={otp.length < 6 || !codeSent} onClick={() => setStep("passwords")}>
                    Continue <ChevronRight size={15} />
                  </Button>
                </motion.div>
              )}

              {/* Step 2 — Passwords */}
              {step === "passwords" && (
                <motion.div key="passwords"
                  initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-4"
                >
                  <PasswordInput
                    label="Current Password" placeholder="Enter your current password"
                    value={currentPassword} onChange={setCurrentPassword} disabled={saving}
                  />

                  <div>
                    <PasswordInput
                      label="New Password" hint="Must be at least 8 characters"
                      placeholder="Enter new password" value={newPassword} onChange={setNewPassword} disabled={saving}
                    />
                    {newPassword.length > 0 && <PasswordStrength password={newPassword} />}
                  </div>

                  <div>
                    <PasswordInput
                      label="Confirm New Password" placeholder="Confirm new password"
                      value={confirmPassword} onChange={setConfirmPassword} disabled={saving}
                    />
                    {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <AlertCircle size={12} className="text-red-500 flex-shrink-0" />
                        <p className="text-xs text-red-500">Passwords do not match</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-1">
                    <Button variant="outline" className="flex-1" onClick={() => setStep("otp")} disabled={saving}>
                      Back
                    </Button>
                    <Button variant="secondary" className="flex-1"
                      disabled={saving || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                      onClick={handleSave}
                    >
                      {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Lock size={14} /> Update Password</>}
                    </Button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("organisation");
  const [copied, setCopied] = useState(false);
  const [showChangePwModal, setShowChangePwModal] = useState(false);

  const [orgData, setOrgData] = useState({
    name: "", email: "", website: "", role: "", phone: "", description: "", slug: "",
  });
  const [profileData, setProfileData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
  });
  const [bankAccount, setBankAccount] = useState({ bank: "", account_number: "" });

  const [loading, setLoading]           = useState(true);
  const [savingOrg, setSavingOrg]       = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [editingOrg, setEditingOrg]     = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isAddSubaccountModalOpen, setIsAddSubaccountModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await apiClient.get("/auth/profile");
        const d = data.data;
        setProfileData({ firstName: d.first_name, lastName: d.last_name, email: d.email, phone: d.phone ?? "" });
        setOrgData({ name: d.organizations[0].name, email: d.organizations[0].email, website: d.organizations[0].website ?? "", role: d.organizations[0].role, phone: d.organizations[0].phone ?? "", description: d.organizations[0].description ?? "", slug: d.organizations[0].slug ?? "" });
        setBankAccount({ bank: d.organizations[0].bank ?? "", account_number: d.organizations[0].account_number ?? "" });
      } catch {
        toast.error("Failed to load settings. Please refresh.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const inviteLink = orgData.slug
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/join/${orgData.slug}`
    : "";

  const handleCopyLink = async () => {
    if (!inviteLink) return;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast.success("Invite link copied!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Could not copy — please copy manually.");
    }
  };

  const handleOrgSubmit = async () => {
    setSavingOrg(true);
    try {
      await apiClient.put("/organizations/me", { organizationName: orgData.name, website: orgData.website, phone: orgData.phone, description: orgData.description });
      toast.success("Organisation updated successfully");
      setEditingOrg(false);
    } catch {
      toast.error("Failed to update organisation.");
    } finally {
      setSavingOrg(false);
    }
  };

  const handleProfileSubmit = async () => {
    setSavingProfile(true);
    try {
      await apiClient.put("/members", { phone: profileData.phone });
      toast.success("Profile updated successfully");
      setEditingProfile(false);
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "organisation", label: "Organisation", icon: <Building2 className="w-4 h-4" /> },
    { id: "profile",      label: "Profile",      icon: <User className="w-4 h-4" /> },
    { id: "team",         label: "Team",         icon: <Users className="w-4 h-4" /> },
    { id: "banking",      label: "Banking",      icon: <Landmark className="w-4 h-4" /> },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] font-[Nunito,sans-serif]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gray-100 border-t-[#0D9488] rounded-full animate-spin" />
          <p className="text-sm text-[#9CA3AF]">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-[Nunito,sans-serif] bg-[#F9FAFB] min-h-screen">

      {/* Change Password Modal */}
      <AnimatePresence>
        {showChangePwModal && (
          <ChangePasswordModal
            email={profileData.email}
            onClose={() => setShowChangePwModal(false)}
          />
        )}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page header */}
        <div className="mb-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#0D9488] mb-1">Account</p>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1F2937]">Settings</h1>
          <p className="text-sm text-[#9CA3AF] mt-0.5">Manage your organisation and account preferences</p>
        </div>

        {/* Tab bar */}
        <div className="mb-6 -mx-4 sm:mx-0 px-4 sm:px-0">
          <div className="flex gap-0 overflow-x-auto border-b border-gray-200 scrollbar-none">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  "flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-all",
                  activeTab === tab.id
                    ? "border-[#0D9488] text-[#0D9488]"
                    : "border-transparent text-[#9CA3AF] hover:text-[#1F2937] hover:border-gray-300",
                )}
              >
                {tab.icon}
                <span className="hidden xs:inline sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ORGANISATION tab */}
        {activeTab === "organisation" && (
          <div className="space-y-4">
            <Section title="Business Information" subtitle="Details visible to your members">
              <Field id="org-name" label="Organisation Name" value={orgData.name} onChange={(v) => setOrgData({ ...orgData, name: v })} disabled={!editingOrg} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field id="org-email" label="Email (read-only)" type="email" value={orgData.email} disabled />
                <Field id="org-role"  label="Role (read-only)"  value={orgData.role}  disabled />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field id="org-phone"   label="Phone"   type="tel" value={orgData.phone}   onChange={(v) => setOrgData({ ...orgData, phone: v })}   disabled={!editingOrg} placeholder="+234 000 0000 000" />
                <Field id="org-website" label="Website" type="url" value={orgData.website} onChange={(v) => setOrgData({ ...orgData, website: v })} disabled={!editingOrg} placeholder="https://yoursite.com" />
              </div>
              <div>
                <label htmlFor="org-description" className={labelClass}>Description</label>
                <textarea id="org-description" value={orgData.description} onChange={(e) => setOrgData({ ...orgData, description: e.target.value })} disabled={!editingOrg} rows={3} placeholder="A short description of your organisation..." className={clsx(inputBase, "resize-none", editingOrg ? inputActive : inputLocked)} />
              </div>
            </Section>

            {/* Invite Link */}
            <Section title="Member Invite Link" subtitle="Share this link so anyone can join your organization">
              {inviteLink ? (
                <div className="space-y-3">
                  <div className="rounded-lg bg-[#0D9488]/5 border border-[#0D9488]/10 px-4 py-3">
                    <p className="text-xs text-[#0D9488] leading-relaxed">Anyone with this link can join your organization. Share it on WhatsApp, in emails, or on social media — they'll be walked through signup automatically.</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-[#F9FAFB] px-3 py-2.5">
                    <Link2 className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />
                    <span className="flex-1 text-xs text-[#1F2937] truncate font-mono">{inviteLink}</span>
                    <button type="button" onClick={handleCopyLink} className="flex items-center gap-1.5 text-xs font-bold text-[#0D9488] hover:text-[#0B7A70] transition-colors flex-shrink-0">
                      {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                    </button>
                  </div>
                  <Button type="button" variant="secondary" size="sm" className="w-full sm:w-auto" onClick={handleCopyLink}>
                    {copied ? <span className="flex items-center gap-2"><Check className="w-4 h-4" /> Link Copied!</span> : <span className="flex items-center gap-2"><Copy className="w-4 h-4" /> Copy Invite Link</span>}
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-[#9CA3AF] text-center py-4">Invite link unavailable. Please refresh the page.</p>
              )}
            </Section>

            <div className="flex justify-end gap-3">
              {editingOrg && <Button variant="outline" onClick={() => setEditingOrg(false)}><X className="h-4 w-4" /> Cancel</Button>}
              {!editingOrg
                ? <Button variant="secondary" onClick={() => setEditingOrg(true)}><Pen className="h-4 w-4" /> Edit Details</Button>
                : <Button variant="secondary" disabled={savingOrg} onClick={handleOrgSubmit}>
                    {savingOrg ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Changes</>}
                  </Button>
              }
            </div>
          </div>
        )}

        {/* PROFILE tab */}
        {activeTab === "profile" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#0D9488]/10 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-extrabold text-[#0D9488]">
                  {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold text-[#1F2937] truncate">{profileData.firstName} {profileData.lastName}</p>
                <p className="text-sm text-[#9CA3AF] truncate">{profileData.email}</p>
                <p className="text-xs font-semibold text-[#0D9488] mt-0.5 capitalize">{orgData.role}</p>
              </div>
            </div>

            <Section title="Personal Information" subtitle="Name and email cannot be changed here">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field id="first-name" label="First Name" value={profileData.firstName} disabled />
                <Field id="last-name"  label="Last Name"  value={profileData.lastName}  disabled />
              </div>
              <Field id="profile-email" label="Email (read-only)" type="email" value={profileData.email} disabled />
              <Field id="profile-phone" label="Phone" type="tel" value={profileData.phone} onChange={(v) => setProfileData({ ...profileData, phone: v })} disabled={!editingProfile} placeholder="+234 000 0000 000" />
            </Section>

            {/* Change Password */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 sm:px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0D9488]/10 flex items-center justify-center">
                  <Lock size={14} className="text-[#0D9488]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1F2937]">Password</p>
                  <p className="text-xs text-[#9CA3AF]">Update your account password</p>
                </div>
              </div>
              <button
                onClick={() => setShowChangePwModal(true)}
                className="text-sm font-bold text-[#0D9488] hover:text-[#0B7A70] hover:underline underline-offset-2 transition-colors"
              >
                Change Password
              </button>
            </div>

            <div className="flex justify-end gap-3">
              {editingProfile && <Button variant="outline" onClick={() => setEditingProfile(false)}><X className="h-4 w-4" /> Cancel</Button>}
              {!editingProfile
                ? <Button variant="secondary" onClick={() => setEditingProfile(true)}><Pen className="h-4 w-4" /> Edit Profile</Button>
                : <Button variant="secondary" disabled={savingProfile} onClick={handleProfileSubmit}>
                    {savingProfile ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Changes</>}
                  </Button>
              }
            </div>
          </div>
        )}

        {/* TEAM tab */}
        {activeTab === "team" && (
          <Section title="Team Members" subtitle="Invite staff to help manage your organisation">
            <div className="py-8 flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#0D9488]/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-[#0D9488]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#1F2937]">Invite your team</p>
                <p className="text-xs text-[#9CA3AF] mt-1 max-w-xs leading-relaxed">Staff members can log in to manage members, plans, and check-ins on your behalf.</p>
              </div>
              <Button variant="secondary" onClick={() => setIsInviteModalOpen(true)}>
                <UserPlus className="h-4 w-4" /> Invite Staff Member
              </Button>
            </div>
          </Section>
        )}

        {/* BANKING tab */}
        {activeTab === "banking" && (
          <Section title="Bank Account" subtitle="Receive payouts from member subscriptions">
            {bankAccount.account_number ? (
              <div className="space-y-4">
                <div className="rounded-lg bg-[#0D9488]/5 border border-[#0D9488]/10 px-4 py-3">
                  <p className="text-xs text-[#0D9488] leading-relaxed">Payouts from member subscriptions will be sent to this account. Contact support if you need to change your bank details.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field id="bank-name"      label="Bank"           value={bankAccount.bank}           disabled />
                  <Field id="account-number" label="Account Number" value={bankAccount.account_number} disabled />
                </div>
                <div className="flex justify-end">
                  <Button variant="secondary" size="sm" onClick={() => setIsAddSubaccountModalOpen(true)}>
                    <Pen className="h-4 w-4" /> Update Bank Account
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-8 flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#0D9488]/10 flex items-center justify-center">
                  <Landmark className="w-6 h-6 text-[#0D9488]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1F2937]">No bank account added</p>
                  <p className="text-xs text-[#9CA3AF] mt-1 max-w-xs leading-relaxed">Add your organisation&apos;s bank account to enable direct payouts when members subscribe.</p>
                </div>
                <Button variant="secondary" onClick={() => setIsAddSubaccountModalOpen(true)}>
                  <Landmark className="h-4 w-4" /> Add Bank Account
                </Button>
              </div>
            )}
          </Section>
        )}
      </div>

      {/* Modals */}
      <InviteStaffModal isOpen={isInviteModalOpen} onOpenChange={setIsInviteModalOpen} onSuccess={() => toast.success("Invitation sent successfully")} />
      <AddSubaccountModal isOpen={isAddSubaccountModalOpen} onOpenChange={setIsAddSubaccountModalOpen} onSuccess={() => toast.success("Bank account added successfully")} organization={orgData} profile={profileData} />
    </div>
  );
}