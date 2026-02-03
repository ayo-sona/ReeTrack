"use client";

import { useEffect, useState } from "react";
import { Button, Card, Spinner } from "@heroui/react";
import apiClient from "@/lib/apiClient";
import { usePaystack } from "@/hooks/usePaystack";
import { useParams } from "next/navigation";

// Define the Invoice type based on your API response
interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  description: string;
  status: string;
  created_at: string;
  due_date: string;
}

export default function PayInvoicePage() {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);

  const params = useParams();
  console.log(params.id);
  const { paystack } = usePaystack();

  useEffect(() => {
    const loadInvoice = async () => {
      setLoading(true);
      try {
        const { data } = await apiClient.get(
          `/invoices/organization/${params?.id}`,
        );
        console.log(data.data);
        setInvoice(data.data);
      } catch (error) {
        console.error("Failed to load invoice:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      loadInvoice();
    }
  }, [params?.id]);

  const handlePay = async () => {
    setLoading(true);

    try {
      const { data } = await apiClient.post(
        "/payments/paystack/organization/initialize",
        {
          invoiceId: params?.id,
        },
      );
      console.log(data);
      paystack.resumeTransaction(data.data.access_code);
    } catch (error) {
      console.error("Payment initialization failed:", error);
      alert("Failed to initialize payment");
      setLoading(false);
    }
  };

  if (loading) return <Spinner size="lg" />;

  return (
    <div className="container mx-auto py-12 max-w-md">
      <Card>
        <h2>Invoice Payment</h2>
        <div className="my-4">
          <p className="text-sm text-gray-600">Invoice Number</p>
          <p className="font-semibold">{invoice?.invoice_number}</p>
        </div>
        <div className="my-4">
          <p className="text-sm text-gray-600">Amount Due</p>
          <p className="text-3xl font-bold">₦{invoice?.amount}</p>
        </div>
        <div className="my-4">
          <p className="text-sm text-gray-600">Description</p>
          <p>{invoice?.description}</p>
        </div>
        <Button
          color="primary"
          className="w-full"
          size="lg"
          isLoading={loading}
          onPress={handlePay}
        >
          Pay ₦{invoice?.amount}
        </Button>
      </Card>
    </div>
  );
}