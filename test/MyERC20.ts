import { ethers } from "hardhat";
import { expect } from "chai";
import { MyToken, MyToken__factory } from "../typechain-types";

describe("MyToken", function () {
	let myToken: MyToken;
	let owner: any;
	let recipient: any;
	let anotherAccount: any;
  

  beforeEach(async function () {
    const [owner] = await ethers.getSigners();
    const myTokenFactory = (await ethers.getContractFactory(
      "MyToken",
      owner
    )) as MyToken__factory;
    myToken = await myTokenFactory.deploy();
    await myToken.deployed();
  });

  it("should have the correct name and symbol", async function () {
    expect(await myToken.name()).to.equal("My Token");
    expect(await myToken.symbol()).to.equal("MTK");
  });

  it("should mint tokens", async function () {
    const [owner, recipient] = await ethers.getSigners();
    const amount = ethers.utils.parseEther("100");

    await myToken.connect(owner).mint(recipient.address, amount);

    expect(await myToken.balanceOf(recipient.address)).to.equal(amount);
  });

  it("should emit a Transfer event on mint", async function () {
    const [owner, recipient] = await ethers.getSigners();
    const amount = ethers.utils.parseEther("100");

    const tx = await myToken.connect(owner).mint(recipient.address, amount);
    const receipt = await tx.wait();

    const event = receipt.events?.find((e) => e.event === "Transfer");
    expect(event?.args?.from).to.equal("0x0000000000000000000000000000000000000000");
    expect(event?.args?.to).to.equal(recipient.address);
    expect(event?.args?.value).to.equal(amount);
  });

  it("should burn tokens", async function () {
    const [owner] = await ethers.getSigners();
    const amount = ethers.utils.parseEther("100");

    await myToken.connect(owner).mint(owner.address, amount);
    await myToken.connect(owner).burn(amount);

    expect(await myToken.balanceOf(owner.address)).to.equal(ethers.constants.Zero);
  });

  it("should emit a Transfer event on burn", async function () {
    const [owner] = await ethers.getSigners();
    const amount = ethers.utils.parseEther("100");

    await myToken.connect(owner).mint(owner.address, amount);
    const tx = await myToken.connect(owner).burn(amount);
    const receipt = await tx.wait();

    const event = receipt.events?.find((e) => e.event === "Transfer");
    expect(event?.args?.from).to.equal(owner.address);
    expect(event?.args?.to).to.equal("0x0000000000000000000000000000000000000000");
    expect(event?.args?.value).to.equal(amount);
  });

  it("should send tokens", async function () {
    const [owner, recipient] = await ethers.getSigners();
    const amount = ethers.utils.parseEther("100");

    await myToken.connect(owner).mint(owner.address, amount);
    await myToken.connect(owner).send(recipient.address, amount);

    expect(await myToken.balanceOf(recipient.address)).to.equal(amount);
  });

  it("should not allow sending more tokens than the sender has", async function () {
    const amount = ethers.utils.parseEther("100");
	const [owner, recipient] = await ethers.getSigners();
    await myToken.connect(owner).mint(owner.address, amount);
    await expect(myToken.connect(owner).send(recipient.address, amount.add(1))).to.be.revertedWith(
      "ERC20: transfer amount exceeds balance"
    );
  });

  it("should not allow sending tokens to the zero address", async function () {
    const amount = ethers.utils.parseEther("100");
	const [owner] = await ethers.getSigners();
    await myToken.connect(owner).mint(owner.address, amount);
    await expect(myToken.connect(owner).send(ethers.constants.AddressZero, amount)).to.be.revertedWith(
      "ERC20: transfer to the zero address"
    );
  });

  it("should return correct allowance", async function () {
    const amount = ethers.utils.parseEther("100");
	const [owner, recipient] = await ethers.getSigners();
    await myToken.connect(owner).mint(owner.address, amount);
    await myToken.connect(owner).approve(recipient.address, amount);
    expect(await myToken.allowance(owner.address, recipient.address)).to.equal(amount);
  });

  it("should return the allowance amount", async function () {
    const amount = ethers.utils.parseEther("100");
	const [owner, anotherAccount] = await ethers.getSigners();

    await myToken.mint(owner.address, amount);
    await myToken.approve(anotherAccount.address, amount);

    expect(await myToken.allowance(owner.address, anotherAccount.address)).to.equal(amount);
  });

  it("should return the balance of the account", async function () {
    const amount = ethers.utils.parseEther("100");
	const [owner] = await ethers.getSigners();

    await myToken.mint(owner.address, amount);

    expect(await myToken.balanceOf(owner.address)).to.equal(amount);
  });
});