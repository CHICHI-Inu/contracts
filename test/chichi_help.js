// Load dependencies
import { ZERO_ADDRESS } from '@openzeppelin/test-helpers/src/constants';
import { advanceBlockTo, latestBlock } from '@openzeppelin/test-helpers/src/time';
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)
const { expect } = chai

// Import utilities from Test Helpers
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

// Load compiled artifacts
const CHICHI = artifacts.require("CHICHI");
const CHICHIHelp = artifacts.require("CHICHIHelp");

// Misc
const treasuryInitialBalance = new BN(1000000);

// Start the tests
contract("CHICHIHelp", function (accounts) {
  before(async function () {
    this.token = await CHICHI.deployed()
    this.tokenDecimals = await this.token.decimals()
    this.treasury = accounts[9]
    this.account1Allowance = new BN(0)

    const blockNumber = await latestBlock()
    const startingAt = blockNumber
    const activePeriod = 25
    this.mainHelp = await CHICHIHelp.new(this.token.address, startingAt, activePeriod, this.treasury);
  });

  it("should not start yet", async function () {
    const blockNumber = await latestBlock()
    const startingAt = blockNumber + 1
    const help = await CHICHIHelp.new(this.token.address, startingAt, 1, this.treasury);
    expect(await help.startingBlock()).to.bignumber.equal(startingAt)
    expect(await help.hasStarted()).to.equal(false)
  })

  it("should start", async function () {
    expect(await this.mainHelp.hasStarted()).to.equal(true)
  })

  it("should not be finished", async function () {
    expect(await this.mainHelp.hasEnded()).to.equal(false)
  })

  it("should have a 0 balance", async function () {
    expect(await this.mainHelp.balance()).to.bignumber.equal(new BN(0))
  })

  it("should have a bigger balance", async function () {
    const amount = treasuryInitialBalance.mul(new BN(10).pow(this.tokenDecimals))
    await this.token.transfer(this.mainHelp.address, amount)
    expect(await this.mainHelp.balance()).to.bignumber.equal(amount)
  })

  it("should have 0 claims", async function () {
    expect(await this.mainHelp.numberOfClaims()).to.bignumber.equal(new BN(0))
  })

  it("should not be possible to claim", async function () {
    const address = accounts[1]
    expect(await this.mainHelp.numberOfChichisToClaim(address)).to.bignumber.equal(new BN(0))
  })

  it("should be possible to add claimer", async function () {
    const address = accounts[1]
    const name = "TEST"
    const allowance = new BN(1)
    this.account1Allowance = allowance

    let receipt = await this.mainHelp.addClaimer(address, name, allowance)

    expectEvent(receipt, 'AddedClaimer', {
      wallet: address,
      name: name,
      numberOfChichis: allowance
    })
  })

  it("should not be possible to add the same claimer again", async function () {
    const address = accounts[1]
    await expectRevert(this.mainHelp.addClaimer(address, "TEST", 1), 'Already added -- Reason given: Already added.')
  })

  it("should not be possible to add claimer by non-owner", async function () {
    const address = ZERO_ADDRESS
    await expectRevert(this.mainHelp.addClaimer(address, "TEST", 1, { from: accounts[1] }), 'Ownable: caller is not the owner -- Reason given: Ownable: caller is not the owner.')
  })

  it("should be possible to increase allowance", async function () {
    const address = accounts[1]
    const allowance = new BN(1)
    this.account1Allowance = this.account1Allowance.add(allowance)

    let receipt = await this.mainHelp.increaseAllowance(address, allowance)

    expectEvent(receipt, 'IncreasedAllowance', {
      to: address,
      numberOfChichis: allowance
    })
  })

  it("should not be possible to increase allowance by non-owner", async function () {
    const address = accounts[1]
    const allowance = new BN(1)
    await expectRevert(this.mainHelp.increaseAllowance(address, allowance, { from: accounts[1] }), 'Ownable: caller is not the owner -- Reason given: Ownable: caller is not the owner.')
  })

  it("should have the right allowance", async function () {
    const address = accounts[1]
    expect(await this.mainHelp.numberOfChichisToClaim(address)).to.bignumber.equal(this.account1Allowance)
    expect(await this.mainHelp.numberOfChichisToClaim(accounts[0])).to.bignumber.equal(new BN(0), "This user should not have an allowance")
  })

  it("should not claim", async function () {
    await expectRevert(this.mainHelp.claim({ from: accounts[0] }), 'You have no allowance -- Reason given: You have no allowance.')
  })

  it("should claim", async function () {
    const address = accounts[1]
    let receipt = await this.mainHelp.claim({ from: address })

    expectEvent(receipt, 'Claimed', {
      by: address,
      numberOfChichis: this.account1Allowance
    })
  })

  it("should not claim again because of non-existing allowance", async function () {
    const address = accounts[1]
    await expectRevert(this.mainHelp.claim({ from: address }), 'You have no allowance -- Reason given: You have no allowance.')
  })

  it("should not be able to transfer remaining balance to treasury", async function () {
    await expectRevert(this.mainHelp.transferRemainingBalanceToTreasury(), 'The program has not ended yet -- Reason given: The program has not ended yet.')
  })

  it("should end", async function () {
    const endingBlock = await this.mainHelp.endingBlock()
    const endedBlock = endingBlock.add(new BN(1))
    await advanceBlockTo(endedBlock)
    expect(await this.mainHelp.hasEnded()).to.equal(true)
  })

  it("should not be able to transfer remaining balance to treasury by non-owner", async function () {
    await expectRevert(this.mainHelp.transferRemainingBalanceToTreasury({ from: accounts[1] }), 'Ownable: caller is not the owner -- Reason given: Ownable: caller is not the owner.')
  })

  it("should be able to transfer remaining balance to treasury", async function () {
    const receipt = await this.mainHelp.transferRemainingBalanceToTreasury()
    const treasuryFinalBalance = treasuryInitialBalance.mul(new BN(10).pow(this.tokenDecimals)).sub(this.account1Allowance)
    expectEvent(receipt, 'TransferredToTreasury', { numberOfChichis: treasuryFinalBalance });
  })
});
