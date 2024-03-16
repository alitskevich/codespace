import launchWeb from "arrmatura-web";
import templates from "./index.xml";
import ui from "arrmatura-ui";
import defaults from "arrmatura-ui/resources";
import assets from "./assets";
import * as utils from "./utils";
import { urlParse } from "ultimus";

const { params } = urlParse(window.location.href);

export const baseURL = 'https://hacker-news.firebaseio.com/v0'

const feedsInfo = {
  news: { title: 'News', pages: 10 },
  newest: { title: 'Newest', pages: 12 },
  ask: { title: 'Ask', pages: 2 },
  show: { title: 'Show', pages: 2 },
  jobs: { title: 'Jobs', pages: 1 }
}

const enums = {
  feedsInfo
}

export const validFeeds = Object.keys(feedsInfo)

const config = {
  resources: { ...defaults, assets, enums, params, },
  functions: { ...utils },
  components: [...ui, templates]
};

launchWeb(config);