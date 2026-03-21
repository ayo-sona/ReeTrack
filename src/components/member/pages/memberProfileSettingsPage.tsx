"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, AlertCircle, User, LogOut, ShieldCheck, Lock, Eye, EyeOff, X, ChevronRight } from "lucide-react";
import { useProfile, useUpdateProfile } from "@/hooks/memberHook/useMember";
import { deleteCookie } from "cookies-next";
import { Spinner } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import apiClient from "@/lib/apiClient";

const C = {
  teal:     "#0D9488",
  coral:    "#F06543",
  snow:     "#F9FAFB",
  white:    "#FFFFFF",
  ink:      "#1F2937",
  coolGrey: "#9CA3AF",
  border:   "#E5E7EB",
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] },
  }),
};

interface ApiResponse<T> { statusCode: number; message: string; data: T; }
interface UserProfile {
  id: string; email: string; first_name: string; last_name: string;
  phone: string; status: string; email_verified: boolean;
  date_of_birth: string | null; address: string | null;
  last_login_at: string | null; created_at: string; updated_at: string;
}

function Field({ label, hint, value, onChange, type = "text", disabled = false, placeholder = "", rightElement }: any) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <label style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600, fontSize: "13px", color: C.ink }}>{label}</label>
      {hint && <p style={{ fontWeight: 400, fontSize: "12px", color: C.coolGrey, marginBottom: "2px" }}>{hint}</p>}
      <div style={{ position: "relative" }}>
        <input
          type={type} value={value} onChange={(e: any) => onChange?.(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          disabled={disabled} placeholder={placeholder}
          style={{
            padding: rightElement ? "11px 42px 11px 14px" : "11px 14px",
            borderRadius: "8px",
            border: `1px solid ${focused && !disabled ? C.teal : C.border}`,
            boxShadow: focused && !disabled ? "0 0 0 3px rgba(13,148,136,0.12)" : "none",
            background: disabled ? C.snow : C.white,
            fontFamily: "Nunito, sans-serif", fontWeight: 400, fontSize: "14px",
            color: disabled ? C.coolGrey : C.ink, outline: "none",
            cursor: disabled ? "not-allowed" : "text",
            transition: "border-color 300ms, box-shadow 300ms",
            width: "100%",
          }}
        />
        {rightElement && (
          <div style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)" }}>
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
}

function PasswordField({ label, hint, value, onChange, disabled = false, placeholder = "" }: any) {
  const [show, setShow] = useState(false);
  return (
    <Field
      label={label} hint={hint} value={value} onChange={onChange}
      type={show ? "text" : "password"} disabled={disabled} placeholder={placeholder}
      rightElement={
        <button type="button" onClick={() => setShow((s) => !s)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", color: C.coolGrey }}>
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      }
    />
  );
}

// ── Password strength ─────────────────────────────────────────────────────────
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
    <div style={{ marginTop: "8px" }}>
      <div style={{ display: "flex", gap: "4px" }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ height: "3px", flex: 1, borderRadius: "99px", background: i < filled ? color : C.border, transition: "background 300ms" }} />
        ))}
      </div>
      <p style={{ fontWeight: 600, fontSize: "11px", color, marginTop: "4px" }}>{label}</p>
    </div>
  );
}

