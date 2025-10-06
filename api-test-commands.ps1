# API Health Test Commands
# Copy and paste these commands in PowerShell to test API connectivity

# =====================================================
# QUICK TESTS
# =====================================================

# 1. Basic Health Check (PowerShell)
Invoke-WebRequest -Uri "http://localhost:3002/api/health" -Method GET

# 2. Get response content only
(Invoke-WebRequest -Uri "http://localhost:3002/api/health").Content

# 3. Check if API server is listening on port 3002
Test-NetConnection -ComputerName localhost -Port 3002

# =====================================================
# CONTRACT API TESTS
# =====================================================

# 4. Test Contract Stats
Invoke-WebRequest -Uri "http://localhost:3002/api/contracts/stats" -Method GET

# 5. Test Contract List
Invoke-WebRequest -Uri "http://localhost:3002/api/contracts?page=1&pageSize=5" -Method GET

# 6. Test Contract Insights
Invoke-WebRequest -Uri "http://localhost:3002/api/contracts/insights" -Method GET

# 7. Test Contract Milestones
Invoke-WebRequest -Uri "http://localhost:3002/api/contracts/milestones" -Method GET

# =====================================================
# COMPREHENSIVE NODE.JS TESTS
# =====================================================

# 8. Full health test (requires Node.js)
node test-api-health.js

# 9. Quick connectivity test
node test-api-health.js quick

# =====================================================
# BROWSER TESTS
# =====================================================

# 10. Open these URLs in browser:
# http://localhost:3002/api/health
# http://localhost:3002/api/contracts/stats
# http://localhost:3002/api/contracts/insights

# =====================================================
# EXPECTED RESULTS
# =====================================================

# Health endpoint should return:
# {
#   "status": "OK",
#   "message": "API is running",
#   "timestamp": "2025-10-04T..."
# }

# Contract Stats should return:
# {
#   "activeContracts": { "count": 2, "trend": {...} },
#   "completedContracts": { "count": 1, "trend": {...} },
#   ...
# }

# =====================================================
# TROUBLESHOOTING
# =====================================================

# If tests fail:
# 1. Check if API server is running: pnpm dev:api
# 2. Check port availability: netstat -ano | findstr :3002
# 3. Restart API server: taskkill /f /im node.exe && pnpm dev:api