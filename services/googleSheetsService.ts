
/**
 * GOOGLE SHEETS & DRIVE INTEGRATION SERVICE
 * Spreadsheet ID: 1gVxwGh4ZJ2_U4bGlwAdeoTvFp_Crxzpyaf5XEUJaVMQ
 * 
 * To make this LIVE: 
 * 1. Go to your Spreadsheet (ID: 1gVxwGh4ZJ2_U4bGlwAdeoTvFp_Crxzpyaf5XEUJaVMQ)
 * 2. Go to Extensions > Apps Script
 * 3. Copy the script provided in the Admin Dashboard > Connection Guide
 * 4. Deploy as Web App (Anyone access) and paste the URL below.
 */

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbygRcPeoMCGgfuqAAwE_5vo52AuSD2t2kaD-ln8JlI7eHc5v-X5ajIbyg2ol10Awo2g/exec'; 

export const syncToSheets = async (action: 'user' | 'product' | 'order' | 'report' | 'special_request', data: any) => {
  console.log(`[Google Sync] Syncing ${action}...`, data);
  
  if (!SCRIPT_URL || SCRIPT_URL.includes('YOUR_DEPLOYED_SCRIPT_ID')) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`[SIMULATION] ${action} logged to virtual spreadsheet ${action === 'user' ? 'Users' : 'Database'}.`);
        resolve(true);
      }, 800);
    });
  }

  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, data })
    });
    return true;
  } catch (error) {
    console.error("Sync failed:", error);
    return false;
  }
};

export const generateSalesReport = (orders: any[]) => {
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalItems = orders.reduce((sum, o) => sum + o.items.reduce((s: number, i: any) => s + i.cartQuantity, 0), 0);
  
  return {
    reportId: `REP-${Date.now()}`,
    timestamp: new Date().toISOString(),
    metrics: {
      revenue: totalRevenue,
      volume: totalItems,
      ordersCount: orders.length
    },
    topProducts: Array.from(new Set(orders.flatMap(o => o.items.map((i: any) => i.name)))).slice(0, 5)
  };
};
