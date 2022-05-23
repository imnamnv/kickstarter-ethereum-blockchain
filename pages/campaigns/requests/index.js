import React from "react";
import { Link } from "../../../routes";
import Layout from "../../../components/Layout";
import { Button, Table } from "semantic-ui-react";
import Campaign from "../../../ethereum/campaign";
import RequestRow from "../../../components/RequestRow";

const RequestIndex = ({ address, requests, approversCount }) => {
  const { Header, Row, HeaderCell, Body } = Table;

  const renderRows = () => {
    return requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          address={address}
          approversCount={approversCount}
        />
      );
    });
  };
  return (
    <Layout>
      <h3>Request Index</h3>
      <Link route={`/campaigns/${address}/requests/new`}>
        <a>
          <Button style={{ marginBottom: 10 }} floated={"right"} primary>
            Add Request
          </Button>
        </a>
      </Link>
      <Table celled>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval Count</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>{renderRows()}</Body>
      </Table>
    </Layout>
  );
};

RequestIndex.getInitialProps = async (props) => {
  const { address } = props.query;
  const campaign = Campaign(address);
  const requestCount = await campaign.methods.getRequestCount().call();
  const approversCount = await campaign.methods.approversCount().call();

  const requests = await Promise.all(
    Array(+requestCount)
      .fill()
      .map((element, index) => {
        return campaign.methods.requests(index).call();
      })
  );
  return { address, requests, approversCount };
};

export default RequestIndex;
