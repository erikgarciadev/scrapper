export async function inyectScript(path, tabId) {
  const options = {
    target: { tabId },
    files: [path],
  };
  return chrome.scripting.executeScript(options);
}

export async function inyectScrapCandidates(tabId) {
  return inyectScript("scripts/scrapCandidates.js", tabId);
}

export async function deleteAndCreateTab(url, oldId = null) {
  try {
    if (oldId) {
      chrome.tabs.remove(oldId);
    }

    // eslint-disable-next-line no-undef
    const { id } = await chrome.tabs.create({ url });
    return id;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("🚀 ~ chrome.js ~ line 24 ~ deleteAndCreateTab ~ error", error);
    throw error;
  }
}
