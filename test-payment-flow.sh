#!/bin/bash

# PayPips Payment Flow Testing
# This script tests the complete payment flow

BASE_URL="http://localhost:4000/api/v1"
TOKEN="YOUR_TOKEN_HERE"

echo "========================================="
echo "PayPips Payment Flow Testing"
echo "========================================="

# Step 1: Create a subscription (this creates an invoice)
echo -e "\n1. CREATE SUBSCRIPTION (Auto-creates Invoice)"
SUBSCRIPTION_RESPONSE=$(curl -s -X POST $BASE_URL/subscriptions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "YOUR_CUSTOMER_ID",
    "planId": "YOUR_PLAN_ID"
  }')

echo "$SUBSCRIPTION_RESPONSE" | jq '.'

# Extract subscription ID
SUBSCRIPTION_ID=$(echo $SUBSCRIPTION_RESPONSE | jq -r '.data.id')
echo "Subscription ID: $SUBSCRIPTION_ID"

# Step 2: Get the invoice created for this subscription
echo -e "\n2. GET INVOICES"
INVOICES_RESPONSE=$(curl -s -X GET "$BASE_URL/invoices?status=pending" \
  -H "Authorization: Bearer $TOKEN")

echo "$INVOICES_RESPONSE" | jq '.'

# Extract first invoice ID
INVOICE_ID=$(echo $INVOICES_RESPONSE | jq -r '.data[0].id')
echo "Invoice ID: $INVOICE_ID"

# Step 3: Initialize payment for the invoice
echo -e "\n3. INITIALIZE PAYMENT"
PAYMENT_INIT_RESPONSE=$(curl -s -X POST $BASE_URL/payments/initialize \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"invoiceId\": \"$INVOICE_ID\"
  }")

echo "$PAYMENT_INIT_RESPONSE" | jq '.'

# Extract payment details
AUTHORIZATION_URL=$(echo $PAYMENT_INIT_RESPONSE | jq -r '.data.authorization_url')
PAYMENT_REFERENCE=$(echo $PAYMENT_INIT_RESPONSE | jq -r '.data.reference')

echo -e "\n✅ Payment initialized!"
echo "Authorization URL: $AUTHORIZATION_URL"
echo "Reference: $PAYMENT_REFERENCE"

echo -e "\n📱 NEXT STEPS:"
echo "1. Open this URL in your browser: $AUTHORIZATION_URL"
echo "2. Complete payment with Paystack test card:"
echo "   Card: 4084084084084081"
echo "   CVV: 408"
echo "   Expiry: 12/30"
echo "   PIN: 0000"
echo "   OTP: 123456"
echo ""
echo "3. After payment, verify with this command:"
echo "   curl -X GET $BASE_URL/payments/verify/$PAYMENT_REFERENCE -H \"Authorization: Bearer $TOKEN\""

# Step 4: Get all payments
echo -e "\n4. GET ALL PAYMENTS"
curl -s -X GET "$BASE_URL/payments?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Step 5: Get payment stats
echo -e "\n5. GET PAYMENT STATS"
curl -s -X GET $BASE_URL/payments/stats \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Step 6: Get invoice stats
echo -e "\n6. GET INVOICE STATS"
curl -s -X GET $BASE_URL/invoices/stats \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo -e "\n========================================="
echo "Payment Testing Instructions Complete!"
echo "========================================="

# Create a separate verification script
cat > verify-payment.sh << EOF
#!/bin/bash
# Quick payment verification script

BASE_URL="http://localhost:4000/api/v1"
TOKEN="$TOKEN"
REFERENCE="\$1"

if [ -z "\$REFERENCE" ]; then
  echo "Usage: ./verify-payment.sh <payment-reference>"
  exit 1
fi

echo "Verifying payment: \$REFERENCE"
curl -s -X GET "\$BASE_URL/payments/verify/\$REFERENCE" \\
  -H "Authorization: Bearer \$TOKEN" | jq '.'
EOF

chmod +x verify-payment.sh

echo -e "\n✅ Created verify-payment.sh script"
echo "Usage: ./verify-payment.sh <payment-reference>"