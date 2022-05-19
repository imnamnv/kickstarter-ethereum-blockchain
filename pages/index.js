import React, { useEffect } from "react";
import { Card, Button } from "semantic-ui-react";
import factory from "../ethereum/factory";
import Layout from "../components/Layout";

const CampaignIndex = ({ campaigns }) => {
  // this is excute in server side before campaignIndex is rendered
  CampaignIndex.getInitialProps = async () => {
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    return { campaigns };
  };

  const renderCampaigns = () => {
    const items = campaigns?.map((address) => ({
      header: address,
      description: <a>View Campaign</a>,
      fluid: true,
    }));

    return <Card.Group items={items} />;
  };

  return (
    <Layout>
      <div>
        <h3>Open Campaigns</h3>
        <Button
          floated="right"
          content="Create Campaign"
          icon={"add circle"}
          primary
        />
        {renderCampaigns()}
      </div>
    </Layout>
  );
};

export default CampaignIndex;
