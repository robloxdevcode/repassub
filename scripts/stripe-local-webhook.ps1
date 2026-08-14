# Forward Stripe test webhooks to local Linklock dev server.
# Requires Stripe CLI: https://stripe.com/docs/stripe-cli
#
# Usage (from repo root):
#   powershell -ExecutionPolicy Bypass -File scripts/stripe-local-webhook.ps1

$ErrorActionPreference = "Stop"
$port = if ($env:PORT) { $env:PORT } else { "3000" }
$forwardUrl = "localhost:$port/api/webhooks/stripe"

$stripeCmd = $null
$bundled = Join-Path $env:LOCALAPPDATA "stripe-cli\stripe.exe"
if (Test-Path $bundled) {
  $stripeCmd = $bundled
} else {
  $stripe = Get-Command stripe -ErrorAction SilentlyContinue
  if ($stripe) { $stripeCmd = $stripe.Source }
}

if (-not $stripeCmd) {
  Write-Host "Stripe CLI not found." -ForegroundColor Yellow
  Write-Host ""
  Write-Host "Install options:"
  Write-Host "  1. Download: https://github.com/stripe/stripe-cli/releases/latest"
  Write-Host "  2. Or: scoop install stripe"
  Write-Host ""
  Write-Host "Then run:"
  Write-Host "  stripe login"
  Write-Host "  stripe listen --forward-to $forwardUrl"
  Write-Host ""
  Write-Host "Copy the whsec_... signing secret into STRIPE_WEBHOOK_SECRET in .env.local"
  Write-Host "Restart npm run dev after updating .env.local"
  exit 1
}

Write-Host "Forwarding Stripe events to http://$forwardUrl" -ForegroundColor Cyan
Write-Host "Copy the whsec_... secret into STRIPE_WEBHOOK_SECRET in .env.local" -ForegroundColor Yellow
Write-Host ""

& $stripeCmd listen --forward-to $forwardUrl
