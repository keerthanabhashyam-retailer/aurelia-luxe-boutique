
/**
 * GOOGLE SHEETS & DRIVE INTEGRATION SERVICE
 */

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbygRcPeoMCGgfuqAAwE_5vo52AuSD2t2kaD-ln8JlI7eHc5v-X5ajIbyg2ol10Awo2g/exec'; 

export const syncToSheets = async (action: 'user' | 'product' | 'order' | 'report' | 'special_request' | 'community_post' | 'message', data: any) => {
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

export const getUserRole = async (email: string): Promise<'ADMIN' | 'USER' | null> => {
  if (!SCRIPT_URL || SCRIPT_URL.includes('YOUR_DEPLOYED_SCRIPT_ID')) {
    if (email.toLowerCase().includes('admin')) return 'ADMIN';
    return 'USER';
  }

  try {
    const response = await fetch(`${SCRIPT_URL}?action=getRole&email=${encodeURIComponent(email)}`);
    const result = await response.json();
    return result.role;
  } catch (error) {
    console.warn("Failed to fetch role.", error);
    return null;
  }
};

/**
 * Fetches all registered users for the Admin panel
 */
export const getAllUsers = async (): Promise<any[]> => {
  if (!SCRIPT_URL || SCRIPT_URL.includes('YOUR_DEPLOYED_SCRIPT_ID')) {
    return [
      { email: 'admin@aura.com', role: 'ADMIN', timestamp: Date.now() },
      { email: 'customer1@test.com', role: 'USER', timestamp: Date.now() - 86400000 },
      { email: 'customer2@test.com', role: 'USER', timestamp: Date.now() - 172800000 }
    ];
  }

  try {
    const response = await fetch(`${SCRIPT_URL}?action=getUsers`);
    const result = await response.json();
    return result.users || [];
  } catch (error) {
    console.error("Failed to fetch users.", error);
    return [];
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
