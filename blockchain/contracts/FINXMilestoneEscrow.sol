// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title FINXMilestoneEscrow
 * @dev Escrow contract for CSR milestone-based funding. Hackathon Prototype.
 */
contract FINXMilestoneEscrow is ReentrancyGuard, AccessControl, Pausable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    enum ProjectStatus { Created, Funded, Active, Completed, Cancelled, Paused }
    enum MilestoneStatus { Pending, Submitted, Approved, Withdrawn }

    struct Milestone {
        uint256 amount;
        MilestoneStatus status;
        string evidenceHash;
    }

    struct Project {
        address funder;
        address ngo;
        address reviewer;
        uint256 totalAmount;
        uint256 amountFunded;
        uint256 amountReleased;
        ProjectStatus status;
        uint256 currentMilestoneIndex;
        uint256 milestoneCount;
    }

    // Mapping from projectId to Project
    mapping(string => Project) public projects;
    
    // Mapping from projectId => milestoneIndex => Milestone
    mapping(string => mapping(uint256 => Milestone)) public projectMilestones;

    event ProjectCreated(string projectId, address funder, address ngo, address reviewer, uint256 totalAmount);
    event ProjectFunded(string projectId, uint256 amount);
    event MilestoneSubmitted(string projectId, uint256 milestoneIndex, string evidenceHash);
    event MilestoneApproved(string projectId, uint256 milestoneIndex);
    event FundsReleased(string projectId, uint256 milestoneIndex, uint256 amount);
    event ProjectCancelled(string projectId, uint256 refundedAmount);
    event ProjectPaused(string projectId);
    event ProjectUnpaused(string projectId);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    modifier onlyFunder(string memory projectId) {
        require(msg.sender == projects[projectId].funder, "Not the project funder");
        _;
    }

    modifier onlyNGO(string memory projectId) {
        require(msg.sender == projects[projectId].ngo, "Not the designated NGO");
        _;
    }

    modifier onlyReviewer(string memory projectId) {
        require(msg.sender == projects[projectId].reviewer, "Not the designated reviewer");
        _;
    }

    modifier validProject(string memory projectId) {
        require(projects[projectId].funder != address(0), "Project does not exist");
        _;
    }

    function createProject(
        string memory projectId,
        address ngo,
        address reviewer,
        uint256 totalAmount,
        uint256[] memory milestoneAmounts
    ) external whenNotPaused {
        require(projects[projectId].funder == address(0), "Project ID already exists");
        require(ngo != address(0), "NGO address cannot be zero");
        require(reviewer != address(0), "Reviewer address cannot be zero");
        require(totalAmount > 0, "Total amount must be greater than zero");
        require(milestoneAmounts.length > 0 && milestoneAmounts.length <= 20, "Invalid number of milestones");

        uint256 calculatedTotal = 0;
        for (uint256 i = 0; i < milestoneAmounts.length; i++) {
            require(milestoneAmounts[i] > 0, "Milestone amount must be > 0");
            calculatedTotal += milestoneAmounts[i];
            
            projectMilestones[projectId][i] = Milestone({
                amount: milestoneAmounts[i],
                status: MilestoneStatus.Pending,
                evidenceHash: ""
            });
        }
        
        require(calculatedTotal == totalAmount, "Milestone amounts must sum exactly to totalAmount");

        projects[projectId] = Project({
            funder: msg.sender,
            ngo: ngo,
            reviewer: reviewer,
            totalAmount: totalAmount,
            amountFunded: 0,
            amountReleased: 0,
            status: ProjectStatus.Created,
            currentMilestoneIndex: 0,
            milestoneCount: milestoneAmounts.length
        });

        emit ProjectCreated(projectId, msg.sender, ngo, reviewer, totalAmount);
    }

    function fundProject(string memory projectId) external payable validProject(projectId) whenNotPaused onlyFunder(projectId) {
        Project storage project = projects[projectId];
        require(project.status == ProjectStatus.Created, "Project already funded or invalid state");
        require(msg.value == project.totalAmount, "Deposit must equal totalAmount");

        project.amountFunded = msg.value;
        project.status = ProjectStatus.Funded;

        emit ProjectFunded(projectId, msg.value);
    }

    function submitMilestone(string memory projectId, uint256 milestoneIndex, string memory evidenceHash) 
        external validProject(projectId) whenNotPaused onlyNGO(projectId) 
    {
        Project storage project = projects[projectId];
        require(project.status == ProjectStatus.Funded || project.status == ProjectStatus.Active, "Project not in funded/active state");
        require(milestoneIndex == project.currentMilestoneIndex, "Must submit the next milestone in order");
        require(milestoneIndex < project.milestoneCount, "Invalid milestone index");
        
        Milestone storage m = projectMilestones[projectId][milestoneIndex];
        require(m.status == MilestoneStatus.Pending, "Milestone already submitted or past pending");

        m.status = MilestoneStatus.Submitted;
        m.evidenceHash = evidenceHash;
        project.status = ProjectStatus.Active; // Update status if first milestone

        emit MilestoneSubmitted(projectId, milestoneIndex, evidenceHash);
    }

    function approveMilestone(string memory projectId) 
        external validProject(projectId) whenNotPaused onlyReviewer(projectId) 
    {
        Project storage project = projects[projectId];
        require(project.status == ProjectStatus.Active, "Project not active");
        
        uint256 milestoneIndex = project.currentMilestoneIndex;
        require(milestoneIndex < project.milestoneCount, "All milestones processed");

        Milestone storage m = projectMilestones[projectId][milestoneIndex];
        require(m.status == MilestoneStatus.Submitted, "Milestone not submitted yet");

        m.status = MilestoneStatus.Approved;
        
        emit MilestoneApproved(projectId, milestoneIndex);
    }

    function withdrawMilestone(string memory projectId)
        external validProject(projectId) whenNotPaused nonReentrant onlyNGO(projectId)
    {
        Project storage project = projects[projectId];
        require(project.status == ProjectStatus.Active, "Project not active");
        
        uint256 milestoneIndex = project.currentMilestoneIndex;
        require(milestoneIndex < project.milestoneCount, "All milestones processed");

        Milestone storage m = projectMilestones[projectId][milestoneIndex];
        require(m.status == MilestoneStatus.Approved, "Milestone not approved");

        // Checks-Effects-Interactions
        m.status = MilestoneStatus.Withdrawn;
        project.amountReleased += m.amount;
        project.currentMilestoneIndex += 1;

        if (project.currentMilestoneIndex == project.milestoneCount) {
            project.status = ProjectStatus.Completed;
        }

        (bool success, ) = payable(project.ngo).call{value: m.amount}("");
        require(success, "Transfer failed");

        emit FundsReleased(projectId, milestoneIndex, m.amount);
    }

    function cancelProject(string memory projectId) external validProject(projectId) nonReentrant {
        Project storage project = projects[projectId];
        require(msg.sender == project.funder || hasRole(ADMIN_ROLE, msg.sender), "Only funder or admin can cancel");
        require(project.status != ProjectStatus.Completed, "Cannot cancel completed project");
        require(project.status != ProjectStatus.Cancelled, "Already cancelled");

        project.status = ProjectStatus.Cancelled;
        
        uint256 remainingBalance = project.amountFunded - project.amountReleased;
        
        if (remainingBalance > 0) {
            project.amountReleased += remainingBalance; // Prevent further withdrawals of this balance
            (bool success, ) = payable(project.funder).call{value: remainingBalance}("");
            require(success, "Refund transfer failed");
        }

        emit ProjectCancelled(projectId, remainingBalance);
    }

    // --- Pause functionality ---
    
    function pauseProject(string memory projectId) external validProject(projectId) onlyRole(ADMIN_ROLE) {
        require(projects[projectId].status != ProjectStatus.Paused, "Already paused");
        require(projects[projectId].status != ProjectStatus.Completed && projects[projectId].status != ProjectStatus.Cancelled, "Cannot pause terminal state");
        projects[projectId].status = ProjectStatus.Paused;
        emit ProjectPaused(projectId);
    }

    function unpauseProject(string memory projectId) external validProject(projectId) onlyRole(ADMIN_ROLE) {
        require(projects[projectId].status == ProjectStatus.Paused, "Not paused");
        // Revert to Active if funded and milestones submitted, otherwise Funded
        if (projects[projectId].amountFunded > 0) {
           projects[projectId].status = ProjectStatus.Active;
        } else {
           projects[projectId].status = ProjectStatus.Created;
        }
        emit ProjectUnpaused(projectId);
    }

    // Global pause
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    // --- View Functions ---

    function getProject(string memory projectId) external view returns (Project memory) {
        return projects[projectId];
    }

    function getMilestone(string memory projectId, uint256 index) external view returns (Milestone memory) {
        return projectMilestones[projectId][index];
    }

    function getRemainingBalance(string memory projectId) external view returns (uint256) {
        return projects[projectId].amountFunded - projects[projectId].amountReleased;
    }

    function getReleasedAmount(string memory projectId) external view returns (uint256) {
        return projects[projectId].amountReleased;
    }

    function getCurrentMilestone(string memory projectId) external view returns (uint256) {
        return projects[projectId].currentMilestoneIndex;
    }

    function getProjectStatus(string memory projectId) external view returns (ProjectStatus) {
        return projects[projectId].status;
    }
}