// ── Change Password Modal ─────────────────────────────────────────────────────
type PwStep = "otp" | "passwords";

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
    if (!currentPassword)                     { toast.error("Enter your current password"); return; }
    if (!newPassword)                         { toast.error("Enter a new password"); return; }
    if (newPassword.length < 8)               { toast.error("Password must be at least 8 characters"); return; }
    if (newPassword !== confirmPassword)      { toast.error("Passwords do not match"); return; }
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
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", zIndex: 50 }}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 51, padding: "16px", pointerEvents: "none" }}
      >
        <div style={{ background: C.white, borderRadius: "20px", width: "100%", maxWidth: "440px", boxShadow: "0 24px 64px rgba(0,0,0,0.18)", overflow: "hidden", pointerEvents: "all" }}>

          {/* Modal header */}
          <div style={{ padding: "24px 24px 0", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(13,148,136,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Lock size={16} style={{ color: C.teal }} />
              </div>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: "16px", color: C.ink, marginBottom: "2px" }}>Change Password</h3>
                <p style={{ fontWeight: 400, fontSize: "12px", color: C.coolGrey }}>
                  {step === "otp" ? "Step 1 of 2 — Verify it's you" : "Step 2 of 2 — Set new password"}
                </p>
              </div>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.coolGrey, padding: "4px", borderRadius: "6px", display: "flex" }}>
              <X size={18} />
            </button>
          </div>

          {/* Step progress bar */}
          <div style={{ padding: "16px 24px 0", display: "flex", gap: "6px" }}>
            {[0, 1].map((i) => (
              <div key={i} style={{ height: "3px", flex: 1, borderRadius: "99px", background: (i === 0 || step === "passwords") ? C.teal : C.border, transition: "background 400ms" }} />
            ))}
          </div>

          {/* Modal body */}
          <div style={{ padding: "24px" }}>
            <AnimatePresence mode="wait">

              {/* Step 1 — OTP */}
              {step === "otp" && (
                <motion.div key="otp"
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: "flex", flexDirection: "column", gap: "20px" }}
                >
                  <p style={{ fontWeight: 400, fontSize: "14px", color: C.coolGrey, lineHeight: 1.6 }}>
                    We'll send a one-time code to <strong style={{ color: C.ink }}>{email}</strong> to verify your identity.
                  </p>

                  {/* Send code row */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 14px", borderRadius: "10px", background: C.snow, border: `1px solid ${C.border}`, justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <ShieldCheck size={15} style={{ color: codeSent ? C.teal : C.coolGrey }} />
                      <span style={{ fontWeight: 600, fontSize: "13px", color: codeSent ? C.teal : C.ink }}>
                        {codeSent ? "Code sent!" : "Send code to email"}
                      </span>
                    </div>
                    <button onClick={sendCode} disabled={sendingCode}
                      style={{ background: "none", border: "none", cursor: sendingCode ? "not-allowed" : "pointer", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "13px", color: C.teal, padding: 0, opacity: sendingCode ? 0.5 : 1 }}>
                      {sendingCode ? "Sending..." : codeSent ? "Resend" : "Send"}
                    </button>
                  </div>

                  {/* OTP input */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600, fontSize: "13px", color: C.ink }}>Enter 6-digit code</label>
                    <input
                      type="text" inputMode="numeric" placeholder="000000" value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      style={{ padding: "14px", borderRadius: "10px", border: `1px solid ${C.border}`, background: C.white, fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "28px", color: C.ink, outline: "none", width: "100%", letterSpacing: "0.4em", textAlign: "center", transition: "border-color 300ms, box-shadow 300ms" }}
                      onFocus={(e) => { e.target.style.borderColor = C.teal; e.target.style.boxShadow = "0 0 0 3px rgba(13,148,136,0.12)"; }}
                      onBlur={(e)  => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}
                    />
                  </div>

                  <Button variant="default" className="w-full" disabled={otp.length < 6 || !codeSent} onClick={() => setStep("passwords")}>
                    Continue <ChevronRight size={15} />
                  </Button>
                </motion.div>
              )}

              {/* Step 2 — Passwords */}
              {step === "passwords" && (
                <motion.div key="passwords"
                  initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: "flex", flexDirection: "column", gap: "18px" }}
                >
                  <PasswordField
                    label="Current Password" placeholder="Enter your current password"
                    value={currentPassword} onChange={setCurrentPassword} disabled={saving}
                  />

                  <div>
                    <PasswordField
                      label="New Password" hint="Must be at least 8 characters"
                      placeholder="Enter new password" value={newPassword} onChange={setNewPassword} disabled={saving}
                    />
                    {newPassword.length > 0 && <PasswordStrength password={newPassword} />}
                  </div>

                  <div>
                    <PasswordField
                      label="Confirm New Password" placeholder="Confirm new password"
                      value={confirmPassword} onChange={setConfirmPassword} disabled={saving}
                    />
                    {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px" }}>
                        <AlertCircle size={13} style={{ color: "#EF4444", flexShrink: 0 }} />
                        <p style={{ fontWeight: 400, fontSize: "12px", color: "#EF4444" }}>Passwords do not match</p>
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: "10px", paddingTop: "4px" }}>
                    <Button variant="outline" onClick={() => setStep("otp")} disabled={saving} style={{ flex: 1 }}>
                      Back
                    </Button>
                    <Button variant="default" style={{ flex: 1 }}
                      disabled={saving || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                      onClick={handleSave}
                    >
                      {saving ? <Spinner color="current" size="sm" /> : <Lock size={14} />}
                      {saving ? "Saving..." : "Update Password"}
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
export default function ProfileSettingsPage() {
  const router = useRouter();
  const { data: profile, isLoading, error } = useProfile();
  const updateProfile = useUpdateProfile();

  const wrappedProfile = profile as unknown as ApiResponse<UserProfile> | undefined;
  const actualProfile  = wrappedProfile?.data || (profile as unknown as UserProfile);

  const [activeTab, setActiveTab]                 = useState<"profile" | "account">("profile");
  const [showChangePwModal, setShowChangePwModal] = useState(false);
  const [isEditing, setIsEditing]                 = useState(false);
  const [loggingOut, setLoggingOut]               = useState(false);
  const [editedDateOfBirth, setEditedDateOfBirth] = useState<string | null>(null);
  const [editedAddress, setEditedAddress]         = useState<string | null>(null);
  const [editedPhone, setEditedPhone]             = useState<string | null>(null);
  const [showSuccess, setShowSuccess]             = useState(false);

  const dateOfBirth = editedDateOfBirth ?? (actualProfile?.date_of_birth || "");
  const address     = editedAddress     ?? (actualProfile?.address || "");
  const phone       = editedPhone       ?? (actualProfile?.phone || "");

  const handleSaveProfile = async () => {
    try {
      await updateProfile.mutateAsync({ date_of_birth: dateOfBirth || undefined, address: address || undefined, phone: phone || undefined });
      setIsEditing(false);
      setEditedDateOfBirth(null);
      setEditedAddress(null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) { console.error("Failed to update profile:", error); }
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await apiClient.post("/auth/logout");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    } finally {
      if (typeof window !== "undefined") localStorage.clear();
      deleteCookie("access_token");
      deleteCookie("current_role");
      deleteCookie("user_roles");
      setLoggingOut(false);
      router.push("/auth/login");
      router.refresh();
    }
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", background: C.snow, padding: "32px 24px", fontFamily: "Nunito, sans-serif" }}>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>
          {[48, 320].map((h, i) => (
            <div key={i} style={{ height: `${h}px`, borderRadius: "12px", background: C.white, border: `1px solid ${C.border}`, animation: "pulse 1.5s ease-in-out infinite" }} />
          ))}
        </div>
      </div>
    );
  }

  if (error || !profile || !actualProfile) {
    return (
      <div style={{ minHeight: "100vh", background: C.snow, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Nunito, sans-serif", padding: "24px" }}>
        <div style={{ textAlign: "center", maxWidth: "360px" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: C.snow, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: C.coolGrey }}>
            <AlertCircle size={28} />
          </div>
          <h3 style={{ fontWeight: 700, fontSize: "18px", color: C.ink, marginBottom: "8px" }}>
            {error ? "Error Loading Profile" : "Unable to load profile"}
          </h3>
          <p style={{ fontWeight: 400, fontSize: "14px", color: C.coolGrey, marginBottom: "20px" }}>
            {error ? (error as any).message : "Please try refreshing the page."}
          </p>
          <Button variant="secondary" onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  const initials = (actualProfile.first_name?.charAt(0) || "") + (actualProfile.last_name?.charAt(0) || "");

  const tabs = [
    { key: "profile", label: "Profile", icon: <User size={16} /> },
    { key: "account", label: "Account", icon: <AlertCircle size={16} /> },
  ] as const;

  return (
    <div style={{ minHeight: "100vh", background: C.snow, fontFamily: "Nunito, sans-serif", padding: "24px 16px 96px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        input[type=date]::-webkit-calendar-picker-indicator { opacity: 0.4; cursor: pointer; }
        input::placeholder { color: #9CA3AF; }
        .settings-layout { display: grid; grid-template-columns: 200px 1fr; gap: 20px; align-items: start; }
        .settings-sidebar { position: sticky; top: 24px; }
        .fields-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 12px; }
        .fields-grid-editable { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
        .account-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .card-padding { padding: 36px; }
        .avatar-section { display: flex; align-items: center; gap: 20px; margin-bottom: 28px; padding-bottom: 28px; border-bottom: 1px solid ${C.border}; }
        .edit-actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; justify-content: flex-end; }
        .tab-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 12px; }
        .page-header { margin-bottom: 28px; }
        .change-pw-btn:hover span { text-decoration-color: ${C.teal} !important; }
        @media (max-width: 768px) {
          .settings-layout { grid-template-columns: 1fr; }
          .settings-sidebar { position: static; }
          .settings-sidebar > div { flex-direction: row !important; padding: 8px !important; }
          .settings-sidebar button { flex: 1; justify-content: center !important; }
          .fields-grid-2 { grid-template-columns: 1fr; }
          .fields-grid-editable { grid-template-columns: 1fr; }
          .account-grid { grid-template-columns: 1fr; }
          .card-padding { padding: 24px 20px; }
        }
        @media (max-width: 480px) {
          .card-padding { padding: 20px 16px; }
          .edit-actions { width: 100%; justify-content: flex-start; }
          .tab-header { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showChangePwModal && (
          <ChangePasswordModal
            email={actualProfile.email}
            onClose={() => setShowChangePwModal(false)}
          />
        )}
      </AnimatePresence>

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="page-header">
          <h1 style={{ fontWeight: 800, fontSize: "clamp(24px, 5vw, 32px)", color: C.ink, letterSpacing: "-0.4px" }}>Settings</h1>
          <p style={{ fontWeight: 400, fontSize: "15px", color: C.coolGrey, marginTop: "4px" }}>Manage your account settings and preferences</p>
        </motion.div>

        {/* Success toast */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(13,148,136,0.08)", border: "1px solid rgba(13,148,136,0.2)", borderRadius: "10px", padding: "14px 18px", marginBottom: "20px" }}
            >
              <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: C.teal, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <p style={{ fontWeight: 600, fontSize: "14px", color: C.teal }}>Profile updated successfully</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="settings-layout">

          {/* Sidebar */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1} className="settings-sidebar">
            <div style={{ background: C.white, borderRadius: "12px", border: `1px solid ${C.border}`, padding: "10px", display: "flex", flexDirection: "column", gap: "4px" }}>
              {tabs.map((tab) => (
                <Button key={tab.key} variant={activeTab === tab.key ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab(tab.key)}>
                  {tab.icon}
                  {tab.label}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
            <AnimatePresence mode="wait">

              {/* Profile tab */}
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  style={{ background: C.white, borderRadius: "16px", border: `1px solid ${C.border}` }}
                  className="card-padding"
                >
                  {/* Header */}
                  <div className="tab-header">
                    <h2 style={{ fontWeight: 700, fontSize: "18px", color: C.teal }}>Personal Information</h2>
                    {!isEditing ? (
                      <Button variant="outline" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                    ) : (
                      <div className="edit-actions">
                        <Button variant="ghost" onClick={() => { setIsEditing(false); setEditedDateOfBirth(null); setEditedAddress(null); }}>Cancel</Button>
                        <div style={{ position: "relative" }}>
                          <div style={{ position: "absolute", inset: "-4px", borderRadius: "12px", background: `linear-gradient(to right, rgba(240,101,67,0.4), rgba(240,101,67,0.2), rgba(240,101,67,0.4))`, filter: "blur(12px)", opacity: 0.65, zIndex: 0 }} />
                          <div style={{ position: "relative", zIndex: 1 }}>
                            <Button variant="default" disabled={updateProfile.isPending} onClick={handleSaveProfile}>
                              <Save size={14} />
                              {updateProfile.isPending ? "Saving..." : "Save Changes"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="avatar-section">
                    <div style={{ width: "72px", height: "72px", borderRadius: "18px", background: C.teal, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "24px", color: C.white, flexShrink: 0, letterSpacing: "-0.5px" }}>
                      {initials}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: "18px", color: C.ink, marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {actualProfile.first_name} {actualProfile.last_name}
                      </p>
                      <p style={{ fontWeight: 400, fontSize: "14px", color: C.coolGrey, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{actualProfile.email}</p>
                      <p style={{ fontWeight: 400, fontSize: "12px", color: C.coolGrey, marginTop: "4px" }}>
                        Member since {new Date(actualProfile.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                      </p>
                    </div>
                  </div>

                  {/* Read-only fields */}
                  <div style={{ marginBottom: "28px", paddingBottom: "28px", borderBottom: `1px solid ${C.border}` }}>
                    <p style={{ fontWeight: 700, fontSize: "13px", color: C.coolGrey, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "16px" }}>Account Information</p>
                    <div className="fields-grid-2">
                      <Field label="First Name" value={actualProfile.first_name || ""} disabled />
                      <Field label="Last Name"  value={actualProfile.last_name  || ""} disabled />
                      <Field label="Email"      value={actualProfile.email      || ""} disabled type="email" />
                      <Field label="Phone"      value={phone}                          disabled type="tel" />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                      <AlertCircle size={13} style={{ color: C.coolGrey, flexShrink: 0 }} />
                      <p style={{ fontWeight: 400, fontSize: "12px", color: C.coolGrey }}>Contact support to update these fields</p>
                    </div>
                  </div>

                  {/* Editable fields */}
                  <div style={{ marginBottom: "28px", paddingBottom: "28px", borderBottom: `1px solid ${C.border}` }}>
                    <p style={{ fontWeight: 700, fontSize: "13px", color: C.coolGrey, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "16px" }}>Additional Information</p>
                    <div className="fields-grid-editable">
                      <Field label="Date of Birth" hint="Required for age-restricted subscriptions" value={dateOfBirth} onChange={setEditedDateOfBirth} type="date" disabled={!isEditing} />
                      <Field label="Address" hint="Your residential address" value={address} onChange={setEditedAddress} placeholder="Enter your address" disabled={!isEditing} />
                    </div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 16px", borderRadius: "8px", background: actualProfile.email_verified ? "rgba(13,148,136,0.08)" : "rgba(251,191,36,0.1)", border: `1px solid ${actualProfile.email_verified ? "rgba(13,148,136,0.2)" : "rgba(251,191,36,0.25)"}` }}>
                      {actualProfile.email_verified
                        ? <ShieldCheck size={15} style={{ color: C.teal }} />
                        : <AlertCircle size={15} style={{ color: "#D97706" }} />
                      }
                      <span style={{ fontWeight: 600, fontSize: "13px", color: actualProfile.email_verified ? C.teal : "#D97706" }}>
                        {actualProfile.email_verified ? "Email verified" : "Email not verified"}
                      </span>
                    </div>
                  </div>

                  {/* Change Password trigger */}
                  <button
                    className="change-pw-btn"
                    onClick={() => setShowChangePwModal(true)}
                    style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    <Lock size={14} style={{ color: C.teal }} />
                    <span style={{ fontWeight: 700, fontSize: "14px", color: C.teal, textDecoration: "underline", textUnderlineOffset: "3px", textDecorationColor: "transparent", transition: "text-decoration-color 200ms" }}>
                      Change Password
                    </span>
                  </button>
                </motion.div>
              )}

              {/* Account tab */}
              {activeTab === "account" && (
                <motion.div
                  key="account"
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: "flex", flexDirection: "column", gap: "16px" }}
                >
                  <div style={{ background: C.white, borderRadius: "16px", border: `1px solid ${C.border}` }} className="card-padding">
                    <h2 style={{ fontWeight: 700, fontSize: "18px", color: C.teal, marginBottom: "20px" }}>Account Overview</h2>
                    <div className="account-grid">
                      {[
                        { label: "Account Status", value: actualProfile.status || "Active" },
                        { label: "Last Login", value: actualProfile.last_login_at ? new Date(actualProfile.last_login_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Never" },
                      ].map(({ label, value }) => (
                        <div key={label} style={{ background: C.snow, borderRadius: "10px", border: `1px solid ${C.border}`, padding: "16px 18px" }}>
                          <p style={{ fontWeight: 400, fontSize: "12px", color: C.coolGrey, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>{label}</p>
                          <p style={{ fontWeight: 700, fontSize: "16px", color: C.teal, textTransform: "capitalize" }}>{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: C.white, borderRadius: "16px", border: `1px solid ${C.border}` }} className="card-padding">
                    <h3 style={{ fontWeight: 700, fontSize: "16px", color: C.ink, marginBottom: "6px" }}>Sign Out</h3>
                    <p style={{ fontWeight: 400, fontSize: "14px", color: C.coolGrey, lineHeight: 1.6, marginBottom: "20px" }}>
                      Sign out of your account on this device. You can sign back in anytime.
                    </p>
                    <Button variant="outline" onClick={handleLogout}>
                      {loggingOut ? <Spinner color="current" size="sm" /> : <LogOut size={16} />}
                      Log Out
                    </Button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}