import {
  profileSelectors,
  urls as configUrls,
} from "../config/scrapper.config";
import { $, $$ } from "../utils/selectors";
import { getCookie } from "../utils/cookie";
import { waitForScroll, waitForSelector } from "../utils/waitFor";
import axiosService from "../service/axiosService";

async function getContacInfo() {
  try {
    const { baseUrl, urlContactInfo, api } = configUrls;
    const token = getCookie("JSESSIONID", document.cookie);

    const [contactInfoName] =
      $(profileSelectors.contactInfo).href.match(/in\/.+\/o/g) ?? [];

    const contactInfoURL = baseUrl + api + urlContactInfo(contactInfoName);

    const {
      data: { data },
    } = axiosService.getContactInfo(contactInfoURL, token);

    return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("🚀 scrapper.js ~ line 30 ~ getContacInfo ~ error", error);
    throw new Error("error al obtener info del contacto");
  }
}

function getEspecificInfo(selector) {
  try {
    const Elements = $$(selector);

    return Elements.map((listItem) => {
      if (!$(".pvs-entity__path-node", listItem)) {
        const [title, enterprise, dateStringInfo] = $$(
          "span[aria-hidden]",
          listItem
        ).map((element) => element.textContent);

        return { title, enterprise };
      }
    });
  } catch (error) {
    console.log("🚀scrapper.js ~ line 51 ~ getEspecificInfo ~ error", error);
  }
}

async function getVisibleData() {
  await waitForSelector("h1");
  await waitForScroll();

  const name = $(profileSelectors.name).textContent;
  const experiences = getEspecificInfo(profileSelectors.experiencesElements);
  const educations = getEspecificInfo(profileSelectors.educationElements);
  return {
    name,
    experiences,
    educations,
  };
}

async function scrap() {
  try {
    const [contactInfo, visibleData] = await Promise.all([
      getContacInfo(),
      getVisibleData(),
    ]);

    const profile = {
      ...visibleData,
      contactInfo,
    };

    const port = chrome.runtime.connect({ name: "secureChannelScrapProfile" });

    port.postMessage({ profile });
  } catch (error) {
    console.log("🚀 ~ file: scrapper.js ~ line 68 ~ scrap ~ error", error);
  }
}

scrap();
