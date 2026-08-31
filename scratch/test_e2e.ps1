Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "AUTOMATED END-TO-END ACCEPTANCE TEST - SISTEM PARTNERSHIP RENTAL MOBIL" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:8080/api"

function Assert-Equal($actual, $expected, $message) {
    if ("$actual" -eq "$expected") {
        Write-Host "[PASS] $message" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] $message (Expected: $expected, Got: $actual)" -ForegroundColor Red
        exit 1
    }
}

# 1. Health & Database Test
Write-Host "`n[1/5] Testing Health Endpoints..." -ForegroundColor Yellow
$health = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
Assert-Equal $health.data.status "UP" "Backend health status is UP"

$dbHealth = Invoke-RestMethod -Uri "$baseUrl/health/db" -Method Get
Assert-Equal $dbHealth.data.jdbcConnected "True" "PostgreSQL JDBC connected"
Assert-Equal $dbHealth.data.jpaRepositoryWorking "True" "Spring Data JPA Repository operational"

# 2. Authentication & RBAC Tests
Write-Host "`n[2/5] Testing Authentication and RBAC..." -ForegroundColor Yellow

# User Login
$userLogin = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"user@rental.com","password":"user123"}'
$userToken = $userLogin.data.token
Assert-Equal $userLogin.data.user.role "USER" "User login successful"

# Partner Login
$partnerLogin = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"partner@rental.com","password":"partner123"}'
$partnerToken = $partnerLogin.data.token
Assert-Equal $partnerLogin.data.user.role "PARTNER" "Partner login successful"

# Admin Login
$adminLogin = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"admin@rental.com","password":"admin123"}'
$adminToken = $adminLogin.data.token
Assert-Equal $adminLogin.data.user.role "ADMIN" "Admin login successful"

# RBAC Test: User trying to access /api/admin/dashboard/stats -> Expected 403 Forbidden
try {
    Invoke-RestMethod -Uri "$baseUrl/admin/dashboard/stats" -Method Get -Headers @{ Authorization = "Bearer $userToken" }
    Write-Host "[FAIL] User accessed admin endpoint without 403" -ForegroundColor Red
    exit 1
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Assert-Equal $statusCode "403" "RBAC Boundary: User cannot access admin endpoints (403 Forbidden)"
}

# 3. Discovery & Public Search Tests
Write-Host "`n[3/5] Testing Discovery and Public Endpoints..." -ForegroundColor Yellow

$rentals = Invoke-RestMethod -Uri "$baseUrl/rentals" -Method Get
Assert-Equal ($rentals.data.Count -ge 1) "True" "Discovered active rental places"

$cars = Invoke-RestMethod -Uri "$baseUrl/cars" -Method Get
Assert-Equal ($cars.data.Count -ge 1) "True" "Discovered available cars"
$testCar = $cars.data[0]
Write-Host "   Selected Car: $($testCar.brand) $($testCar.model) (Tarif: Rp $($testCar.pricePerDay)/hari)" -ForegroundColor Gray

# 4. Booking, Anti-Overlap, Payment & Review Workflow
Write-Host "`n[4/5] Testing Booking, Overlap Prevention, Payment and Review..." -ForegroundColor Yellow

$startDate = (Get-Date).AddDays(20).ToString("yyyy-MM-dd")
$endDate = (Get-Date).AddDays(23).ToString("yyyy-MM-dd")

# Create Booking (3 days duration)
$bookingBody = @{
    carId = $testCar.id
    startDate = $startDate
    endDate = $endDate
} | ConvertTo-Json

$bookingRes = Invoke-RestMethod -Uri "$baseUrl/bookings" -Method Post -Headers @{ Authorization = "Bearer $userToken" } -ContentType "application/json" -Body $bookingBody
$newBooking = $bookingRes.data
Assert-Equal $newBooking.durationDays "3" "Booking calculated duration is 3 days"
$expectedPrice = [decimal]$testCar.pricePerDay * 3
Assert-Equal $newBooking.totalPrice $expectedPrice "Server-side price calculated accurately"

# Overlap Conflict Test: Try to book same car on same dates
try {
    Invoke-RestMethod -Uri "$baseUrl/bookings" -Method Post -Headers @{ Authorization = "Bearer $userToken" } -ContentType "application/json" -Body $bookingBody
    Write-Host "[FAIL] Overlapping booking was allowed!" -ForegroundColor Red
    exit 1
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Assert-Equal $statusCode "409" "Rule 7 Enforced: Overlapping booking blocked with 409 Conflict"
}

# Simulate Payment
$paymentBody = @{
    bookingId = $newBooking.id
    method = "TRANSFER"
} | ConvertTo-Json

$payRes = Invoke-RestMethod -Uri "$baseUrl/payments/simulate" -Method Post -Headers @{ Authorization = "Bearer $userToken" } -ContentType "application/json" -Body $paymentBody
Assert-Equal $payRes.data.status "SUCCESS" "Payment simulated successfully"

# Verify booking is now CONFIRMED
$confirmedBooking = Invoke-RestMethod -Uri "$baseUrl/bookings/$($newBooking.id)" -Method Get -Headers @{ Authorization = "Bearer $userToken" }
Assert-Equal $confirmedBooking.data.status "CONFIRMED" "Booking auto-confirmed upon successful payment"

# Partner completes the booking
$completeRes = Invoke-RestMethod -Uri "$baseUrl/partner/bookings/$($newBooking.id)/status" -Method Put -Headers @{ Authorization = "Bearer $partnerToken" } -ContentType "application/json" -Body '{"status":"COMPLETED"}'
Assert-Equal $completeRes.data.status "COMPLETED" "Partner marked booking as COMPLETED"

# User submits review
$reviewBody = @{
    bookingId = $newBooking.id
    rating = 5
    comment = "E2E Test: Mobil sangat bersih dan proses serah terima lancar jaya!"
} | ConvertTo-Json

$reviewRes = Invoke-RestMethod -Uri "$baseUrl/reviews" -Method Post -Headers @{ Authorization = "Bearer $userToken" } -ContentType "application/json" -Body $reviewBody
Assert-Equal $reviewRes.data.rating "5" "Review posted successfully for completed booking"

# 5. Admin Approval Workflow
Write-Host "`n[5/5] Testing Admin Partner Approval Workflow..." -ForegroundColor Yellow

$pendingApps = Invoke-RestMethod -Uri "$baseUrl/admin/applications?status=PENDING" -Method Get -Headers @{ Authorization = "Bearer $adminToken" }
if ($pendingApps.data.Count -gt 0) {
    $targetApp = $pendingApps.data[0]
    $approveRes = Invoke-RestMethod -Uri "$baseUrl/admin/applications/$($targetApp.id)/approve" -Method Put -Headers @{ Authorization = "Bearer $adminToken" }
    Assert-Equal $approveRes.data.status "ACTIVE" "Admin approved partner rental application (Status: ACTIVE)"
}

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "ALL AUTOMATED ACCEPTANCE TESTS PASSED (100% SUCCESS)!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
