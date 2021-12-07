# Contracts
Smart contracts for [CHICHI Inu](https://chichi.network/)

You can interact with these smart contract on our dapp which can be found [here](https://chichi.network).

## What is CHICHI Inu?

CHICHI Inu is a decentralized meme token created to rule the Inu family.

With 1 trillion tokens, 50% locked as liquidity, 20% reserved for COVID relief funds, 2.5% donated to our community, on-chain governance, CHICHI is on the fast track to become the first dog to set foot on the moon.

### Ecosystem

#### Token

[Chichi Inu ($CHICHI)](https://bscscan.com/address/0x2aad7bc07eb37e90ae35d0cc24cfe67b468f1bfa) is a community-focused, decentralized meme token created on the Binance Smart Chain blockchain.
To ensure safety we had the $CHICHI token smart contract audited by [SOLIDProof](https://github.com/solidproof/smart-contract-audits/blob/main/SmartContract_Audit_Solidproof_Chichi.pdf).
The [$CHICHI](https://bscscan.com/address/0x2aad7bc07eb37e90ae35d0cc24cfe67b468f1bfa) smart contract contains no potentially dangerous code, such as mint functions, and the total supply is fixed at 1.000.000.000.000 $CHICHI.

Furthermore, the smart contract for the $CHICHI token is built using [OpenZeppelin Contracts](https://openzeppelin.com/contracts/) that have been audited by the community.

In contrast to projects that are heavily focused on farming and liquidity pool acquisition, we attempt to eliminate messy price fluctuations to the greatest extent possible.

#### CHICHI Inu NFT

Our community will benefit from a one-of-a-kind NFT project that will incorporate the world's first content authenticity technology, which was specifically designed for the NFT industry.
A total of 8888 NFTs will be included in the collection, which will be available on the Binance Smart Chain blockchain and will be traded on all of the popular NFT exchanges around the world.
Access to this collection will be granted to members of our community first, as part of the CHICHI Adoption program, which rewards members of our community with free $CHICHI tokens and NFTs in exchange for their participation.

More details about the NFT collection will be released soon after we have all the artworks and the smart contracts for it ready.

#### CHICHI Inu Adoption

For anyone who hesitated to purchase the other Inu-family tokens, we have a special gift for you.
We've developed a special program called the CHICHI Inu Adoption Center, which allows you to obtain a small number of $CHICHI tokens for free!!
We're offering our community 2.5 percent of our total supply for a limited time.
Collecting CHICHI tokens is completely free, and the total number of tokens you receive is proportional to the amount of BNB you currently hold.
A user's BNB balance determines how many tokens he or she will receive.

BONUS We will give an NFT to everyone who adopts our dogs when the collection is ready.

More on this will be released soon, but for now, know that this will be the first NFT collection to integrate the most promising NFT authenticity technology.

Please note that the program will be active a for approximately 1.5 months. The duration is measured in number of blocks and will end in 294.545 blocks from the time of launch (approximately 1.5 months at a rate of 1 block every 13.2 seconds), and any unclaimed CHICHIs will be transferred to the CHICHI Inu Treasury, which will be administered by the on-chain CHICHI Inu Governance program.

#### CHICHI Inu Charity

We want to help the world go back to its natural state, one in which everyone can go out safely and enjoy walks without fear of harming their health.

While it will be difficult to change this on our own, if we work together, we can.

Because of this, 20% of our total supply is reserved for COVID relief funds around the world. Our CHICHI COVID Relief Funds smart contract holds 20% of our entire supply, and tokens may be withdrawn only by authorized wallet addresses.

Anyone can contribute to the list of authorized wallet addresses using our on-chain CHICHI Governance program.

Please note that the program will be active a for approximately 3 years.

The duration is measured in number of blocks and will end in 7.167.273 blocks from the time of launch (approximately 3 years at a rate of 1 block every 13.2 seconds), and any unclaimed CHICHIs will be transferred to the CHICHI Inu Treasury, which will be administered by the CHICHI Inu Governance program.

#### CHICHI Inu Governance

Decentralized protocols are in constant evolution from the moment they are publicly released.
Often, the initial team retains control of this evolution in the first stages, but eventually delegates it to a community of stakeholders.
The process by which this community makes decisions is called on-chain governance, and it has become a central component of decentralized protocols, fueling varied decisions such as parameter tweaking, smart contract upgrades, integrations with other protocols, treasury management, grants, etc.

We believe that on-chain governance is a requirement for any decentralized meme token, and as such, we built governance support directly into the $CHICHI token.

##### What is on-chain voting?

On chain voting refers to governance systems where individual votes are submitted as transactions, and recorded directly on the blockchain.
Submitting on chain requires users to pay a transaction fee for each vote.

Smart contracts can be designed to execute proposals automatically based on the outcome of on chain votes, removing the need for a trusted third party or core team to enact vote results. Examples of on chain voting systems include MakerDAO, Aave, and protocols built on Compound's governance framework.

##### Benefits of on-chain voting

- More secure than off-chain voting
- No trusted third party required to count or enact votes
- Passed proposals can be executed automatically
- Works well for approving protocol changes or other high risk votes

##### How can you participate in the CHICHI Inu Governance program?

The easiest way would be through a decentralized application like Tally, but you can also interact with our smart contracts directly.
[Tally](https://www.withtally.com/) is a full-fledged application for user owned on-chain governance.
It comprises a voting dashboard, proposal creation wizard, real time research and analysis, and educational content.

## Deployed contracts

### 🚀 Mainnet

**CHICHI**

Address: [0x2aAD7BC07EB37e90AE35D0cc24cfE67B468f1BfA](https://bscscan.com/address/0x2aad7bc07eb37e90ae35d0cc24cfe67b468f1bfa)

### 🚧 Testnet

**CHICHI**

Address: [0x2aAD7BC07EB37e90AE35D0cc24cfE67B468f1BfA](https://testnet.bscscan.com/address/0x2aad7bc07eb37e90ae35d0cc24cfe67b468f1bfa)

## Deploying the contracts

```shell
npx truffle deploy --network NETWORK
```

## Verifying the contracts on BSC Scan

```shell
npx truffle run verify CONTRACT --network NETWORK
```
