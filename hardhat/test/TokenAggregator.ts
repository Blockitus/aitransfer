import { expect, assert } from "chai";
import {loadFixture} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import hre, { ethers } from 'hardhat';
import AggregatorModule from '../ignition/modules/AggregatorIngnition';
import { DeployedContract, NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core";
import { AddressLike, Contract, Signer } from "ethers";
import { MockToken, TokenAggregator } from "../typechain-types";
import MockTokenModule from "../ignition/modules/MockTokenIgnition";
import { Address } from "cluster";


describe ("Aggegator", function () {

    const tokenSymbol = "USDT";
    const addressZero = ethers.ZeroAddress;
    let mockTokenAddress:AddressLike;
    let mockToken: MockToken;
    let aggregator:TokenAggregator;
    let owner:Signer;
    let caller:Signer;
    

    async function deployAggregatorFixture() {
        const deployment = await hre.ignition.deploy(AggregatorModule);
        return {aggregator: deployment.aggregator}
    }

    async function deployMockTokenFixture() {
        const deployment = await hre.ignition.deploy(MockTokenModule);
        return {mockToken: deployment.mockToken}
    }

    beforeEach(async function () {
        const _deploymentA = await loadFixture(deployAggregatorFixture);
        aggregator = _deploymentA.aggregator;

        const _deploymentM = await loadFixture(deployMockTokenFixture);
        mockToken = _deploymentM.mockToken;
        
        mockTokenAddress = await mockToken.getAddress();

        const signers = await ethers.getSigners();
        owner = signers[0]
        caller = signers[1]
    });

    describe("addAlias tests function", () => {

        it("deploys the contract with an address different of address(0)", async () => {
            const currentAddress = await aggregator.getAddress();
            expect(currentAddress).to.be.not.equal(addressZero);
        });

        it("deploys MockToken with an address different of address(0)", async () => {
            expect(mockTokenAddress).to.be.not.equal(addressZero);
        });

        it("reverts with the custom error SymbolDoesNotExist for a non existing symbol", async () => {
            const emptySlot = aggregator.getAddressByAlias(tokenSymbol);
            await expect(emptySlot).to.be.revertedWithCustomError(aggregator, "SymbolDoesNotExist()");
        });

        it("reverts with the custom error SymbolAlreadyExist(string symbol) if we try to set again an alredy existing symbol", async () => {
            await aggregator.connect(owner).addAlias(tokenSymbol, mockTokenAddress);
            await expect(aggregator.connect(owner).addAlias(tokenSymbol, mockTokenAddress))
                .to.be.revertedWithCustomError(aggregator, "SymbolAlreadyExist").withArgs(tokenSymbol);
        });

        it("returns the caller address mapped to the tokenSymbol USDT", async () => {
            await aggregator.connect(owner).addAlias(tokenSymbol, mockTokenAddress);
            const expectedAddress = await aggregator.getAddressByAlias(tokenSymbol);
            expect(expectedAddress).to.be.equal(mockTokenAddress);
        });

        it("reverts if an address different from the owner call the function addAlias", async () => {
            await expect(aggregator.connect(caller).addAlias(tokenSymbol, mockTokenAddress)).to.be.
            revertedWithCustomError(aggregator, "OwnableUnauthorizedAccount").withArgs(caller);
        });

        it("reverts if you try to save an EOA instead of a token address", async () => {
            await expect(aggregator.connect(owner).addAlias(tokenSymbol, caller))
            .to.be.revertedWithCustomError(aggregator, "ThisIsNotATokenAddress");
        });
    });
    describe("removeAlias tests function", () => {
        
        it("reverts if alias does not exist", async () => {
            await expect(aggregator.connect(owner).removeAlias(tokenSymbol))
            .to.be.revertedWithCustomError(aggregator, "SymbolDoesNotExist");
        });

        it("deletes the USDT symbol mapped to mockToken", async () => {
            await aggregator.connect(owner).addAlias(tokenSymbol, mockTokenAddress);
            const targetAddress = await aggregator.getAddressByAlias(tokenSymbol);
            expect(targetAddress).to.be.equal(mockTokenAddress);
            await aggregator.connect(owner).removeAlias(tokenSymbol);
            await expect(aggregator.connect(owner).removeAlias(tokenSymbol))
            .to.be.revertedWithCustomError(aggregator, "SymbolDoesNotExist");
        });

        it("reverts if a different sender from the owner call the function", async () => {
            await expect(aggregator.connect(caller).removeAlias(tokenSymbol))
            .to.be.revertedWithCustomError(aggregator, "OwnableUnauthorizedAccount");
        });
        
    });
});