
// Fixing TS error: Cannot find name 'chrome'
declare const chrome: any;

// Chrome Extension Background Service Worker
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "scanWithPhishShield",
    title: "Scan selection with PhishShield Pro",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "scanWithPhishShield" && info.selectionText) {
    // Save the selected text to storage so the popup can retrieve it
    chrome.storage.local.set({ 
      pendingScan: info.selectionText,
      pendingType: 'text' 
    }, () => {
      // Optional: Open the popup or a side panel if supported
      console.log("Selection saved for scanning.");
    });
  }
});
