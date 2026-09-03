// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title FINXEscrow
 * @dev Escrow contract for CSR milestone-based funding.
 * This is a prototype for hackathon demonstration.
 */
contract FINXEscrow {
    address public corporate;
    address public ngo;
    address public admin;

    uint256 public totalFunds;
    uint256 public fundsReleased;

    enum MilestoneStatus { Locked, Reviewing, Released }

    struct Milestone {
        uint256 amount;
        MilestoneStatus status;
        string proofCID; // IPFS CID or centralized DB reference for proof
    }

    mapping(uint256 => Milestone) public milestones;
    uint256 public milestoneCount;

    event EscrowFunded(uint256 amount);
    event ProofSubmitted(uint256 milestoneId, string proofCID);
    event MilestoneReleased(uint256 milestoneId, uint256 amount);

    constructor(address _ngo, address _admin) payable {
        corporate = msg.sender;
        ngo = _ngo;
        admin = _admin;
        totalFunds = msg.value;
    }

    function addMilestone(uint256 _amount) public {
        require(msg.sender == corporate || msg.sender == admin, "Only Corporate/Admin can add milestones");
        milestoneCount++;
        milestones[milestoneCount] = Milestone({
            amount: _amount,
            status: MilestoneStatus.Locked,
            proofCID: ""
        });
    }

    function submitProof(uint256 _milestoneId, string memory _proofCID) public {
        require(msg.sender == ngo, "Only NGO can submit proof");
        require(milestones[_milestoneId].status == MilestoneStatus.Locked, "Milestone not locked");

        milestones[_milestoneId].status = MilestoneStatus.Reviewing;
        milestones[_milestoneId].proofCID = _proofCID;

        emit ProofSubmitted(_milestoneId, _proofCID);
    }

    function approveAndRelease(uint256 _milestoneId) public {
        require(msg.sender == admin, "Only Admin can release funds");
        require(milestones[_milestoneId].status == MilestoneStatus.Reviewing, "Milestone not in review");

        Milestone storage m = milestones[_milestoneId];
        require(address(this).balance >= m.amount, "Insufficient balance in escrow");

        m.status = MilestoneStatus.Released;
        fundsReleased += m.amount;

        (bool success, ) = payable(ngo).call{value: m.amount}("");
        require(success, "Transfer failed");

        emit MilestoneReleased(_milestoneId, m.amount);
    }
}
