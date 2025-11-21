Write-Host "`nRunning Tests...`n" -ForegroundColor Cyan

$tests = @(
    "test/integration/tokenRoutes.test.ts",
    "test/analytics.test.ts",
    "test/wallet.test.ts",
    "test/market.test.ts",
    "test/validation.test.ts",
    "test/buySellToken.test.ts",
    "test/tokenizeProduction.test.ts"
)

foreach ($test in $tests) {
    $name = Split-Path $test -Leaf
    Write-Host "Testing $name..." -NoNewline
    
    $null = npx jest $test --silent 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host " PASSED" -ForegroundColor Green
    } else {
        Write-Host " FAILED" -ForegroundColor Red
    }
}
