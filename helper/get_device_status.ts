export const getDeviceStatus = (updatedAt: any): 'active' | 'issue' | 'problem' => {
    const now = new Date();
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
    const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);
  
    return updatedAt >= thirtyMinutesAgo
      ? 'active'
      : updatedAt >= sixHoursAgo
      ? 'issue'
      : 'problem';
};