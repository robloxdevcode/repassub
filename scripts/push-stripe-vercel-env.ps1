# Push Stripe env vars from .env.local to Vercel Production (linklock.org project).
# Usage: powershell -ExecutionPolicy Bypass -File scripts/push-stripe-vercel-env.ps1

$vercelProject = if ($env:VERCEL_PROJECT) { $env:VERCEL_PROJECT } else { "linklock" }

$envFile = Join-Path (Join-Path $PSScriptRoot "..") ".env.local" | Resolve-Path
$content = Get-Content $envFile -Raw

$keys = @(
  "SITE_URL",
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_APP_URL",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_PRO_MONTHLY_PRICE_ID",
  "STRIPE_PRO_YEARLY_PRICE_ID",
  "STRIPE_PRO_MONTHLY_PRICE_ID_USD",
  "STRIPE_PRO_YEARLY_PRICE_ID_USD",
  "STRIPE_PRO_MONTHLY_PRICE_ID_GBP",
  "STRIPE_PRO_YEARLY_PRICE_ID_GBP",
  "STRIPE_PRO_MONTHLY_PRICE_ID_PLN",
  "STRIPE_PRO_YEARLY_PRICE_ID_PLN"
)

Push-Location (Join-Path $PSScriptRoot "..")

foreach ($key in $keys) {
  if ($content -match "(?m)^$key=(.+)$") {
    $value = $Matches[1].Trim()
    if (-not $value) { continue }

    Write-Host "Setting $key on Vercel project '$vercelProject' (production)..." -ForegroundColor Cyan
    $prev = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    npx.cmd vercel env add $key production --project $vercelProject --value $value --force --yes --sensitive 2>&1 | Out-Host
    $ErrorActionPreference = $prev
  }
}

Write-Host ""
Write-Host "Done. Redeploy the linklock project for changes to take effect:" -ForegroundColor Green
Write-Host "  npx vercel --prod --project linklock"

Pop-Location
