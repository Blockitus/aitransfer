// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

interface IAlias {
    function addAlias(string memory _alias, address _user) external;
    function removeAlias(string memory _alias) external;
    function getAddressByAlias(string memory _alias) external view returns (address);
    function getAliasByAddress(address _user) external returns (string memory); 
}
