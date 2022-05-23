import React, { useState } from "react";
import { Table, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";
import { Router } from "../routes";

const RequestRow = ({ address, request, id, approversCount }) => {
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingFinalize, setLoadingFinalize] = useState(false);

  const { Row, Cell } = Table;
  const readyToFinalize =
    request.approvalCount > approversCount / 2 && !request.complete;

  const onApprove = async () => {
    try {
      setLoadingApprove(true);
      const campaign = Campaign(address);
      // const accounts = await web3.eth.getAccounts();
      const currentAccount = await web3.currentProvider.selectedAddress;

      await campaign.methods.approveRequest(id).send({
        from: currentAccount,
      });

      Router.replaceRoute(`/campaigns/${address}/requests`); // replace help user click back. if push, click back is same url
    } catch (error) {}
    setLoadingApprove(false);
  };

  const onFinalize = async () => {
    try {
      setLoadingFinalize(true);
      const campaign = Campaign(address);
      // const account = await web3.eth.getAccounts();
      const currentAccount = await web3.currentProvider.selectedAddress;
      await campaign.methods.finalizeRequest(id).send({ from: currentAccount });

      Router.replaceRoute(`/campaigns/${address}/requests`); // replace help user click back. if push, click back is same url
    } catch (error) {}
    setLoadingFinalize(false);
  };
  return (
    <Row disable={request.complete} positive={readyToFinalize}>
      <Cell>{id}</Cell>
      <Cell>{request.description}</Cell>
      <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
      <Cell>{request.recipient}</Cell>
      <Cell>
        {request.approvalCount}/{approversCount}
      </Cell>
      <Cell>
        {!request.complete ? (
          <Button
            loading={loadingApprove}
            basic
            color={"green"}
            onClick={onApprove}
            disabled={loadingApprove || loadingFinalize}
          >
            Approve
          </Button>
        ) : null}
      </Cell>
      <Cell>
        {!request.complete ? (
          <Button
            loading={loadingFinalize}
            color={"teal"}
            basic
            onClick={onFinalize}
            disabled={loadingApprove || loadingFinalize}
          >
            Finalize
          </Button>
        ) : null}
      </Cell>
    </Row>
  );
};

export default RequestRow;
