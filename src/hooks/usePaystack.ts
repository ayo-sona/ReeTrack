import { useEffect, useState } from "react";

interface UsePaystackReturn {
  isReady: boolean;
  paystack: any; // Paystack v2 instance
  resumeTransaction: (accessCode: string) => void;
}

export function usePaystack(): UsePaystackReturn {
  const [isReady, setIsReady] = useState(false);
  const [paystack, setPaystack] = useState<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkPaystack = () => {
      if (window.PaystackPop) {
        console.log("Paystack is ready");
        // Initialize Paystack v2
        const paystackInstance = new window.PaystackPop();
        setPaystack(paystackInstance);
        console.log(paystackInstance);
        setIsReady(true);
        return true;
      }
      return false;
    };

    // Initial check
    if (checkPaystack()) return;
    // If not ready, set up an interval to check
    const interval = setInterval(() => {
      if (checkPaystack()) {
        clearInterval(interval);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const resumeTransaction = (accessCode: string) => {
    if (!paystack) {
      throw new Error("Paystack is not initialized yet");
    }
    // console.log(paystack);
    // For Paystack v2, we need to use the paystack instance
    paystack.resumeTransaction(accessCode);
  };
  return { isReady, paystack, resumeTransaction };
}

// export function usePaystack(): UsePaystackReturn {
//   const [isReady, setIsReady] = useState(false);

//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const checkPaystack = () => {
//       if (window.PaystackPop) {
//         console.log("Paystack is ready");
//         setIsReady(true);
//         return true;
//       }
//       return false;
//     };

//     // Initial check
//     if (checkPaystack()) return;

//     // If not ready, set up an interval to check
//     const interval = setInterval(() => {
//       if (checkPaystack()) {
//         clearInterval(interval);
//       }
//     }, 100);

//     return () => {
//       clearInterval(interval);
//     };
//   }, []);

//   const resumeTransaction = (accessCode: string) => {
//     if (!window.PaystackPop) {
//       throw new Error("Paystack is not loaded yet");
//     }

//     window.PaystackPop.resumeTransaction(accessCode);
//   };

//   return { isReady, resumeTransaction };
// }

// import { useState, useCallback } from "react";

// export function usePaystack() {
//   const [paystack, setPaystack] = useState<any>(null);

//   const initializePaystack = useCallback(async () => {
//     try {
//       const PaystackPop = (await import("@paystack/inline-js")).default;
//       setPaystack(new PaystackPop());
//     } catch (error) {
//       console.error("Failed to load Paystack:", error);
//     }
//   }, []);

//   return { paystack, initializePaystack };
// }
