"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { Mail } from "lucide-react";
import apiClient from "@/lib/apiClient";

interface InviteStaffModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess?: () => void;
}

export function InviteStaffModal({
  isOpen,
  onOpenChange,
  onSuccess,
}: InviteStaffModalProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await apiClient.post("/auth/custom/register-staff", { email });
      onSuccess?.();
      onOpenChange(false);
      setEmail("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send invitation");
      console.error("Invite staff error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            Invite Staff Member
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                autoFocus
                label="Email"
                placeholder="staff@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                startContent={<Mail className="h-4 w-4 text-gray-400" />}
                isRequired
                isDisabled={isLoading}
                classNames={{
                  input: "outline-none",
                }}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="flat"
              onPress={() => onOpenChange(false)}
              isDisabled={isLoading}
            >
              Cancel
            </Button>
            <Button color="primary" type="submit" isLoading={isLoading}>
              Send Invitation
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
