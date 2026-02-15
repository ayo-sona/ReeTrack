"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    PaystackPop?: any;
  }
}

export function PaystackProvider({ children }: { children: React.ReactNode }) {
  const [isPaystackReady, setIsPaystackReady] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.PaystackPop) {
        console.log("Paystack already loaded");
        return;
      }
    }
  }, [isPaystackReady]);

  return (
    <>
      <Script
        src="https://js.paystack.co/v2/inline.js"
        strategy="afterInteractive"
        onLoad={(e) => {
          console.log("Paystack script loaded successfully");
          // Make sure PaystackPop is available on window
          if (window.PaystackPop) {
            console.log("PaystackPop is available on window");
            // console.log(window.PaystackPop);
            setIsPaystackReady(true);
          } else {
            console.error("PaystackPop is not available on window");
          }
        }}
        onError={(e) => {
          console.error("Paystack script failed to load", e);
        }}
      />
      {children}
    </>
  );
}

// "use client";

// import Script from "next/script";

// export function PaystackProvider({ children }: { children: React.ReactNode }) {
//   return (
//     <>
//       <Script
//         src="https://js.paystack.co/v1/inline.js"
//         strategy="afterInteractive"
//         // strategy="lazyOnload"
//         onLoad={() => {
//           console.log("Paystack loaded");
//         }}
//       />
//       {children}
//     </>
//   );
// }
