#!/bin/bash

# PayPips Cron Jobs Testing Script
# Tests all cron jobs manually

BASE_URL="http://localhost:4000/api/v1"
TOKEN="YOUR_ADMIN_TOKEN_HERE"

echo "========================================="
echo "PayPips Cron Jobs Testing"
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print success
success() {
  echo -e "${GREEN}✓${NC} $1"
}

# Function to print info
info() {
  echo -e "${YELLOW}ℹ${NC} $1"
}

# Function to print error
error() {
  echo -e "${RED}✗${NC} $1"
}

# ============================================
# 1. Test Check Expired Subscriptions
# ============================================
echo -e "\n${YELLOW}1. Testing: Check Expired Subscriptions${NC}"
info "This checks for subscriptions that have passed their end date"

RESPONSE=$(curl -s -X POST "$BASE_URL/cron/check-expired" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

if echo "$RESPONSE" | grep -q "completed"; then
  success "Expired subscriptions check completed"
  echo "$RESPONSE" | jq '.'
else
  error "Failed to check expired subscriptions"
  echo "$RESPONSE"
fi

# ============================================
# 2. Test Send Expiry Reminders
# ============================================
echo -e "\n${YELLOW}2. Testing: Send Expiry Reminders${NC}"
info "This sends reminders for subscriptions expiring in 7, 3, 1 days"

RESPONSE=$(curl -s -X POST "$BASE_URL/cron/send-expiry-reminders" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

if echo "$RESPONSE" | grep -q "sent"; then
  success "Expiry reminders sent"
  echo "$RESPONSE" | jq '.'
else
  error "Failed to send expiry reminders"
  echo "$RESPONSE"
fi

# ============================================
# 3. Test Check Overdue Invoices
# ============================================
echo -e "\n${YELLOW}3. Testing: Check Overdue Invoices${NC}"
info "This sends reminders for overdue invoices"

RESPONSE=$(curl -s -X POST "$BASE_URL/cron/check-overdue" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

if echo "$RESPONSE" | grep -q "completed"; then
  success "Overdue invoices check completed"
  echo "$RESPONSE" | jq '.'
else
  error "Failed to check overdue invoices"
  echo "$RESPONSE"
fi

# ============================================
# 4. Test Auto-Renew Subscriptions
# ============================================
echo -e "\n${YELLOW}4. Testing: Auto-Renew Subscriptions${NC}"
info "This creates invoices for subscriptions renewing tomorrow"

RESPONSE=$(curl -s -X POST "$BASE_URL/cron/auto-renew" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

if echo "$RESPONSE" | grep -q "processed"; then
  success "Auto-renewals processed"
  echo "$RESPONSE" | jq '.'
else
  error "Failed to process auto-renewals"
  echo "$RESPONSE"
fi

# ============================================
# 5. Create Test Data for Cron Jobs
# ============================================
echo -e "\n${YELLOW}5. Creating Test Data${NC}"
info "Creating a subscription that will expire soon..."

# Get or create a plan
PLAN_RESPONSE=$(curl -s -X POST "$BASE_URL/plans" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Cron Plan",
    "description": "Plan for testing cron jobs",
    "amount": 5000,
    "currency": "NGN",
    "interval": "monthly",
    "trialPeriodDays": 0
  }')

PLAN_ID=$(echo $PLAN_RESPONSE | jq -r '.data.id')

if [ "$PLAN_ID" != "null" ]; then
  success "Created test plan: $PLAN_ID"
else
  info "Using existing plan or creation failed"
fi

# Get or create a customer
CUSTOMER_RESPONSE=$(curl -s -X POST "$BASE_URL/customers" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cron-test@example.com",
    "firstName": "Cron",
    "lastName": "Test",
    "phone": "+2348012345678"
  }')

CUSTOMER_ID=$(echo $CUSTOMER_RESPONSE | jq -r '.data.id')

if [ "$CUSTOMER_ID" != "null" ]; then
  success "Created test customer: $CUSTOMER_ID"
else
  info "Using existing customer or creation failed"
fi

# ============================================
# 6. Get Current Stats
# ============================================
echo -e "\n${YELLOW}6. Current System Stats${NC}"

# Get subscriptions stats
SUBS_RESPONSE=$(curl -s -X GET "$BASE_URL/subscriptions?status=active" \
  -H "Authorization: Bearer $TOKEN")

ACTIVE_SUBS=$(echo $SUBS_RESPONSE | jq '.meta.total // 0')
success "Active Subscriptions: $ACTIVE_SUBS"

# Get overdue invoices
OVERDUE_RESPONSE=$(curl -s -X GET "$BASE_URL/invoices/overdue" \
  -H "Authorization: Bearer $TOKEN")

OVERDUE_COUNT=$(echo $OVERDUE_RESPONSE | jq '.count // 0')
success "Overdue Invoices: $OVERDUE_COUNT"

# Get payment stats
PAYMENT_STATS=$(curl -s -X GET "$BASE_URL/payments/stats" \
  -H "Authorization: Bearer $TOKEN")

echo -e "\n${GREEN}Payment Statistics:${NC}"
echo "$PAYMENT_STATS" | jq '.data'

# ============================================
# 7. Cron Job Schedule Information
# ============================================
echo -e "\n${YELLOW}7. Cron Job Schedule${NC}"
echo "
╔════════════════════════════════════════════════════════════╗
║  Cron Job                    │ Schedule                    ║
╠════════════════════════════════════════════════════════════╣
║  Check Expired               │ Every hour                  ║
║  Check Trialing              │ Every hour                  ║
║  Send Expiry Reminders       │ Daily at 9:00 AM            ║
║  Check Overdue Invoices      │ Daily at 10:00 AM           ║
║  Auto-Renew Subscriptions    │ Daily at 8:00 AM            ║
║  Cleanup Old Records         │ Sunday at 2:00 AM           ║
║  Generate Daily Stats        │ Daily at midnight           ║
╚════════════════════════════════════════════════════════════╝
"

# ============================================
# 8. Monitoring Tips
# ============================================
echo -e "\n${YELLOW}8. Monitoring Tips${NC}"
echo "
📊 To monitor cron jobs in production:

1. Watch server logs:
   tail -f logs/app.log | grep 'Cron\|✅'

2. Check cron job execution:
   - Look for log entries with 🔍, 📧, 🔄, 🧹, 📊 emojis
   - Verify timestamps match expected schedule

3. Set up alerts for:
   - Cron jobs that haven't run in expected timeframe
   - High failure rates
   - Long execution times

4. Database queries to check cron effectiveness:
   - Count subscriptions expired in last 24h
   - Count reminders sent
   - Verify auto-renewals processed
"

# ============================================
# 9. Next Steps
# ============================================
echo -e "\n${YELLOW}9. Next Steps${NC}"
echo "
✅ Cron jobs are now running automatically!

To verify they're working:
1. Check server logs for cron job messages
2. Create test subscriptions with short periods
3. Monitor email notifications
4. Check database for updated records

To customize:
- Edit src/modules/cron/cron.service.ts
- Change @Cron() schedules
- Add new automated tasks
"

echo -e "\n${GREEN}========================================="
echo "Cron Jobs Testing Complete!"
echo "=========================================${NC}"

# ============================================
# Create quick monitoring script
# ============================================
cat > monitor-cron.sh << 'EOF'
#!/bin/bash

# Quick cron monitoring script
echo "Monitoring PayPips Cron Jobs..."
echo "Press Ctrl+C to stop"

# Watch logs for cron activity
tail -f ~/.pm2/logs/paypips-out.log | grep --line-buffered -E '🔍|📧|🔄|🧹|📊|✅|Cron'
EOF

chmod +x monitor-cron.sh
success "Created monitor-cron.sh for real-time monitoring"

echo ""
echo "Run ${GREEN}./monitor-cron.sh${NC} to watch cron jobs in real-time!"