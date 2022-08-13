import { SecureChannelsEnum as secureChannels } from "./constants";
import fetchService from "./service/fetchService";
import {
  deleteAndCreateTab,
  inyectScrapCandidates,
  inyectScript,
} from "./utils/chrome";

// eslint-disable-next-line no-undef
chrome.action.onClicked.addListener((tab) => {
  inyectScrapCandidates(tab.id);
});

// eslint-disable-next-line no-undef
chrome.runtime.onConnect.addListener((port) => {
  if (!Object.values(secureChannels).includes(port.name))
    throw new Error("Not secure Channel");

  port.onMessage.addListener(_portOnmessageHandler);
});

async function saveProfile(profile){
    try {
       await fetchService.createProfile(profile)
    } catch (error) {
        console.log(error)
    }
}

async function saveUrlsCandidates(urlsCandidates) {
  if (!urlsCandidates.length) throw new Error("Not enough data");

  const requests = [];
  const { MAX_CANDIDATES = 1 } = process.env;

  let count = 0;

  for (const urlCandidate of urlsCandidates) {
    if (count === MAX_CANDIDATES) {
      break;
    }
    requests.push(deleteAndCreateTab(urlCandidate.raw));
    count++;
  }
  const result = await Promise.all(requests);
  for (const tab of result) {
    inyectScript('scripts/scrapper.js', tab)
  }

}


const _portOnmessageHandler = async (msg, port) => {
  const { urlsCandidates, profile } = msg;

  const {
    name,
    sender: {
      tab: { id: tabId, url: tabUrl },
    },
  } = port;


  switch (name) {
    case secureChannels.scrapProfile: {
      saveProfile(profile)
      chrome.tabs.remove(tabId);

      break;
    }
    case secureChannels.scrapProfiles:
      saveUrlsCandidates(urlsCandidates);
      break;
    default:
      break;
  }
};
