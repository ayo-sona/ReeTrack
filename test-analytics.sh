#!/bin/bash

# PayPips Analytics API Testing Script

BASE_URL="http://localhost:3000/api/v1"
TOKEN="YOUR_TOKEN_HERE"

echo "========================================="
echo "PayPips Analytics API Testing"
echo "========================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# ============================================
# 1. OVERVIEW / DASHBOARD
# ============================================
echo -e "\n${BLUE}1. ANALYTICS OVERVIEW (Last 30 days)${NC}"
curl -s -X GET "$BASE_URL/analytics/overview?period=month" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# ============================================
# 2. MRR (Monthly Recurring Revenue)
# ============================================
echo -e "\n${BLUE}2. MRR (Monthly Recurring Revenue)${NC}"
curl -s -X GET "$BASE_URL/analytics/mrr" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# ============================================
# 3. CHURN RATE
# ============================================
echo -e "\n${BLUE}3. CHURN RATE (Last Month)${NC}"
curl -s -X GET "$BASE_URL/analytics/churn?period=month" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# ============================================
# 4. REVENUE CHART (Last 7 days)
# ============================================
echo -e "\n${BLUE}4. REVENUE CHART (Last 7 days)${NC}"
curl -s -X GET "$BASE_URL/analytics/revenue-chart?period=week" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# ============================================
# 5. PLAN PERFORMANCE
# ============================================
echo -e "\n${BLUE}5. PLAN PERFORMANCE${NC}"
curl -s -X GET "$BASE_URL/analytics/plan-performance" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# ============================================
# 6. TOP CUSTOMERS
# ============================================
echo -e "\n${BLUE}6. TOP CUSTOMERS (by revenue)${NC}"
curl -s -X GET "$BASE_URL/analytics/top-customers" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# ============================================
# 7. CUSTOM DATE RANGE
# ============================================
echo -e "\n${BLUE}7. CUSTOM DATE RANGE (Last 90 days)${NC}"
END_DATE=$(date +%Y-%m-%d)
START_DATE=$(date -d '90 days ago' +%Y-%m-%d)

curl -s -X GET "$BASE_URL/analytics/overview?period=custom&startDate=$START_DATE&endDate=$END_DATE" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# ============================================
# 8. YEAR-OVER-YEAR COMPARISON
# ============================================
echo -e "\n${BLUE}8. YEAR-OVER-YEAR ANALYTICS${NC}"
curl -s -X GET "$BASE_URL/analytics/overview?period=year" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# ============================================
# 9. GENERATE SAMPLE DATA
# ============================================
echo -e "\n${YELLOW}========================================="
echo "Sample Analytics Dashboard Response:"
echo "=========================================${NC}"

cat << 'EOF'
{
  "mrr": {
    "current_mrr": 1500000,
    "previous_mrr": 1350000,
    "growth_rate": 11.11,
    "growth_amount": 150000
  },
  "revenue": {
    "total_revenue": 18000000,
    "period_revenue": 1500000,
    "growth_rate": 8.5,
    "average_transaction": 15000
  },
  "customers": {
    "new_customers": 45,
    "churned_customers": 8,
    "net_growth": 37,
    "total_customers": 523
  },
  "subscriptions": {
    "total_subscriptions": 523,
    "active_subscriptions": 487,
    "trialing_subscriptions": 12,
    "expired_subscriptions": 15,
    "canceled_subscriptions": 9
  },
  "payments": {
    "total_payments": 102,
    "successful_payments": 95,
    "failed_payments": 5,
    "pending_payments": 2,
    "success_rate": 93.14
  }
}
EOF

echo -e "\n${YELLOW}========================================="
echo "Chart Data Structure:"
echo "=========================================${NC}"

cat << 'EOF'
// Revenue Chart (for frontend charting libraries)
[
  {
    "date": "2024-01-01",
    "revenue": 45000,
    "subscriptions": 12,
    "customers": 8
  },
  {
    "date": "2024-01-02",
    "revenue": 52000,
    "subscriptions": 15,
    "customers": 10
  }
  // ... more days
]

// Plan Performance
[
  {
    "plan_id": "uuid",
    "plan_name": "Premium Monthly",
    "active_subscriptions": 245,
    "revenue": 3675000,
    "conversion_rate": 82.5
  },
  {
    "plan_id": "uuid",
    "plan_name": "Basic Monthly",
    "active_subscriptions": 142,
    "revenue": 1420000,
    "conversion_rate": 75.2
  }
]
EOF

echo -e "\n${GREEN}========================================="
echo "Testing Complete!"
echo "=========================================${NC}"

# ============================================
# Create frontend integration guide
# ============================================
cat > frontend-integration.md << 'EOF'
# Frontend Integration Guide

## Available Analytics Endpoints

### 1. Dashboard Overview
```typescript
GET /api/v1/analytics/overview?period=month

interface DashboardData {
  mrr: {
    current_mrr: number;
    previous_mrr: number;
    growth_rate: number;
    growth_amount: number;
  };
  revenue: {
    total_revenue: number;
    period_revenue: number;
    growth_rate: number;
    average_transaction: number;
  };
  customers: {
    new_customers: number;
    churned_customers: number;
    net_growth: number;
    total_customers: number;
  };
  payments: {
    total_payments: number;
    successful_payments: number;
    failed_payments: number;
    pending_payments: number;
    success_rate: number;
  };
  subscriptions: {
    total_subscriptions: number;
    active_subscriptions: number;
    trialing_subscriptions: number;
    expired_subscriptions: number;
    canceled_subscriptions: number;
  };
}
```

### 2. Revenue Chart
```typescript
GET /api/v1/analytics/revenue-chart?period=week

interface ChartData {
  date: string; // YYYY-MM-DD
  revenue: number;
  subscriptions: number;
  customers: number;
}[]
```

### 3. Plan Performance
```typescript
GET /api/v1/analytics/plan-performance

interface PlanData {
  plan_id: string;
  plan_name: string;
  active_subscriptions: number;
  revenue: number;
  conversion_rate: number;
}[]
```

### 4. Top Customers
```typescript
GET /api/v1/analytics/top-customers

interface TopCustomer {
  customer_id: string;
  name: string;
  email: string;
  total_spent: number;
  payment_count: number;
}[]
```

## Query Parameters

- `period`: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom'
- `startDate`: ISO date string (for custom period)
- `endDate`: ISO date string (for custom period)

## Example Usage (React)

```typescript
import { useState, useEffect } from 'react';

function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  
  useEffect(() => {
    fetch('/api/v1/analytics/overview?period=month', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => setAnalytics(data.data));
  }, []);
  
  return (
    <div>
      <h1>MRR: ${analytics?.mrr.current_mrr}</h1>
      <p>Growth: {analytics?.mrr.growth_rate}%</p>
    </div>
  );
}
```

## Chart Library Integration

### With Recharts
```typescript
import { LineChart, Line, XAxis, YAxis } from 'recharts';

function RevenueChart({ data }) {
  return (
    <LineChart data={data}>
      <XAxis dataKey="date" />
      <YAxis />
      <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
    </LineChart>
  );
}
```

### With Chart.js
```typescript
import { Line } from 'react-chartjs-2';

const chartData = {
  labels: data.map(d => d.date),
  datasets: [{
    label: 'Revenue',
    data: data.map(d => d.revenue),
    borderColor: 'rgb(75, 192, 192)',
  }]
};

<Line data={chartData} />
```
EOF

echo -e "\n${GREEN}✓${NC} Created frontend-integration.md"
echo "Run: cat frontend-integration.md"