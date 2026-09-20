/** Whole-site maintenance gate. Default: ON until LINKLOCK_MAINTENANCE=false on Vercel. */
export function isMaintenanceMode() {
  return process.env.LINKLOCK_MAINTENANCE !== "false";
}
