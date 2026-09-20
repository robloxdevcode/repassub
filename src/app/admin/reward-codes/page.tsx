import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { canAccessRewardCodes } from "@/lib/admin-access";
import { listActivePrizeCodes, listPrizeCodeHistory } from "@/lib/actions/prize-codes";
import { RewardCodesPanel } from "@/components/admin/reward-codes-panel";

export const dynamic = "force-dynamic";

export default async function AdminRewardCodesPage() {
  const user = await getCurrentUser();
  if (!user || !canAccessRewardCodes(user)) redirect("/admin");

  const [initialActive, initialHistory] = await Promise.all([
    listActivePrizeCodes(),
    listPrizeCodeHistory(),
  ]);

  return <RewardCodesPanel initialActive={initialActive} initialHistory={initialHistory} />;
}
