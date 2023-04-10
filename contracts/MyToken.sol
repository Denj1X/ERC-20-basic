// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
///using super instead of interface

contract MyToken is ERC20, AccessControl {
    bytes32 public constant MINT_ROLE = keccak256("MINT_ROLE");
    bytes32 public constant BURN_ROLE = keccak256("BURN_ROLE");
    bytes32 public constant SEND_ROLE = keccak256("SEND_ROLE");

    constructor() ERC20("My Token", "MTK") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINT_ROLE, msg.sender);
        _setupRole(BURN_ROLE, msg.sender);
        _setupRole(SEND_ROLE, msg.sender);
    }

    function mint(address to, uint256 amount) public {
        require(hasRole(MINT_ROLE, msg.sender), "MyToken: must have MINT_ROLE to mint");
        _mint(to, amount);
        emit Mint(to, amount);
    }

    function burn(uint256 amount) public {
        require(hasRole(BURN_ROLE, msg.sender), "MyToken: must have BURN_ROLE to burn");
        _burn(msg.sender, amount);
        emit Burn(msg.sender, amount);
    }

    function send(address to, uint256 amount) public {
        require(hasRole(SEND_ROLE, msg.sender), "MyToken: must have SEND_ROLE to send");
        _transfer(msg.sender, to, amount);
        emit Sent(msg.sender, to, amount);
    }

    function balanceOf(address account) public view override returns (uint256) {
        return super.balanceOf(account);
    }

    function allowance(address owner, address spender) public view override returns (uint256) {
        return super.allowance(owner, spender);
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual override(ERC20) {
        super._beforeTokenTransfer(from, to, amount);
    }

    event Mint(address indexed to, uint256 amount);
    event Burn(address indexed from, uint256 amount);
    event Sent(address indexed from, address indexed to, uint256 amount);
}