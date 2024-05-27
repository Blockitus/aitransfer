// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import {IAlias} from "./IAlias.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IsERC20} from "./IsERC20.sol";

contract TokenAggregator is IAlias, Ownable, IsERC20 {

    mapping (string => address) private _supportedTokens;
    mapping (address => string) private _tokenSymbols;
    
    error SymbolAlreadyExist(string _symbol);
    error SymbolDoesNotExist();
    error ThisIsNotATokenAddress();

    constructor() Ownable(msg.sender){}


    function addAlias(string memory _symbol, address _tokenAddress) external onlyOwner override {
        _checkIfAliasAlreadyExist(_symbol);
        if(! isERC20(_tokenAddress)) revert ThisIsNotATokenAddress();
        _supportedTokens[_symbol] = _tokenAddress;
        _tokenSymbols[_tokenAddress] = _symbol;
    }

    function _checkIfAliasAlreadyExist(string memory _symbol) private view {
        address currentUser = _supportedTokens[_symbol];
        if (currentUser != address(0)) revert SymbolAlreadyExist(_symbol);
    }

    function removeAlias(string memory _symbol) external onlyOwner override {
        address tokenSymbol = _checkZeroAddressLocation(_symbol);
        delete _supportedTokens[_symbol];
        delete _tokenSymbols[tokenSymbol];
    }

    function getAddressByAlias(string memory _symbol) external view override returns (address) {
        address aliasAddress = _checkZeroAddressLocation(_symbol);
        return aliasAddress;
    }

    function _checkZeroAddressLocation(string memory _symbol) private view returns (address) {
        address tokenAddress = _supportedTokens[_symbol];
        if(tokenAddress == address(0)) revert SymbolDoesNotExist();
        return tokenAddress;
    }

    function getAliasByAddress(address _tokenAddress) external view returns (string memory) {
        string memory tokenSymbol = _tokenSymbols[_tokenAddress];
        return tokenSymbol;
    } 

}