// Load dependencies
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)
const { expect, assert } = chai

// Load compiled artifacts
const CHICHI = artifacts.require("CHICHI");

// Start the tests
contract("CHICHI", function (accounts) {
  it("should deploy", async function () {
    await CHICHI.deployed()
    return assert.isTrue(true)
  })

  it("should not mint", async function () {
    const token = await CHICHI.deployed()
    expect(token.mint === undefined && token._mint === undefined).to.be.true
  })

  it("should estimate gas cost", async function () {
    const cost = await CHICHI.new.estimateGas()
    console.log("Gas cost to deploy: ", cost)
    assert(true)
  })
});
