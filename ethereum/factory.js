import web3 from "./web3";

import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x23C9D988A51A750cbCf6E469b463D59C9c713B25"
);

export default instance;
