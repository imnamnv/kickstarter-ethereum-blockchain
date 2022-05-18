import React, { useEffect } from "react";
import factory from "../ethereum/factory";
export default () => {
  useEffect(() => {
    (async function () {
      const campaigns = await factory.methods.getDeployedCampaigns().call();
      console.log("campaigns", campaigns);
    })();
  }, []);

  return <h1>This is new campaign page!!</h1>;
};
