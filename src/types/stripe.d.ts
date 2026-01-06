// src/types/stripe.d.ts

/// <reference types="@stripe/stripe-js" />

interface Window {
    Stripe?: typeof Stripe;
  }