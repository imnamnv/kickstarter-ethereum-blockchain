import web3 from "./web3";

import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x957b2d36c5fbd9fb4e3331c8a8683d3d4f5e11e9"
);

export default instance;
