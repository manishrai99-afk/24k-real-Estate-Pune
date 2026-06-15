$body = @{
    name    = "Supabase Test Lead"
    phone   = "9876543210"
    email   = "test@supabase.com"
    message = "Integration test from Prisma to Supabase"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest `
        -Uri "http://localhost:3000/api/enquiry" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body `
        -TimeoutSec 15

    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Error: $_"
}
