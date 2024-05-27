import { expect, assert } from "chai";
import {loadFixture} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import hre, { ethers } from 'hardhat';
import AliasModule from '../ignition/modules/AliasIgnition';
import { DeployedContract, NamedArtifactContractDeploymentFuture } from "@nomicfoundation/ignition-core";
import { Contract, Signer } from "ethers";
import { Alias } from "../typechain-types";


describe ("Alias", function () {

    const fooAlias = "foo";
    const addressZero = ethers.ZeroAddress;
    let alias:Alias;
    let owner:Signer;
    let caller:Signer;
    

    async function deployAliasFixture() {
        const deployment = await hre.ignition.deploy(AliasModule);
        return {alias: deployment.alias}
    }

    beforeEach(async function () {
        const deployment = await loadFixture(deployAliasFixture);
        alias = deployment.alias;
        const signers = await ethers.getSigners();
        owner = signers[0]
        caller = signers[1]
    });

    describe("addAlias tests function", () => {

        it("deploys the contract with an address different of address(0)", async () => {
            const currentAddress = await alias.getAddress();
            expect(currentAddress).to.be.not.equal(addressZero);
        });

        it("reverts with the custom error AliasDoesNotExist for a non existing alias", async () => {
            const emptySlot = alias.getAddressByAlias(fooAlias.toString());
            await expect(emptySlot).to.be.revertedWithCustomError(alias, "AliasDoesNotExist()");
        });

        it("reverts with the custom error AliasAlreadyExist(string alias) if we try to set again an alredy existing alias", async () => {
            await alias.connect(owner).addAlias(fooAlias.toString(), owner.address);
            await expect(alias.connect(owner).addAlias(fooAlias.toString(), owner.address))
                .to.be.revertedWithCustomError(alias, "AliasAlreadyExist").withArgs(fooAlias);
        });

        it("returns the caller address mapped to the alias foo", async () => {
            await alias.connect(owner).addAlias(fooAlias.toString(), caller.address);
            const expectedAddress = await alias.getAddressByAlias(fooAlias);
            expect(expectedAddress).to.be.equal(caller.address);
        });

        it("reverts if an address different from the owner call the function addAlias", async () => {
            await expect(alias.connect(caller).addAlias(fooAlias.toString(), owner.address)).to.be.
            revertedWithCustomError(alias, "OwnableUnauthorizedAccount").withArgs(caller);
        });
    });
    describe("removeAlias tests function", () => {
        
        it("reverts if alias does not exist", async () => {
            await expect(alias.connect(owner).removeAlias(fooAlias.toString()))
            .to.be.revertedWithCustomError(alias, "AliasDoesNotExist");
        });

        it("deletes the foo alias mapped to caller", async () => {
            await alias.connect(owner).addAlias(fooAlias.toString(), caller);
            const targetAddress = await alias.getAddressByAlias(fooAlias.toString());
            expect(targetAddress).to.be.equal(caller);
            await alias.connect(owner).removeAlias(fooAlias.toString());
            await expect(alias.connect(owner).removeAlias(fooAlias.toString()))
            .to.be.revertedWithCustomError(alias, "AliasDoesNotExist");
        });

        it("reverts if a different sender from the owner call the function", async () => {
            await expect(alias.connect(caller).removeAlias(fooAlias.toString()))
            .to.be.revertedWithCustomError(alias, "OwnableUnauthorizedAccount");
        });
        
    });
});