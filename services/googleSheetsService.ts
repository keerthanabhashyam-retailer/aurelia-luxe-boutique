
/**
 * GOOGLE SHEETS & DRIVE INTEGRATION SERVICE
 */

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbygRcPeoMCGgfuqAAwE_5vo52AuSD2t2kaD-ln8JlI7eHc5v-X5ajIbyg2ol10Awo2g/exec'; 

export const syncToSheets = async (action: 'user' | 'product' | 'order' | 'report' | 'special_request', data: any) => {
  console.log(`[Google Sync] Syncing ${action}...`, data);
  
  if (!SCRIPT_URL || SCRIPT_URL.includes('YOUR_DEPLOYED_SCRIPT_ID')) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`[SIMULATION] ${action} logged to virtual spreadsheet.`);
        resolve(true);
      }, 800);
    });
  }

  try {
    // Note: mode 'no-cors' is used for POST requests to Apps Script as it doesn't return standard CORS headers
    await fetch(SCRIPT_URL, {
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

/**
 * Fetches the user's role from the spreadsheet.
 * This allows an Admin to manually change a role in the Sheet and have it reflect in the app.
 */
export const getUserRole = async (email: string): Promise<'ADMIN' | 'USER' | null> => {
  if (!SCRIPT_URL || SCRIPT_URL.includes('YOUR_DEPLOYED_SCRIPT_ID')) {
    // Simulation logic for demo
    if (email.toLowerCase().includes('admin')) return 'ADMIN';
    return 'USER';
  }

  try {
    // For GET requests, Apps Script supports standard JSON returns
    const response = await fetch(`${SCRIPT_URL}?action=getRole&email=${encodeURIComponent(email)}`);
    const result = await response.json();
    return result.role; // Expecting { role: 'ADMIN' | 'USER' }
  } catch (error) {
    console.warn("Failed to fetch role from sheets, falling back to local detection.", error);
    return null;
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
