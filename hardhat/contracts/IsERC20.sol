// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract IsERC20 {


    function isERC20(address token) public returns (bool) {
        return isSCA(token) && hasDecimals(token) && totalSupplyGreatherThan0(token);
    }

    function isSCA(address account) private view returns (bool) {
        bytes memory _code = account.code;
        return _code.length > 0;
    }

    function totalSupplyGreatherThan0(address token) private returns(bool) {
        (bool success, bytes memory result) = token.call(abi.encodeWithSelector(totalSupplySelector()));
        require(success);
        uint256 totalSupply = abi.decode(result, (uint256));
        return totalSupply > 0;

    }

    function hasDecimals(address token) private returns(bool) {
        (bool success, ) = token.call(abi.encodeWithSelector(decimalsSelector()));
        return success;
    }

    function decimalsSelector() private pure returns(bytes4) {
        bytes4 decimals_selector = bytes4((keccak256(abi.encodePacked("decimals()"))));
        return decimals_selector;
    }

    function totalSupplySelector() private pure returns(bytes4) {
        bytes4 totalSupply_selector = bytes4((keccak256(abi.encodePacked("totalSupply()"))));
        return totalSupply_selector;
    }
}