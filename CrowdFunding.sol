// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CrowdFunding {
    address public owner;
    uint256 public goal;
    uint256 public deadline;
    uint256 public totalFunds;
    mapping(address => uint256) public contributions;
    address[] public contributors;

    constructor(uint256 _goal, uint256 _deadline) {
        owner = msg.sender;
        goal = _goal;
        deadline = _deadline;
        totalFunds = 0;
    }

    event DebugInfo(string info, uint256 value);

    function contribute() public payable {
        emit DebugInfo("Current timestamp", block.timestamp);
        emit DebugInfo("Deadline", deadline);
        emit DebugInfo("Contribution amount", msg.value);

        require(block.timestamp < deadline, "Funding period has ended");
        require(msg.value > 0, "Contribution should be more than 0");

        if (contributions[msg.sender] == 0) {
            contributors.push(msg.sender);
        }
        contributions[msg.sender] += msg.value;
        totalFunds += msg.value;
    }

    function getContributorsCount() public view returns (uint256) {
        return contributors.length;
    }

    function withdraw() public {
        require(block.timestamp > deadline, "Funding period not yet ended");
        require(msg.sender == owner, "Only owner can withdraw");
        require(totalFunds >= goal, "Funding goal not met");

        payable(owner).transfer(totalFunds);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function refund() public {
        require(block.timestamp > deadline, "Funding period not yet ended");
        require(totalFunds < goal, "Funding goal met, no refunds");

        uint256 contributed = contributions[msg.sender];
        require(contributed > 0, "No contributions found for the sender");

        contributions[msg.sender] = 0;
        payable(msg.sender).transfer(contributed);
    }
}
