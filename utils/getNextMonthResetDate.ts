export function getNextMonthResetDate() {
    const now = new Date();
    // Create new date by setting the month to the next month
    const resetDate = new Date(now);
    resetDate.setMonth(now.getMonth() + 1);
    return resetDate;
}
