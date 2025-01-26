import prisma from './prisma';

export async function canGenerateReport(userId: string): Promise<{
  canGenerate: boolean;
  remainingReports: number;
  error?: string;
}> {
  const userSettings = await prisma.userSettings.findUnique({
    where: { userId }
  });

  if (!userSettings) {
    return {
      canGenerate: false,
      remainingReports: 0,
      error: 'User settings not found'
    };
  }

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Check if we need to reset monthly count
  if (!userSettings.monthlyResetDate || userSettings.monthlyResetDate < monthStart) {
    await prisma.userSettings.update({
      where: { userId },
      data: {
        monthlyReportCount: 0,
        monthlyResetDate: monthStart,
        totalAvailableReports: userSettings.monthlyReportLimit + userSettings.additionalReportsPurchased
      }
    });
    userSettings.monthlyReportCount = 0;
  }

  const totalAvailable = userSettings.totalAvailableReports;
  const used = userSettings.monthlyReportCount;
  const remaining = Math.max(0, totalAvailable - used);

  return {
    canGenerate: remaining > 0,
    remainingReports: remaining
  };
}

export async function incrementReportCount(userId: string): Promise<boolean> {
  const { canGenerate } = await canGenerateReport(userId);
  
  if (!canGenerate) {
    return false;
  }

  await prisma.userSettings.update({
    where: { userId },
    data: {
      reportCount: { increment: 1 },
      monthlyReportCount: { increment: 1 }
    }
  });

  return true;
}
