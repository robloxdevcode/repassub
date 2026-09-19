"use server";

import { revalidatePath } from "next/cache";
import { ReportStatus, ReportTargetType } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
import { banUser } from "@/lib/actions/dashboard";
import { db } from "@/lib/db";

export async function getAdminReports() {
  await requireAdmin();
  return db.report.findMany({
    include: {
      reporter: { select: { username: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function updateReportStatus(reportId: string, status: ReportStatus) {
  await requireAdmin();
  await db.report.update({
    where: { id: reportId },
    data: { status },
  });
  revalidatePath("/admin/reports");
}

export async function suspendFromReport(reportId: string) {
  await requireAdmin();

  const report = await db.report.findUnique({ where: { id: reportId } });
  if (!report) throw new Error("Report not found");

  let userId: string | null = null;

  if (report.targetType === ReportTargetType.USER) {
    const user = await db.user.findUnique({ where: { id: report.targetId } });
    userId = user?.id ?? null;
  } else {
    const campaign = await db.campaign.findUnique({
      where: { id: report.targetId },
      select: { userId: true },
    });
    userId = campaign?.userId ?? null;
  }

  if (!userId) throw new Error("Could not find a user to suspend for this report");

  const banResult = await banUser(userId, true);
  if (!banResult.ok) throw new Error(banResult.message);

  await db.report.update({
    where: { id: reportId },
    data: { status: ReportStatus.RESOLVED },
  });

  revalidatePath("/admin/reports");
  revalidatePath("/admin/users");
}
