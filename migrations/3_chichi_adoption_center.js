const CHICHIAdoptionCenter = artifacts.require("CHICHIAdoptionCenter");

module.exports = function (deployer, network) {
  let tokenAddress = null
  let startingBlock = null
  const treasuryAddress = '0x8073d312C792d11767B51bfF7bBAdb2Ae2945952'
  const activePeriod = 294545

  switch (network) {
    case "ropsten":
      tokenAddress = '0x4f4a97d44A1F1D247D067dbd2EaB55Cba9dC68a5'
      startingBlock = 11374500
      break

    default:
      tokenAddress = '0xCfEB869F69431e42cdB54A4F4f105C19C080A601'
      startingBlock = 5
  }

  deployer.deploy(CHICHIAdoptionCenter, tokenAddress, startingBlock, activePeriod, treasuryAddress);
};
