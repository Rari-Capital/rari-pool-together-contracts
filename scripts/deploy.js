async function deploy() {
    const [deployer] = await ethers.getSigners();
    const ReptPoolSource = await ethers.getContractFactory("ReptPoolSource");

    console.log(ReptPoolSource);
    console.log(
        "deploying contracts with",
        deployer.address
    );
    
    const yieldSource = await ReptPoolSource.deploy();
    console.log(yieldSource.address);
}

deploy()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
