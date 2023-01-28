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

/**
 * @dev Wrappers over Solidity's arithmetic operations with added overflow
 * checks.
 *
 * Arithmetic operations in Solidity wrap on overflow. This can easily result
 * in bugs, because programmers usually assume that an overflow raises an
 * error, which is the standard behavior in high level programming languages.
 * `SafeMath` restores this intuition by reverting the transaction when an
 * operation overflows.
 *
 * Using this library instead of the unchecked operations eliminates an entire
 * class of bugs, so it's recommended to use it always.
 */
library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     *
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");
        return c;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "SafeMath: subtraction overflow");
        return a - b;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     *
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) return 0;
        uint256 c = a * b;
        require(c / a == b, "SafeMath: mul overflow");
        return c;
    }

    /**
     * @dev Returns the integer division of two unsigned integers, reverting on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "SafeMath: division by 0");
        return a / b;
    }

    /**
     * @dev Returns the ceiling integer division of two unsigned integers,
     * reverting on division by zero. The result is rounded towards up the
     * nearest integer, instead of truncating the fractional part.
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     * - The sum of the dividend and divisor cannot overflow.
     */
    function ceilDiv(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "SafeMath: ceiling division by 0");
        return a / b + (a % b == 0 ? 0 : 1);
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

contract CatProxy {

    using SafeMath for uint256;

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
    mapping(address => bool) public operators;


    ITokenuri public tokenUri;
    address public PROXY;

    uint256 tokenId = 2022;
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

    uint256 public basePrice = 500000000000000000;

    uint256 public publicThreshold = 2000;

    event Upgrade(address indexed _from, uint256 indexed _tokenId, uint256 indexed _level);

    constructor() {}


    function setConfig(bool _canTransfer, uint256 _maxLevel, uint256 _freeMintCount, uint256 _publicThreshold) public {
        canTransfer = _canTransfer;
        maxLevel = _maxLevel;
        freeMintCount = _freeMintCount;
        publicThreshold = _publicThreshold;
    }

    function mintProxy(address _to) internal {
        require(!minted[_to], "One chance");
        if (publicMintPrice() > upgradeCosts[1][0].amount) {
            upgradeCosts[1][0].amount = publicMintPrice();
        }
        tokenId += 1;
        level[tokenId] = 1;
        levelCount[1] += 1;
        minted[_to] = true;
    }

    function mintProxyWithLevel(address _to, uint256 _level) public {
        tokenId += 1;
        level[tokenId] = _level;
        levelCount[_level] += 1;
        minted[_to] = true;
    }

    function mintProxyWithPayable(address _to) public payable {
        mintProxy(_to);
    }


    function whiteListMint(bytes memory _signature) public {
        require(checkSign(_signature), "Signature not right");
        mintProxy(msg.sender);
    }


    function upgradeProxy(address _caller, uint256 _tokenId) public payable {
        uint256 currLv = level[_tokenId];
        require(currLv < maxLevel, "Max level");
        levelCount[currLv] -= 1;
        level[_tokenId] += 1;
        levelCount[currLv + 1] += 1;
    }

    function receiveToken(uint256 _level) public payable {
        if (_level == 1) {
            uint256 price = publicMintPrice();
            require(msg.value >= price, "Insufficient");
            if (msg.value > price) {
                payable(msg.sender).transfer(msg.value - price);
            }
        } else {
            Token[] memory costs = upgradeCosts[_level];
            for (uint i = 0; i < costs.length; i++) {
                if (address(costs[i].erc20Address) == address(0)) {
                    if (costs[i].amount > 0) {
                        require(msg.value >= costs[i].amount, "Insufficient");
                    }
                    if (msg.value > costs[i].amount) {
                        payable(msg.sender).transfer(msg.value - costs[i].amount);
                    }
                } else {
                    costs[i].erc20Address.transferFrom(msg.sender, address(this), costs[i].amount);
                    Asset.addAsset(receiveTokens, costs[i].erc20Address);
                }
            }
        }
    }

    function publicMintPrice() public view returns (uint256){
        uint256 totalSupply = _allTokens.length;
        if (totalSupply < publicThreshold) {
            return basePrice;
        }
        return basePrice.mul(totalSupply.sub(publicThreshold).div(1000).add(1));
    }

    function checkSign(bytes memory _signature) public view returns (bool) {
        bytes32 thisMessage = keccak256(abi.encodePacked(msg.sender, this));
        return operators[recoverSigner(thisMessage, _signature)];
    }


    function splitSignature(bytes memory sig)
    internal
    pure
    returns (uint8 v, bytes32 r, bytes32 s)
    {
        require(sig.length == 65);

        assembly {
        // first 32 bytes, after the length prefix.
            r := mload(add(sig, 32))
        // second 32 bytes.
            s := mload(add(sig, 64))
        // final byte (first byte of the next 32 bytes).
            v := byte(0, mload(add(sig, 96)))
        }

        return (v, r, s);
    }

    function recoverSigner(bytes32 _message, bytes memory sig)
    internal
    pure
    returns (address)
    {
        //bytes32 hash =keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", message));
        (uint8 v, bytes32 r, bytes32 s) = splitSignature(sig);
        if (v < 27) {
            v += 27;
        }
        return ecrecover(_message, v, r, s);
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