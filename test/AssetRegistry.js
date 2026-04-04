const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AssetRegistry", function () {

  let contract;
  let owner, user1, user2;

  // Runs before every test
  beforeEach(async function () {

    // Get test accounts
    [owner, user1, user2] = await ethers.getSigners();

    // Load contract
    const Contract = await ethers.getContractFactory("AssetRegistry");

    // Deploy contract
    contract = await Contract.deploy();

    // Wait until deployed (ethers v5 style)
    await contract.deployed();
  });

  // -----------------------------
  // TEST 1: Upload Asset
  // -----------------------------
  it("should upload asset correctly", async function () {

    await contract.connect(user1).uploadAsset(
      "cid1",
      "Asset1",
      ethers.utils.parseEther("1")
    );

    const asset = await contract.getAsset(1);

    expect(asset[0]).to.equal("cid1"); // cid
    expect(asset[1]).to.equal(user1.address); // owner
    expect(asset[2]).to.equal(user1.address); // creator
  });

  // -----------------------------
  // TEST 2: Ownership Transfer
  // -----------------------------
  it("should transfer ownership when bought", async function () {

    await contract.connect(user1).uploadAsset(
      "cid1",
      "Asset1",
      ethers.utils.parseEther("1")
    );

    await contract.connect(user2).buyAsset(1, {
      value: ethers.utils.parseEther("1")
    });

    const asset = await contract.getAsset(1);

    expect(asset[1]).to.equal(user2.address);
  });

  // -----------------------------
  // TEST 3: Price Increase (50%)
  // -----------------------------
  it("should increase price by 50%", async function () {

    await contract.connect(user1).uploadAsset(
      "cid1",
      "Asset1",
      ethers.utils.parseEther("1")
    );

    await contract.connect(user2).buyAsset(1, {
      value: ethers.utils.parseEther("1")
    });

    const asset = await contract.getAsset(1);

    expect(asset[3]).to.equal(ethers.utils.parseEther("1.5"));
  });

  // -----------------------------
  // TEST 4: Fail on Low ETH
  // -----------------------------
  it("should fail if not enough ETH is sent", async function () {

    await contract.connect(user1).uploadAsset(
      "cid1",
      "Asset1",
      ethers.utils.parseEther("1")
    );

    await expect(
      contract.connect(user2).buyAsset(1, {
        value: ethers.utils.parseEther("0.1")
      })
    ).to.be.revertedWith("Not enough ETH");
  });

  // -----------------------------
  // TEST 5: Refund Extra ETH
  // -----------------------------
  it("should refund extra ETH correctly", async function () {

    await contract.connect(user1).uploadAsset(
      "cid1",
      "Asset1",
      ethers.utils.parseEther("1")
    );

    const beforeBalance = await ethers.provider.getBalance(user2.address);

    const tx = await contract.connect(user2).buyAsset(1, {
      value: ethers.utils.parseEther("2") // sending extra ETH
    });

    const receipt = await tx.wait();

    const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice);

    const afterBalance = await ethers.provider.getBalance(user2.address);

    // User should only lose 1 ETH + gas
    expect(beforeBalance.sub(afterBalance)).to.be.closeTo(
      ethers.utils.parseEther("1").add(gasUsed),
      ethers.utils.parseEther("0.01") // small margin
    );
  });

});