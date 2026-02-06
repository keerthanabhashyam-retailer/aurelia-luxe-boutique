
/**
 * GOOGLE SHEETS & DRIVE INTEGRATION SERVICE
 */

// NOTE: This URL is a placeholder. You must replace it with your own Deployed Google Apps Script Web App URL.
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbygRcPeoMCGgfuqAAwE_5vo52AuSD2t2kaD-ln8JlI7eHc5v-X5ajIbyg2ol10Awo2g/exec'; 

/**
 * Helper to determine if the script URL is still the placeholder.
 */
const isConfigured = () => {
  return SCRIPT_URL && 
         !SCRIPT_URL.includes('YOUR_DEPLOYED_SCRIPT_ID') && 
         !SCRIPT_URL.includes('AKfycbygRcPeoMCGgfuqAAwE_5vo52AuSD2t2kaD-ln8JlI7eHc5v-X5ajIbyg2ol10Awo2g');
};

/**
 * Universal sync function for spreadsheet data
 */
export const syncToSheets = async (action: 'user' | 'product' | 'order' | 'special_request' | 'community_post' | 'message', data: any) => {
  if (!isConfigured()) {
    console.log(`[Aura Dev] Simulation: ${action} logic executed locally.`);
    return true;
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
    console.error("Sync to Sheets failed:", error);
    return false;
  }
};

/**
 * Helper specifically for storing images in Google Drive via Apps Script
 */
export const uploadImageToDrive = async (base64Data: string, fileName: string) => {
  if (!isConfigured()) {
    console.log("[Aura Dev] Simulation: Image processed locally.");
    return "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338"; // Mock URL
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
    console.error("Drive upload failed:", error);
    return null;
  }
};

export const getUserRole = async (email: string): Promise<'ADMIN' | 'USER' | null> => {
  if (!isConfigured()) {
    return email.toLowerCase().includes('admin') ? 'ADMIN' : 'USER';
  }

  try {
    const response = await fetch(`${SCRIPT_URL}?action=getRole&email=${encodeURIComponent(email)}`);
    if (!response.ok) return null;
    const result = await response.json();
    return result.role;
  } catch (error) {
    console.warn("Failed to fetch role from server.");
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
    console.warn("Server products unavailable. Loading local catalog.");
    return null;
  }
};

export const getAllUsers = async (): Promise<any[]> => {
  if (!isConfigured()) {
    return [
      { email: 'admin@aura.com', role: 'ADMIN', timestamp: Date.now() },
      { email: 'customer@aura.com', role: 'USER', timestamp: Date.now() - 3600000 }
    ];
  }

  try {
    const response = await fetch(`${SCRIPT_URL}?action=getUsers`);
    if (!response.ok) return [];
    const result = await response.json();
    return result.users || [];
  } catch (error) {
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
