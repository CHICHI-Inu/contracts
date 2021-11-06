// Load dependencies
import { advanceBlockTo, latestBlock } from '@openzeppelin/test-helpers/src/time';
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)
const { expect } = chai

// Import utilities from Test Helpers
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

// Load compiled artifacts
const CHICHI = artifacts.require("CHICHI");
const CHICHIAdoptionCenter = artifacts.require("CHICHIAdoptionCenter");

// Misc
const DUMMY_ADDRESS_1 = '0x0000000000000000000000000000000000000001';
const DUMMY_ADDRESS_2 = '0x0000000000000000000000000000000000000002';
const DUMMY_ADDRESS_3 = '0x0000000000000000000000000000000000000003';
const DUMMY_ADDRESS_4 = '0x0000000000000000000000000000000000000004';

const treasuryFinalBalance = new BN(1);

// Start the tests
contract("CHICHIAdoptionCenter", function (accounts) {
  before(async function () {
    this.token = await CHICHI.deployed()
    this.tokenDecimals = await this.token.decimals()
    this.treasury = accounts[9]

    this.pack1 = new BN(1500000).mul(new BN(10).pow(new BN(this.tokenDecimals)))
    this.pack2 = new BN(15000000).mul(new BN(10).pow(new BN(this.tokenDecimals)))
    this.pack3 = new BN(75000000).mul(new BN(10).pow(new BN(this.tokenDecimals)))
    
    const blockNumber = await latestBlock()
    const startingAt = blockNumber
    const activePeriod = 25
    this.mainAdoptionCenter = await CHICHIAdoptionCenter.new(this.token.address, startingAt, activePeriod, this.treasury);
  });

  it("should not start yet", async function () {
    const blockNumber = await latestBlock()
    const startingAt = blockNumber + 1
    const adoptionCenter = await CHICHIAdoptionCenter.new(this.token.address, startingAt, 1, this.treasury);
    expect(await adoptionCenter.startingBlock()).to.bignumber.equal(startingAt)
    expect(await adoptionCenter.hasStarted()).to.equal(false)
  })

  it("should start", async function () {
    expect(await this.mainAdoptionCenter.hasStarted()).to.equal(true)
  })

  it("should not be finished", async function () {
    const blockNumber = await latestBlock()
    const startingAt = blockNumber
    const activePeriod = new BN(1)
    const endingBlock = new BN(startingAt.toNumber() + activePeriod.toNumber())
    const adoptionCenter = await CHICHIAdoptionCenter.new(this.token.address, startingAt, activePeriod, this.treasury);
    expect(await adoptionCenter.hasStarted()).to.equal(true)
    expect(await adoptionCenter.activeForNumberOfBlocks()).to.bignumber.equal(activePeriod, "Active duration is not correct")
    expect(await adoptionCenter.endingBlock()).to.bignumber.equal(endingBlock, "Ending block is not correct")
    expect(await adoptionCenter.hasEnded()).to.equal(false)
  })

  it("should have a 0 balance", async function () {
    expect(await this.mainAdoptionCenter.balance()).to.bignumber.equal(new BN(0))
  })

  it("should have a bigger balance", async function () {
    const amount = this.pack1.add(this.pack2).add(treasuryFinalBalance)
    await this.token.transfer(this.mainAdoptionCenter.address, amount)
    expect(await this.mainAdoptionCenter.balance()).to.bignumber.equal(amount)
  })

  it("should have 0 adoptions", async function () {
    expect(await this.mainAdoptionCenter.numberOfAdoptions()).to.bignumber.equal(new BN(0))
  })

  it("should not be possible to adopt", async function () {
    const address = DUMMY_ADDRESS_1
    expect(await web3.eth.getBalance(address)).to.bignumber.equal(new BN(0), "ETH balance should be 0")
    expect(await this.mainAdoptionCenter.numberOfChichisToAdopt(address)).to.bignumber.equal(new BN(0))
  })

  it("should be possible to adopt", async function () {
    const address = accounts[0]
    expect(await web3.eth.getBalance(address)).to.bignumber.greaterThan(new BN(0), "ETH balance should be greater than 0")
    expect(await this.mainAdoptionCenter.numberOfChichisToAdopt(address)).to.bignumber.greaterThan(new BN(0))
  })

  it("should be possible to adopt the first package", async function () {
    const owner = accounts[0]
    const address = DUMMY_ADDRESS_2
    
    // the first package requires a balance of >= 0.1 ETH
    web3.eth.sendTransaction({to: address, from: owner, value: web3.utils.toWei("0.01", "ether")})
    expect(await this.mainAdoptionCenter.numberOfChichisToAdopt(address)).to.bignumber.equal(new BN(0))

    // make the user have a balance of 0.1 ETH
    web3.eth.sendTransaction({to: address, from: owner, value: web3.utils.toWei("0.09", "ether")})
    expect(await this.mainAdoptionCenter.numberOfChichisToAdopt(address)).to.bignumber.equal(this.pack1)

    // make sure that if the user has more than 0.1 ETH he can still receive the first package
    web3.eth.sendTransaction({to: address, from: owner, value: web3.utils.toWei("0.01", "ether")})
    expect(await this.mainAdoptionCenter.numberOfChichisToAdopt(address)).to.bignumber.equal(this.pack1)
  })

  it("should be possible to adopt the second package", async function () {
    const owner = accounts[0]
    const address = DUMMY_ADDRESS_3

    // the second package requires a balance of >= 1 ETH
    web3.eth.sendTransaction({to: address, from: owner, value: web3.utils.toWei("0.9", "ether")})
    expect(await this.mainAdoptionCenter.numberOfChichisToAdopt(address)).to.bignumber.equal(this.pack1)

    // make the user have a balance of 1 ETH
    web3.eth.sendTransaction({to: address, from: owner, value: web3.utils.toWei("0.1", "ether")})
    expect(await this.mainAdoptionCenter.numberOfChichisToAdopt(address)).to.bignumber.equal(this.pack2)

    // make sure that if the user has more than 1 ETH he can still receive the second package
    web3.eth.sendTransaction({to: address, from: owner, value: web3.utils.toWei("0.1", "ether")})
    expect(await this.mainAdoptionCenter.numberOfChichisToAdopt(address)).to.bignumber.equal(this.pack2)
  })

  it("should be possible to adopt the third package", async function () {
    const address = DUMMY_ADDRESS_4

    // the second package requires a balance of 150 ETH
    web3.eth.sendTransaction({to: address, from: accounts[1], value: web3.utils.toWei("99.5", "ether")})
    web3.eth.sendTransaction({to: address, from: accounts[2], value: web3.utils.toWei("49.5", "ether")})
    expect(await this.mainAdoptionCenter.numberOfChichisToAdopt(address)).to.bignumber.equal(this.pack2)

    // make the user have a balance of 150 ETH
    web3.eth.sendTransaction({to: address, from: accounts[2], value: web3.utils.toWei("1", "ether")})
    expect(await this.mainAdoptionCenter.numberOfChichisToAdopt(address)).to.bignumber.equal(this.pack3)

    // make sure that if the user has more than 150 ETH he can still receive the third package
    web3.eth.sendTransaction({to: address, from: accounts[2], value: web3.utils.toWei("1", "ether")})
    expect(await this.mainAdoptionCenter.numberOfChichisToAdopt(address)).to.bignumber.equal(this.pack3)
  })

  it("should have no adoptions yet", async function () {
    const address = accounts[0]
    expect(await this.mainAdoptionCenter.hasAdopted(address)).to.equal(false)
    expect(await this.mainAdoptionCenter.adoption(address)).to.bignumber.equal(new BN(0))
  })

  it("should adopt", async function () {
    const address = accounts[0]
    const receipt = await this.mainAdoptionCenter.adopt({ from: address, gas: 1000000 })
    
    expectEvent(receipt, 'Adopted', { adopter: address, numberOfChichis: this.pack2 }); // This user has a balance of around 100 ETH at this point whichi qualifies him for the second package
  })

  it("should not adopt again", async function () {
    const address = accounts[0]
    await expectRevert(this.mainAdoptionCenter.adopt({ from: address, gas: 1000000 }), 'Already adopted -- Reason given: Already adopted.')
  })

  it("should not have enough balance to adopt another second package", async function () {
    const address = accounts[2]
    await expectRevert(this.mainAdoptionCenter.adopt({ from: address, gas: 1000000 }), 'The current balance of CHICHIs is insufficient -- Reason given: The current balance of CHICHIs is insufficient.')
  })

  it("should adopt again", async function () {
    const address = accounts[1]
    const receipt = await this.mainAdoptionCenter.adopt({ from: address, gas: 1000000 })
    
    expectEvent(receipt, 'Adopted', { adopter: address, numberOfChichis: this.pack1 });
  })

  it("should not be able to transfer remaining balance to treasury", async function () {
    await expectRevert(this.mainAdoptionCenter.transferRemainingBalanceToTreasury(), 'The program has not ended yet -- Reason given: The program has not ended yet.')
  })

  it("should end", async function () {
    const endingBlock = await this.mainAdoptionCenter.endingBlock()
    const endedBlock = endingBlock.add(new BN(1))
    await advanceBlockTo(endedBlock)
    expect(await this.mainAdoptionCenter.hasEnded()).to.equal(true)
  })

  it("should not be able to transfer remaining balance to treasury by non-owner", async function () {
    await expectRevert(this.mainAdoptionCenter.transferRemainingBalanceToTreasury({ from: accounts[1] }), 'Ownable: caller is not the owner -- Reason given: Ownable: caller is not the owner.')
  })

  it("should be able to transfer remaining balance to treasury", async function () {
    const receipt = await this.mainAdoptionCenter.transferRemainingBalanceToTreasury()
    expectEvent(receipt, 'TransferredToTreasury', { numberOfChichis: treasuryFinalBalance });
  })
});
