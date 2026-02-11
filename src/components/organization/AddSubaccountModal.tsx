import { useState, useEffect } from "react";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { Landmark, X } from "lucide-react";
import apiClient from "@/lib/apiClient";
import axios from "axios";

interface Bank {
  name: string;
  code: string;
}

interface AddSubaccountModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void;
  organization: any;
  profile: any;
}

export default function AddSubaccountModal({
  isOpen,
  onOpenChange,
  onSuccess,
  organization,
  profile,
}: AddSubaccountModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [formData, setFormData] = useState({
    businessName: organization.name,
    accountNumber: "",
    bankCode: "",
  });
  const [error, setError] = useState("");
  const [subaccountData, setSubaccountData] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      fetchBanks();
    }
  }, [isOpen]);

  const fetchBanks = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("https://api.paystack.co/bank");
      setBanks(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error("Failed to fetch banks:", error);
      setError("Failed to load banks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError("");

    if (
      !formData.businessName ||
      !formData.accountNumber ||
      !formData.bankCode
    ) {
      setError("All fields are required");
      return;
    }
    // console.log("formData", formData);

    try {
      setIsLoading(true);
      const response = await apiClient.post("/payments/paystack/subaccount", {
        business_name: formData.businessName,
        account_number: formData.accountNumber,
        bank_code: formData.bankCode,
        percentage_charge: 3,
        primary_contact_name: `${profile.firstName} ${profile.lastName}`,
        primary_contact_email: profile.email,
      });
      console.log(response.data.data);
      setSubaccountData(response.data.data);

      onSuccess();
      setTimeout(() => {
        onOpenChange(false);
      }, 5000);
    } catch (error: any) {
      console.error("Failed to create subaccount:", error);
      setError(error.response?.data?.message || "Failed to create subaccount");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-emerald-600" />
            <span>Add Bank Account</span>
          </div>
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <Input
                label="Business Name"
                placeholder="Enter your business name"
                value={formData.businessName}
                onChange={(e) =>
                  setFormData({ ...formData, businessName: e.target.value })
                }
                isRequired
                classNames={{
                  input: "outline-none",
                }}
              />

              <Input
                label="Account Number"
                placeholder="Enter account number"
                value={formData.accountNumber}
                onChange={(e) =>
                  setFormData({ ...formData, accountNumber: e.target.value })
                }
                isRequired
                type="number"
                classNames={{
                  input: "outline-none",
                }}
              />

              <Select
                label="Select Bank"
                placeholder="Select your bank"
                selectedKeys={formData.bankCode ? [formData.bankCode] : []}
                onChange={(e) =>
                  setFormData({ ...formData, bankCode: e.target.value })
                }
                isRequired
                isLoading={isLoading && banks.length === 0}
              >
                {banks.map((bank) => (
                  <SelectItem key={bank.code}>{bank.name}</SelectItem>
                ))}
              </Select>

              {subaccountData && (
                <Input
                  label="Account Name"
                  placeholder="Account name"
                  value={subaccountData.account_name}
                  isReadOnly
                  type="text"
                  classNames={{
                    input: "outline-none",
                  }}
                />
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              variant="flat"
              onPress={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              type="submit"
              isLoading={isLoading}
              startContent={!isLoading && <Landmark className="w-4 h-4" />}
            >
              Add Account
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
