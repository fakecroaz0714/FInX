const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FINXMilestoneEscrow", function () {
    let Escrow, escrow;
    let owner, corporate, ngo, reviewer, admin, addr;

    const projectId = "PROJ-CODE-001";
    const totalAmount = ethers.parseEther("2"); // 2 ETH for testing (2,00,000 equivalent)
    const m1 = ethers.parseEther("0.4");
    const m2 = ethers.parseEther("0.6");
    const m3 = ethers.parseEther("0.6");
    const m4 = ethers.parseEther("0.4");
    const milestoneAmounts = [m1, m2, m3, m4];

    beforeEach(async function () {
        [owner, corporate, ngo, reviewer, admin, addr] = await ethers.getSigners();
        Escrow = await ethers.getContractFactory("FINXMilestoneEscrow");
        escrow = await Escrow.deploy();

        // Grant ADMIN to admin signer
        const ADMIN_ROLE = await escrow.ADMIN_ROLE();
        await escrow.grantRole(ADMIN_ROLE, admin.address);
    });

    describe("1. Project Creation", function () {
        it("Should create project successfully", async function () {
            await escrow.connect(corporate).createProject(projectId, ngo.address, reviewer.address, totalAmount, milestoneAmounts);
            const proj = await escrow.getProject(projectId);
            expect(proj.funder).to.equal(corporate.address);
            expect(proj.totalAmount).to.equal(totalAmount);
            expect(proj.milestoneCount).to.equal(4);
        });

        it("Should fail if total amount doesn't match milestone sum", async function () {
            const wrongTotal = ethers.parseEther("3");
            await expect(
                escrow.connect(corporate).createProject(projectId, ngo.address, reviewer.address, wrongTotal, milestoneAmounts)
            ).to.be.revertedWith("Milestone amounts must sum exactly to totalAmount");
        });
    });

    describe("2. Funding && 3. Submission && 4. Approval && 5. Withdrawal", function () {
        beforeEach(async function () {
            await escrow.connect(corporate).createProject(projectId, ngo.address, reviewer.address, totalAmount, milestoneAmounts);
        });

        it("Should successfully fund project", async function () {
            await escrow.connect(corporate).fundProject(projectId, { value: totalAmount });
            const proj = await escrow.getProject(projectId);
            expect(proj.status).to.equal(1); // Funded
            expect(proj.amountFunded).to.equal(totalAmount);
        });

        it("Should fail if funding amount is incorrect", async function () {
            await expect(
                escrow.connect(corporate).fundProject(projectId, { value: ethers.parseEther("1.9") })
            ).to.be.revertedWith("Deposit must equal totalAmount");
        });

        it("Full Demo Scenario: Submit, Approve, and Withdraw", async function () {
            // 1. Fund
            await escrow.connect(corporate).fundProject(projectId, { value: totalAmount });

            // 2. Submit Milestone 1
            await escrow.connect(ngo).submitMilestone(projectId, 0, "hash123");
            const m = await escrow.getMilestone(projectId, 0);
            expect(m.status).to.equal(1); // Submitted

            // Wrong milestone order check
            await expect(escrow.connect(ngo).submitMilestone(projectId, 1, "hash456")).to.be.revertedWith("Must submit the next milestone in order");

            // Unauthorized approval check
            await expect(escrow.connect(ngo).approveMilestone(projectId)).to.be.revertedWith("Not the designated reviewer");

            // 3. Approve Milestone 1
            await escrow.connect(reviewer).approveMilestone(projectId);
            const mApproved = await escrow.getMilestone(projectId, 0);
            expect(mApproved.status).to.equal(2); // Approved

            // Double approval
            await expect(escrow.connect(reviewer).approveMilestone(projectId)).to.be.revertedWith("Milestone not submitted yet");

            // Unauthorized withdrawal
            await expect(escrow.connect(corporate).withdrawMilestone(projectId)).to.be.revertedWith("Not the designated NGO");

            // 4. Withdraw Milestone 1
            const initialBal = await ethers.provider.getBalance(ngo.address);
            const tx = await escrow.connect(ngo).withdrawMilestone(projectId);
            const receipt = await tx.wait();
            // Account for gas cost theoretically, but chai matchers with closeTo are better for balances
            const finalBal = await ethers.provider.getBalance(ngo.address);
            expect(finalBal).to.be.greaterThan(initialBal); // Roughly initialBal + m1 - gas

            const proj = await escrow.getProject(projectId);
            expect(proj.amountReleased).to.equal(m1);
            expect(proj.currentMilestoneIndex).to.equal(1);

            // Double withdrawal attempt
            await expect(escrow.connect(ngo).withdrawMilestone(projectId)).to.be.revertedWith("Milestone not approved");
        });
    });

    describe("6. Cancellation & Refunds", function () {
        it("Should refund corporate if cancelled", async function () {
            await escrow.connect(corporate).createProject(projectId, ngo.address, reviewer.address, totalAmount, milestoneAmounts);
            await escrow.connect(corporate).fundProject(projectId, { value: totalAmount });

            const initialCorpBal = await ethers.provider.getBalance(corporate.address);
            const tx = await escrow.connect(corporate).cancelProject(projectId);
            await tx.wait();

            const finalCorpBal = await ethers.provider.getBalance(corporate.address);
            expect(finalCorpBal).to.be.greaterThan(initialCorpBal); // Refund received

            const proj = await escrow.getProject(projectId);
            expect(proj.status).to.equal(4); // Cancelled
        });
    });

    describe("7. Emergency Pause", function () {
        it("Admin can pause and prevent funds release", async function () {
            await escrow.connect(corporate).createProject(projectId, ngo.address, reviewer.address, totalAmount, milestoneAmounts);
            await escrow.connect(corporate).fundProject(projectId, { value: totalAmount });
            await escrow.connect(ngo).submitMilestone(projectId, 0, "hash123");
            await escrow.connect(reviewer).approveMilestone(projectId);

            await escrow.connect(admin).pauseProject(projectId);

            await expect(escrow.connect(ngo).withdrawMilestone(projectId)).to.be.revertedWith("Project not active");
        });
    });
});
