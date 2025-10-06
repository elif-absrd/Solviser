#!/bin/bash

# API Health Check Script for PowerShell/Windows
# This script provides multiple ways to test API connectivity

echo "🔍 API Health and Connectivity Test Options"
echo "========================================="
echo ""

# Test 1: Basic connectivity using curl (if available)
echo "1. Testing basic connectivity..."
curl -s -o /dev/null -w "Health Check: %{http_code} (Response time: %{time_total}s)\n" http://localhost:3002/api/health 2>/dev/null || echo "❌ curl not available or API not reachable"
echo ""

# Test 2: PowerShell Invoke-WebRequest
echo "2. PowerShell method:"
echo 'Invoke-WebRequest -Uri "http://localhost:3002/api/health" -Method GET | Select-Object StatusCode, StatusDescription'
echo ""

# Test 3: Node.js test script
echo "3. Comprehensive Node.js test:"
echo "node test-api-health.js"
echo ""

# Test 4: Quick connectivity test
echo "4. Quick connectivity test:"
echo "node test-api-health.js quick"
echo ""

# Test 5: Manual browser test
echo "5. Manual browser test:"
echo "Open in browser: http://localhost:3002/api/health"
echo ""

echo "📋 Expected Results:"
echo "✅ Health endpoint should return: {\"status\":\"OK\",\"message\":\"API is running\"}"
echo "✅ Status code should be: 200"
echo "✅ Response time should be: < 100ms"
echo ""

echo "🛠️  If tests fail, check:"
echo "• API server is running (pnpm dev:api)"
echo "• Port 3002 is not blocked"
echo "• No other service using port 3002"