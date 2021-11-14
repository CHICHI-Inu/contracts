const CHICHIHelp = artifacts.require("CHICHIHelp");

module.exports = function (deployer, network) {
  let tokenAddress = null
  let startingBlock = null
  const treasuryAddress = '0x8073d312C792d11767B51bfF7bBAdb2Ae2945952'
  const activePeriod = 7167273

  switch (network) {
    case "live":
      throw new Error("Not live yet")

    case "ropsten":
      tokenAddress = '0x4f4a97d44A1F1D247D067dbd2EaB55Cba9dC68a5'
      startingBlock = 11374500
      break

    case "rinkeby":
      tokenAddress = '0x3F681218C7C3c58cFe82d871B8D517B156cBddA6'
      startingBlock = 9599700
      break

    case "kovan":
      tokenAddress = '0x79FABa6bD0519795fB3844C2e5a38a5162681341'
      startingBlock = 28292850
      break

    case "goerli":
      tokenAddress = '0x79FABa6bD0519795fB3844C2e5a38a5162681341'
      startingBlock = 5849810
      break

    default:
      tokenAddress = '0xCfEB869F69431e42cdB54A4F4f105C19C080A601'
      startingBlock = 5
  }

  deployer.deploy(CHICHIHelp, tokenAddress, startingBlock, activePeriod, treasuryAddress);
};
