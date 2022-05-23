import React, { useState } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import Campaign from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
import { Router, Link } from "../../../routes";

const RequestNew = ({ address }) => {
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [recipient, setRecipient] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);

    const campaign = Campaign(address);

    try {
      // const accounts = await web3.eth.getAccounts();
      const currentAccount = await web3.currentProvider.selectedAddress;

      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
        .send({
          from: currentAccount,
        });

      Router.pushRoute(`/campaigns/${address}/requests`);
    } catch (error) {
      setErrorMessage(error.message);
    }
    setLoading(false);
  };
  return (
    <Layout>
      <Link route={`/campaigns/${address}/requests`}>
        <a>Back</a>
      </Link>
      <h3>Create a Request</h3>
      <Form onSubmit={onSubmit} error={!!errorMessage}>
        <Form.Field>
          <label>Description</label>
          <Input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Value in Ether</label>
          <Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Recipient</label>
          <Input
            value={recipient}
            onChange={(event) => setRecipient(event.target.value)}
          />
        </Form.Field>
        <Message
          error
          header={"Something was wrong!!!"}
          content={errorMessage}
        ></Message>
        <Button loading={loading} primary>
          Create!
        </Button>
      </Form>
    </Layout>
  );
};

RequestNew.getInitialProps = async (props) => {
  const { address } = props.query;
  return { address };
};
export default RequestNew;
