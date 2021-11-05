const CHICHI = artifacts.require("./CHICHI.sol");

module.exports = async function(deployer, network, accounts) {
    const owner = accounts[0]
    
    await deployer.deploy(CHICHI, { from: owner })
    await CHICHI.deployed()
};