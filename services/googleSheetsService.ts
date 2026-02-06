
/**
 * GOOGLE SHEETS & DRIVE INTEGRATION SERVICE
 */

// STEP 1: Replace this URL with your actual "Web App URL" from the Google Apps Script "Deploy" menu.
// The URL should look like: https://script.google.com/macros/s/ABC_YOUR_ID_XYZ/exec
const SCRIPT_URL = 'REPLACE_WITH_YOUR_DEPLOYED_WEB_APP_URL'; 

/**
 * Helper to determine if the script URL has been updated by the user.
 */
const isConfigured = () => {
  return SCRIPT_URL && 
         SCRIPT_URL.startsWith('https://script.google.com') && 
         !SCRIPT_URL.includes('REPLACE_WITH_YOUR');
};

/**
 * Universal sync function for spreadsheet data
 */
export const syncToSheets = async (action: 'user' | 'product' | 'order' | 'special_request' | 'community_post' | 'message', data: any) => {
  if (!isConfigured()) {
    console.warn(`[Aura Registry] SIMULATION MODE: Action "${action}" was NOT sent to Google Sheets.`);
    console.info(`Reason: SCRIPT_URL in googleSheetsService.ts is still set to placeholder.`);
    return true;
  }

  try {
    console.log(`[Aura Registry] Syncing ${action} to cloud...`);
    // We use 'no-cors' for Google Apps Script to bypass CORS preflight issues 
    // caused by the script's redirect behavior.
    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', 
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action, data })
    });
    console.log(`[Aura Registry] ${action} sync request dispatched.`);
    return true;
  } catch (error) {
    console.error(`[Aura Registry] Sync to Sheets failed for ${action}:`, error);
    return false;
  }
};

/**
 * Helper specifically for storing images in Google Drive via Apps Script
 */
export const uploadImageToDrive = async (base64Data: string, fileName: string) => {
  if (!isConfigured()) {
    console.warn("[Aura Drive] SIMULATION MODE: Image upload skipped. Using mock URL.");
    return "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338"; 
  }

  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({
        action: 'uploadImage',
        data: {
          base64: base64Data.split(',')[1],
          mimeType: base64Data.split(';')[0].split(':')[1],
          name: fileName
        }
      })
    });
    const result = await response.json();
    return result.url;
  } catch (error) {
    console.error("[Aura Drive] Drive upload failed:", error);
    return null;
  }
};

export const getUserRole = async (email: string): Promise<'ADMIN' | 'USER' | null> => {
  if (!isConfigured()) return null;

  try {
    const response = await fetch(`${SCRIPT_URL}?action=getRole&email=${encodeURIComponent(email)}`);
    if (!response.ok) return null;
    const result = await response.json();
    return result.role;
  } catch (error) {
    return null;
  }
};

export const getProducts = async (): Promise<any[] | null> => {
  if (!isConfigured()) return null;

  try {
    const response = await fetch(`${SCRIPT_URL}?action=getProducts`);
    if (!response.ok) return null;
    const result = await response.json();
    return result.products || null;
  } catch (error) {
    return null;
  }
};

export const getAllUsers = async (): Promise<any[]> => {
  if (!isConfigured()) {
    // Return empty or mock data if not configured
    return [
      { email: 'SYSTEM_MOCK_ADMIN@aura.com', role: 'ADMIN', timestamp: Date.now() }
    ];
  }

  try {
    const response = await fetch(`${SCRIPT_URL}?action=getUsers`);
    if (!response.ok) return [];
    const result = await response.json();
    return result.users || [];
  } catch (error) {
    console.error("[Aura Registry] Failed to fetch user registry:", error);
    return [];
  }
};

export const getAllRequests = async (): Promise<any[]> => {
  if (!isConfigured()) return [];
  try {
    const response = await fetch(`${SCRIPT_URL}?action=getRequests`);
    if (!response.ok) return [];
    const result = await response.json();
    return result.requests || [];
  } catch (error) {
    return [];
  }
};
