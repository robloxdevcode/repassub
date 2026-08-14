# Print Vercel env var commands from .env.local Stripe section.
# Usage: powershell -ExecutionPolicy Bypass -File scripts/sync-stripe-vercel-env.ps1

$ErrorActionPreference = "Stop"
$envFile = Join-Path (Join-Path $PSScriptRoot "..") ".env.local" | Resolve-Path

$keys = @(
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

$content = Get-Content $envFile -Raw
Write-Host "Add these in Vercel → Project → Settings → Environment Variables (Production):" -ForegroundColor Cyan
Write-Host ""

foreach ($key in $keys) {
  if ($content -match "(?m)^$key=(.+)$") {
    $value = $Matches[1].Trim()
    if ($value) {
      Write-Host "$key=$value"
    }
  }
}

Write-Host ""
Write-Host "Also confirm NEXT_PUBLIC_APP_URL=https://linklock.org" -ForegroundColor Yellow
Write-Host "Redeploy after saving env vars."
