pragma solidity ^ 0.4.17;

contract CampaignFactory{
    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        address newCampaign = new Campaign(minimum,msg.sender);
        deployedCampaigns.push(newCampaign);        
    }

    function getDeployedCampaigns() public view  returns (address[]){
        return deployedCampaigns;
    }
}

contract Campaign{
    struct Request{
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests; // manager can create multi request in one campaign
    address public manager;
    uint public minimumContribution;
    // address[] public  approvers; // dont use array because we must take a lot of gas to use loop to check approver who approved or not
    mapping(address => bool) public approvers;
    uint public approversCount;

    modifier restricted(){
        require(msg.sender ==  manager);
        _;
    }

    function Campaign(uint minimum, address creator) public {
        manager = creator; // creator instead msg.sender because we use other contract to create campaign, so msg.sender is address of CampaignFactory
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value >= minimumContribution);
        require(!approvers[msg.sender]);

        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string description, uint value, address recipient) public restricted {
        // we don't need add any code to initialize reference type, mapping is a reference type
        Request memory newRequest = Request({
            description : description,
            value:value,
            recipient: recipient,
            complete: false,
            approvalCount:0
        });

        requests.push(newRequest);
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender]); //check if sender has been contribute
        require(!request.approvals[msg.sender]); //check if sender hasn't been approve in this request

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];

        require(request.approvalCount > (approversCount / 2));
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }
}