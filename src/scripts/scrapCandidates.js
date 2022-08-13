import { SecureChannelsEnum } from "../constants";
import AxiosService from "../service/axiosService";
import { getUrlParams } from "../utils/urls";

async function init(keywords = "fullstack", startPaginate = 0) {
  const urlParams = getUrlParams(document.URL);

  const _keywords = urlParams.get("keywords") || keywords;
  let pagination = startPaginate;
  let urlsCandidates = [];

  const MAX_PAGINATION = 10

  do {
    const { included } = await AxiosService.getPaginate10Results(
      _keywords,
      pagination
    );

    const nextCandidates = getNextCandidates(included);

    urlsCandidates = [...urlsCandidates, ...nextCandidates];

    pagination += 10;

  } while (pagination < MAX_PAGINATION);


  const port = chrome.runtime.connect({ name: SecureChannelsEnum.scrapProfiles });
  port.postMessage({ urlsCandidates });



  return urlsCandidates || [];
}

function getNextCandidates(included) {
  return (
    included
      ?.filter((includedElement) => includedElement?.trackingUrn)
      .map((filteredIncluded) => {
        const raw = filteredIncluded?.navigationContext?.url;
        const [profileVar] = raw.match(/urn.+/) ?? [];
        return {
          raw,
          profileVar: profileVar.replace("miniP", "p").replace("Afs", "Afsd"),
        };
      }) ?? []
  );
}

init();
