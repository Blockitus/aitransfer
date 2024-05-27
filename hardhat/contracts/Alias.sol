// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import {IAlias} from "./IAlias.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Alias is IAlias, Ownable {

    mapping (string => address) private _aliasses;
    mapping (address => string) private _addresses;
     
    error AliasAlreadyExist(string _alias);
    error AliasDoesNotExist();

    constructor() Ownable(msg.sender){}

    function addAlias(string memory _alias, address _user) external onlyOwner override {
        _checkIfAliasAlreadyExist(_alias);
        _aliasses[_alias] = _user;
        _addresses[_user] = _alias;
    }

    function _checkIfAliasAlreadyExist(string memory _alias) private view {
        address currentUser = _aliasses[_alias];
        if (currentUser != address(0)) revert AliasAlreadyExist(_alias);
    }

    function removeAlias(string memory _alias) external onlyOwner override {
        address aliasAddress = _checkZeroAddressLocation(_alias);
        delete _aliasses[_alias];
        delete _addresses[aliasAddress];
    }

    function getAddressByAlias(string memory _alias) external view override returns (address) {
        address aliasAddress = _checkZeroAddressLocation(_alias);
        return aliasAddress;
    }

    function _checkZeroAddressLocation(string memory _alias) private view returns (address) {
        address aliasAddress = _aliasses[_alias];
        if(aliasAddress == address(0)) revert AliasDoesNotExist();
        return aliasAddress;
    }

    function getAliasByAddress(address _user) external view returns (string memory) {
        string memory currentAlias = _addresses[_user];
        return currentAlias;
    } 

}