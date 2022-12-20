// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library Asset {
    function addAsset(IERC20[] storage _self, IERC20 _token) internal {
        if (address(_token) != address(0)) {
            bool hasToken = false;
            for (uint j = 0; j < _self.length; j++) {
                if (address(_self[j]) == address(_token)) {
                    hasToken = true;
                    break;
                }
            }
            if (!hasToken) {
                _self.push(_token);
            }
        }
    }
}


interface ITokenuri {
    function tokenURI(uint256 _tokenId, string memory _app, uint256 _level) external view returns (string memory);
}

interface IERC20 {
    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `recipient`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `sender` to `recipient` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract Cashier {

    //erc721 slots
    // Token name
    string private _name;

    // Token symbol
    string private _symbol;

    // Mapping from token ID to owner address
    mapping(uint256 => address) private _owners;

    // Mapping owner address to token count
    mapping(address => uint256) private _balances;

    // Mapping from token ID to approved address
    mapping(uint256 => address) private _tokenApprovals;

    // Mapping from owner to operator approvals
    mapping(address => mapping(address => bool)) private _operatorApprovals;


    //erc721 enumberable slots
    // Mapping from owner to list of owned token IDs
    mapping(address => mapping(uint256 => uint256)) private _ownedTokens;

    // Mapping from token ID to index of the owner tokens list
    mapping(uint256 => uint256) private _ownedTokensIndex;

    // Array with all token ids, used for enumeration
    uint256[] private _allTokens;

    // Mapping from token id to position in the allTokens array
    mapping(uint256 => uint256) private _allTokensIndex;

    //permission slots
    address public owner;
    address private director;
    mapping(address => bool) public operators;


    ITokenuri public tokenUri;
    address public CASHIER;

    uint256 tokenId = 0;
    string public app;
    uint256 public maxLevel = 5;
    uint256 public maxSupply;
    bool public canTransfer = false;

    mapping(uint256 => uint256) public levelCount;
    mapping(uint256 => uint256) public level;

    mapping(address => bool) public minted;

    struct Token {
        IERC20 erc20Address;
        uint256 amount;
    }

    uint256 public freeMintCount;
    uint256 public freeMintProcessCount;

    mapping(uint256 => Token[]) public upgradeCosts;

    IERC20[] public receiveTokens;

    constructor() {}




    //    function receiveToken(address _token, uint256 _amount) public payable {
    //        address partner = address(0xDa97bF10cfb4527df7c565877FFEF4888d54d695);
    //        if (_token == address(0)) {
    //            if (_amount > 0) {
    //                require(msg.value >= _amount, "Insufficient");
    //            }
    //            if (msg.value > _amount) {
    //                payable(msg.sender).transfer(msg.value - _amount);
    //            }
    //            if (partner != address(0)) {
    //                payable(partner).transfer(_amount / 2);
    //            }
    //        } else {
    //            if (partner != address(0)) {
    //                IERC20(_token).transferFrom(msg.sender, address(this), _amount / 2);
    //                IERC20(_token).transferFrom(msg.sender, partner, _amount / 2);
    //            } else {
    //                IERC20(_token).transferFrom(msg.sender, address(this), _amount);
    //            }
    //        }
    //    }


    function receiveToken(uint256 _level) public payable {
        address partner = address(0);
        Token[] memory costs = upgradeCosts[_level];
        for (uint i = 0; i < costs.length; i++) {
            if (address(costs[i].erc20Address) == address(0)) {
                if (costs[i].amount > 0) {
                    require(msg.value >= costs[i].amount, "Insufficient");
                }
                if (msg.value > costs[i].amount) {
                    payable(msg.sender).transfer(msg.value - costs[i].amount);
                }
                if (partner != address(0)) {
                    payable(partner).transfer(costs[i].amount / 2);
                }
            } else {
                if (partner != address(0)) {
                    costs[i].erc20Address.transferFrom(msg.sender, address(this), costs[i].amount / 2);
                    costs[i].erc20Address.transferFrom(msg.sender, partner, costs[i].amount / 2);
                } else {
                    costs[i].erc20Address.transferFrom(msg.sender, address(this), costs[i].amount);
                }
                Asset.addAsset(receiveTokens, costs[i].erc20Address);
            }
        }
    }


    function withdraw(address _to, address _token, uint256 _amount) public {
        if (address(_token) == address(0)) {
            require(address(this).balance >= _amount, "Insufficient balance");
            payable(_to).transfer(_amount);
        } else {
            require(IERC20(_token).balanceOf(address(this)) >= _amount, "Insufficient balance");
            IERC20(_token).transfer(_to, _amount);
        }
    }
}