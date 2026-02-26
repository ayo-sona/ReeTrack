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
} from "lucide-react";
import apiClient from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { InviteStaffModal } from "@/components/organization/InviteStaffModal";
import AddSubaccountModal from "@/components/organization/AddSubaccountModal";
import clsx from "clsx";

type Tab = "organisation" | "profile" | "team" | "banking";

const inputBase =
  "w-full rounded-lg border px-4 py-2.5 text-sm transition focus:outline-none focus:ring-2";
const inputActive =
  "border-[#E5E7EB] bg-white text-[#1F2937] focus:border-[#0D9488] focus:ring-[#0D9488]/20";
const inputLocked =
  "border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF] cursor-not-allowed select-none";
const labelClass =
  "block text-xs font-bold text-[#9CA3AF] uppercase tracking-wide mb-1.5";

function Field({
  id,
  label,
  type = "text",
  value,
  onChange,
  disabled,
  placeholder,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className={clsx(inputBase, disabled ? inputLocked : inputActive)}
      />
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 sm:px-6 py-4 border-b border-gray-100">
        <p className="text-sm font-bold text-[#1F2937]">{title}</p>
        {subtitle && (
          <p className="text-xs text-[#9CA3AF] mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="px-5 sm:px-6 py-5 space-y-4">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("organisation");
  const [copied, setCopied] = useState(false);

  const [orgData, setOrgData] = useState({
    name: "",
    email: "",
    website: "",
    role: "",
    phone: "",
    description: "",
    slug: "",
  });
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [savingOrg, setSavingOrg] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [editingOrg, setEditingOrg] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isAddSubaccountModalOpen, setIsAddSubaccountModalOpen] =
    useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await apiClient.get("/auth/profile");
        const d = data.data;

        setProfileData({
          firstName: d.first_name,
          lastName: d.last_name,
          email: d.email,
          phone: d.phone ?? "",
        });
        setOrgData({
          name: d.organizations[0].name,
          email: d.organizations[0].email,
          website: d.organizations[0].website ?? "",
          role: d.organizations[0].role,
          phone: d.organizations[0].phone ?? "",
          description: d.organizations[0].description ?? "",
          slug: d.organizations[0].slug ?? "",
        });
      } catch {
        toast.error("Failed to load settings. Please refresh.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const inviteLink =
    orgData.slug
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
      await apiClient.put("/organizations/me", {
        organizationName: orgData.name,
        website: orgData.website,
        phone: orgData.phone,
        description: orgData.description,
      });
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
    {
      id: "organisation",
      label: "Organisation",
      icon: <Building2 className="w-4 h-4" />,
    },
    { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
    { id: "team", label: "Team", icon: <Users className="w-4 h-4" /> },
    { id: "banking", label: "Banking", icon: <Landmark className="w-4 h-4" /> },
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page header */}
        <div className="mb-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#0D9488] mb-1">
            Account
          </p>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1F2937]">
            Settings
          </h1>
          <p className="text-sm text-[#9CA3AF] mt-0.5">
            Manage your organisation and account preferences
          </p>
        </div>

        {/* Tab bar */}
        <div className="mb-6 -mx-4 sm:mx-0 px-4 sm:px-0">
          <div className="flex gap-0 overflow-x-auto border-b border-gray-200 scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  "flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap",
                  "border-b-2 -mb-px transition-all",
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
            <Section
              title="Business Information"
              subtitle="Details visible to your members"
            >
              <Field
                id="org-name"
                label="Organisation Name"
                value={orgData.name}
                onChange={(v) => setOrgData({ ...orgData, name: v })}
                disabled={!editingOrg}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  id="org-email"
                  label="Email (read-only)"
                  type="email"
                  value={orgData.email}
                  disabled
                />
                <Field
                  id="org-role"
                  label="Role (read-only)"
                  value={orgData.role}
                  disabled
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  id="org-phone"
                  label="Phone"
                  type="tel"
                  value={orgData.phone}
                  onChange={(v) => setOrgData({ ...orgData, phone: v })}
                  disabled={!editingOrg}
                  placeholder="+234 000 0000 000"
                />
                <Field
                  id="org-website"
                  label="Website"
                  type="url"
                  value={orgData.website}
                  onChange={(v) => setOrgData({ ...orgData, website: v })}
                  disabled={!editingOrg}
                  placeholder="https://yoursite.com"
                />
              </div>
              <div>
                <label htmlFor="org-description" className={labelClass}>
                  Description
                </label>
                <textarea
                  id="org-description"
                  value={orgData.description}
                  onChange={(e) =>
                    setOrgData({ ...orgData, description: e.target.value })
                  }
                  disabled={!editingOrg}
                  rows={3}
                  placeholder="A short description of your organisation..."
                  className={clsx(
                    inputBase,
                    "resize-none",
                    editingOrg ? inputActive : inputLocked,
                  )}
                />
              </div>
            </Section>

            {/* Invite Link card */}
            <Section
              title="Member Invite Link"
              subtitle="Share this link so anyone can join your organization"
            >
              {inviteLink ? (
                <div className="space-y-3">
                  <div className="rounded-lg bg-[#0D9488]/5 border border-[#0D9488]/10 px-4 py-3">
                    <p className="text-xs text-[#0D9488] leading-relaxed">
                      Anyone with this link can join your organization. Share it
                      on WhatsApp, in emails, or on social media — they'll be
                      walked through signup automatically.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-[#F9FAFB] px-3 py-2.5">
                    <Link2 className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />
                    <span className="flex-1 text-xs text-[#1F2937] truncate font-mono">
                      {inviteLink}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="flex items-center gap-1.5 text-xs font-bold text-[#0D9488] hover:text-[#0B7A70] transition-colors flex-shrink-0"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={handleCopyLink}
                  >
                    {copied ? (
                      <span className="flex items-center gap-2">
                        <Check className="w-4 h-4" /> Link Copied!
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Copy className="w-4 h-4" /> Copy Invite Link
                      </span>
                    )}
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-[#9CA3AF] text-center py-4">
                  Invite link unavailable. Please refresh the page.
                </p>
              )}
            </Section>

            <div className="flex justify-end gap-3">
              {editingOrg && (
                <Button variant="outline" onClick={() => setEditingOrg(false)}>
                  <X className="h-4 w-4" /> Cancel
                </Button>
              )}
              {!editingOrg ? (
                <Button variant="secondary" onClick={() => setEditingOrg(true)}>
                  <Pen className="h-4 w-4" /> Edit Details
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  disabled={savingOrg}
                  onClick={handleOrgSubmit}
                >
                  {savingOrg ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" /> Save Changes
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* PROFILE tab */}
        {activeTab === "profile" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#0D9488]/10 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-extrabold text-[#0D9488]">
                  {profileData.firstName.charAt(0)}
                  {profileData.lastName.charAt(0)}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold text-[#1F2937] truncate">
                  {profileData.firstName} {profileData.lastName}
                </p>
                <p className="text-sm text-[#9CA3AF] truncate">
                  {profileData.email}
                </p>
                <p className="text-xs font-semibold text-[#0D9488] mt-0.5 capitalize">
                  {orgData.role}
                </p>
              </div>
            </div>

            <Section
              title="Personal Information"
              subtitle="Name and email cannot be changed here"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  id="first-name"
                  label="First Name"
                  value={profileData.firstName}
                  disabled
                />
                <Field
                  id="last-name"
                  label="Last Name"
                  value={profileData.lastName}
                  disabled
                />
              </div>
              <Field
                id="profile-email"
                label="Email (read-only)"
                type="email"
                value={profileData.email}
                disabled
              />
              <Field
                id="profile-phone"
                label="Phone"
                type="tel"
                value={profileData.phone}
                onChange={(v) => setProfileData({ ...profileData, phone: v })}
                disabled={!editingProfile}
                placeholder="+234 000 0000 000"
              />
            </Section>

            <div className="flex justify-end gap-3">
              {editingProfile && (
                <Button
                  variant="outline"
                  onClick={() => setEditingProfile(false)}
                >
                  <X className="h-4 w-4" /> Cancel
                </Button>
              )}
              {!editingProfile ? (
                <Button
                  variant="secondary"
                  onClick={() => setEditingProfile(true)}
                >
                  <Pen className="h-4 w-4" /> Edit Profile
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  disabled={savingProfile}
                  onClick={handleProfileSubmit}
                >
                  {savingProfile ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" /> Save Changes
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* TEAM tab */}
        {activeTab === "team" && (
          <Section
            title="Team Members"
            subtitle="Invite staff to help manage your organisation"
          >
            <div className="py-8 flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#0D9488]/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-[#0D9488]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#1F2937]">
                  Invite your team
                </p>
                <p className="text-xs text-[#9CA3AF] mt-1 max-w-xs leading-relaxed">
                  Staff members can log in to manage members, plans, and
                  check-ins on your behalf.
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={() => setIsInviteModalOpen(true)}
              >
                <UserPlus className="h-4 w-4" /> Invite Staff Member
              </Button>
            </div>
          </Section>
        )}

        {/* BANKING tab */}
        {activeTab === "banking" && (
          <Section
            title="Bank Account"
            subtitle="Receive payouts from member subscriptions"
          >
            <div className="py-8 flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#0D9488]/10 flex items-center justify-center">
                <Landmark className="w-6 h-6 text-[#0D9488]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#1F2937]">
                  No bank account added
                </p>
                <p className="text-xs text-[#9CA3AF] mt-1 max-w-xs leading-relaxed">
                  Add your organisation&apos;s bank account to enable direct
                  payouts when members subscribe.
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={() => setIsAddSubaccountModalOpen(true)}
              >
                <Landmark className="h-4 w-4" /> Add Bank Account
              </Button>
            </div>
          </Section>
        )}
      </div>

      {/* Modals */}
      <InviteStaffModal
        isOpen={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
        onSuccess={() => toast.success("Invitation sent successfully")}
      />
      <AddSubaccountModal
        isOpen={isAddSubaccountModalOpen}
        onOpenChange={setIsAddSubaccountModalOpen}
        onSuccess={() => toast.success("Bank account added successfully")}
        organization={orgData}
        profile={profileData}
      />
    </div>
  );
}