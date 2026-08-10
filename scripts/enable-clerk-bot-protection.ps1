# Enable Clerk bot sign-up protection (Cloudflare Turnstile CAPTCHA on suspicious sign-ups).
# Run once after: npx clerk@latest login

npx clerk@latest config patch `
  --instance prod `
  --json '{"auth_attack_protection":{"bot_protection":{"captcha_enabled":true}}}' `
  --yes

Write-Host "Done. Bot sign-up protection enabled on production Clerk instance."
