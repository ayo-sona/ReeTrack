"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Divider,
  Switch,
  Badge,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Spinner,
  Image,
} from "@heroui/react";
import { Check, CheckCircle, ArrowRight } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { usePaystack } from "@/hooks/usePaystack";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import { LoadingSkeleton } from "@/components/ui";

type BillingCycle = "monthly" | "annually";

interface Plan {
  id: string;
  name: string;
  description: string;
  price: string;
  priceSuffix: string;
  features: string[];
  mostPopular: boolean;
}

const includedFeatures = [
  "Secure data encryption",
  "99.9% uptime SLA",
  "Regular updates & improvements",
  "Mobile apps",
  "Single sign-on (SSO)",
  "Audit logs",
];

export default function EnterprisePlansPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const { isReady, resumeTransaction } = usePaystack();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const plans = await apiClient.get("/plans/organization");
      console.log(plans.data.data);
      setPlans(plans.data.data);
      setLoading(false);
    })();
  }, []);

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    onOpen();
  };

  const handlePaymentMethodSelect = async (method: "paystack" | "kora") => {
    // Handle the selected payment method
    console.log(
      `Processing payment with ${method} for plan:`,
      selectedPlan?.name,
    );
    // You can add your payment processing logic here
    if (method === "paystack") {
      await handleSubscribe();
    }
    // onClose();
  };

  const handleSubscribe = async () => {
    setLoading(true);
    console.log(selectedPlan?.id);

    try {
      // 1. Create subscription in your system
      const {
        data: {
          data: { invoice },
        },
      } = await apiClient.post("/subscriptions/organizations", {
        planId: selectedPlan?.id,
      });
      // console.log(invoice);

      // 2. Initialize Paystack payment
      const {
        data: { data: paymentData },
      } = await apiClient.post("/payments/paystack/organization/initialize", {
        invoiceId: invoice?.id,
      });
      console.log(paymentData);

      // 3. Redirect to Paystack
      if (!isReady) return;
      resumeTransaction(paymentData.access_code);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error: any) {
      // console.error("Subscription error:", error);
      // toast("Failed to start subscription");

      // Handle Axios error response
      if (error.response) {
        const { data, status, statusText } = error.response;

        console.error("Response error:", {
          status,
          statusText,
          data,
        });

        // Handle specific error statuses
        if (status === 400) {
          // Bad Request
          // setError(
          //   data.message ||
          //     "Invalid request. Please check your details and try again.",
          // );
          toast(
            data.message ||
              "Invalid request. Please check your details and try again.",
          );
        } else if (status === 403) {
          // Forbidden
          // setError("You don't have permission to perform this action.");
          toast("You don't have permission to perform this action.");
        } else if (status === 404) {
          // Not Found
          // setError("The requested resource was not found.");
          toast("The requested resource was not found.");
        } else if (status >= 500) {
          // Server Error
          // setError("A server error occurred. Please try again later.");
          toast("A server error occurred. Please try again later.");
        } else {
          // Other errors
          // setError(data.message || "An error occurred. Please try again.");
          toast(data.message || "An error occurred. Please try again.");
        }
      } else if (error.request) {
        // The request was made but no response was received
        // console.error("No response received:", error.request);
        // setError(
        //   "No response from server. Please check your connection and try again.",
        // );
        toast(
          "No response from server. Please check your connection and try again.",
        );
      } else {
        // Something happened in setting up the request
        // console.error("Request setup error:", error.message);
        // setError(error.message || "An error occurred. Please try again.");
        toast(error.message || "An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const sortedPlans = [...plans].sort((a, b) => +a.price - +b.price);
  // console.log(sortedPlans);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="w-full h-full overflow-y-auto no-scrollbar">
      <div className="min-h-full pb-12">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full py-8">
          <div className="max-w-4xl mx-auto text-gray-900 dark:text-gray-100 text-balance text-center">
            <Badge color="primary" variant="flat" className="mb-4">
              Pricing Plans
            </Badge>
            <h1 className="text-3xl bg-primary text-primary-foreground bg-clip-text text-transparent md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              Choose the perfect plan for your organization. Start with a free
              plan and upgrade as you grow.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="text-sm font-medium">Billed Monthly</span>
              <Switch
                isSelected={billingCycle === "annually"}
                onValueChange={(isSelected) =>
                  setBillingCycle(isSelected ? "annually" : "monthly")
                }
                color="success"
                size="lg"
              />
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Billed Annually</span>
                {billingCycle === "annually" && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                    Save 15%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-8 w-full">
            {sortedPlans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col ${
                  plan.mostPopular ? "ring-2 ring-primary" : ""
                }`}
              >
                {plan.name === "Platinum" && (
                  <div className="absolute top-0 right-0 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-bl-lg z-10">
                    Most Popular
                  </div>
                )}
                <CardHeader className="flex flex-col p-4 shrink-0 text-center">
                  <h3 className="text-xl md:text-3xl text-primary-foreground font-bold">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-foreground-500">
                    {plan.description}
                  </p>
                  <div className="mt-4">
                    <span className="text-3xl md:text-4xl font-bold">
                      {`${plan.price === null ? "Free" : `$${billingCycle === "annually" ? Number(plan.price) * 12 * 0.85 : Number(plan.price)}/${billingCycle === "annually" ? "year" : "month"}`}`}
                    </span>
                    {billingCycle === "annually" && plan.price !== null && (
                      <span className="block text-sm text-foreground-500 mt-1">
                        Billed annually
                      </span>
                    )}
                  </div>
                </CardHeader>
                <Divider />
                <CardBody className="space-y-4 grow">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-success-500 shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardBody>
                <CardFooter className="shrink-0">
                  <Button
                    color="success"
                    variant="solid"
                    className="w-full"
                    size="lg"
                    onPress={() => handlePlanSelect(plan)}
                    endContent={<ArrowRight size={18} />}
                  >
                    Subscribe
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="py-12 bg-default-50 mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl text-black dark:text-white font-bold mb-4">
                Compare plans
              </h2>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                See how our plans stack up against each other to find the
                perfect fit for your organization.
              </p>
            </div>

            <div className="overflow-x-auto -mx-4 px-4">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full text-foreground dark:text-primary-foreground divide-y divide-default-200">
                  <thead>
                    <tr>
                      <th className="text-left pb-6 pr-4 min-w-[200px]">
                        <span className="text-sm font-medium">Features</span>
                      </th>
                      {sortedPlans.map((plan) => (
                        <th
                          key={plan.id}
                          className="text-center pb-6 px-4 min-w-[120px]"
                        >
                          <div className="flex flex-col items-center">
                            <span className="text-base md:text-lg font-semibold">
                              {plan.name}
                            </span>
                            <span className="text-base md:text-lg font-semibold">
                              {`${plan.price === null ? "Free" : `$${billingCycle === "annually" ? Number(plan.price) * 12 * 0.85 : Number(plan.price)}/${billingCycle === "annually" ? "year" : "month"}`}`}
                            </span>
                            {plan.name === "Platinum" && (
                              <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full mt-1">
                                Most Popular
                              </span>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-default-200">
                    {includedFeatures.map((feature, index) => (
                      <tr key={index}>
                        <td className="py-4 pr-4 text-sm text-foreground dark:text-primary-foreground">
                          <div className="flex items-center">
                            <Check className="w-4 h-4 text-success-500 mr-2 shrink-0" />
                            <span>{feature}</span>
                          </div>
                        </td>
                        {sortedPlans.map((plan) => (
                          <td
                            key={`${plan.id}-${index}`}
                            className="py-4 px-4 text-center"
                          >
                            <Check className="w-5 h-5 text-success-500 mx-auto" />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
          <ModalContent className="bg-default-50 dark:bg-background focus:outline-none">
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <div className="flex justify-center items-center">
                    <h3 className="text-lg text-black dark:text-white font-semibold">
                      Complete Your Subscription
                    </h3>
                  </div>
                </ModalHeader>
                <ModalBody className="flex justify-center py-4">
                  <div className="space-y-4">
                    <div className="text-center text-black dark:text-white">
                      <p className="mb-2">
                        You&apos;re subscribing to{" "}
                        <span className="font-semibold">
                          {selectedPlan?.name}
                        </span>{" "}
                        plan
                      </p>
                      <p className="text-2xl font-bold">
                        {`${selectedPlan?.price === null ? "Free" : `$${billingCycle === "annually" ? Number(selectedPlan?.price) * 12 * 0.85 : Number(selectedPlan?.price)}/${billingCycle === "annually" ? "year" : "month"}`}`}
                        <span className="text-base font-normal text-foreground">
                          {selectedPlan?.priceSuffix}
                        </span>
                      </p>
                      {billingCycle === "annually" && (
                        <p className="text-sm text-foreground mt-1">
                          Billed annually at{" "}
                          {`${selectedPlan?.price === null ? "Free" : `$${billingCycle === "annually" ? Number(selectedPlan?.price) * 12 * 0.85 : Number(selectedPlan?.price)}/${billingCycle === "annually" ? "year" : "month"}`}`}
                        </p>
                      )}
                    </div>
                    <div className="space-y-3 pt-4">
                      <Button
                        fullWidth
                        size="lg"
                        variant="bordered"
                        className="text-black dark:text-white hover:bg-primary border-2 border-gray-200 hover:border-gray-300"
                        onPress={() => handlePaymentMethodSelect("paystack")}
                        startContent={
                          <Image
                            src="/paystack-logo.jpeg"
                            alt="Paystack"
                            width={80}
                            height={24}
                            className="h-6 w-auto"
                          />
                        }
                      >
                        Pay with Paystack
                      </Button>
                      <Button
                        fullWidth
                        size="lg"
                        variant="bordered"
                        className="text-black dark:text-white hover:bg-primary border-2 border-gray-200 hover:border-gray-300"
                        onPress={() => handlePaymentMethodSelect("kora")}
                        startContent={
                          <Image
                            src="/kora-logo.jpeg"
                            alt="Kora"
                            width={80}
                            height={40}
                            className="h-6 w-auto"
                          />
                        }
                      >
                        Pay with Kora
                      </Button>
                    </div>
                    <div className="pt-2 text-xs text-foreground dark:text-white text-center">
                      <p>
                        Secure payment processing powered by our trusted
                        partners
                      </p>
                    </div>
                  </div>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
