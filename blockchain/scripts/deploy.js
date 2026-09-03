const { ethers } = require("hardhat");

async function main() {
    const [corporate, ngo, admin] = await ethers.getSigners();

    console.log("Deploying FINX Escrow from Corporate:", corporate.address);

    const FINXEscrow = await ethers.getContractFactory("FINXEscrow");
    // Sending 50 ETH (mock funding) to escrow on deploy
    const escrow = await FINXEscrow.deploy(ngo.address, admin.address, { value: ethers.parseEther("50") });

    await escrow.waitForDeployment();

    console.log(`FINXEscrow deployed to ${await escrow.getAddress()}`);
    console.log(`Corporate: ${corporate.address}`);
    console.log(`NGO: ${ngo.address}`);
    console.log(`Admin: ${admin.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
