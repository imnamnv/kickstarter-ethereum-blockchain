const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({
      data: compiledFactory.bytecode,
    })
    .send({
      from: accounts[0],
      gas: "1000000",
    });

  await factory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: "1000000",
  });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  //when we want to get a contract exist in blockchain
  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
});

describe("Campaigns", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("marks caller as the campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(manager, accounts[0]);
  });

  it("allows people to contribute money and marks them as approvers", async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: "200",
      gas: "1000000",
    });

    const isContribute = await campaign.methods.approvers(accounts[1]).call();
    assert(isContribute); //check truethy
  });

  it("requires a minimum contribute", async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[1],
        value: "5",
        gas: "1000000",
      });
      assert(false); // ok if this test have error
    } catch (error) {
      assert(error);
    }
  });

  it("allows a manager to make a payment request", async () => {
    await campaign.methods.createRequest("Buy car", "100", accounts[1]).send({
      from: accounts[0],
      gas: "1000000",
    });

    //request is public array. so in solidity we only can get 1 request with index.
    //if you want to get all, you must create a function with type view, returns (request[])
    const request = await campaign.methods.requests(0).call();
    assert.equal("Buy car", request.description);
  });

  it("processes requests", async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether"),
    });

    //manager sent a request which send money to special address.
    //it helps other other person vote yes or no
    await campaign.methods
      .createRequest("Buy Car", web3.utils.toWei("5", "ether"), accounts[1])
      .send({
        from: accounts[0],
        gas: "1000000",
      });

    //vote Yes
    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });

    //manager send money to special address
    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });

    //check if special address recieved money
    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, "ether");
    balance = parseFloat(balance);

    assert(balance > 104);
  });
});
