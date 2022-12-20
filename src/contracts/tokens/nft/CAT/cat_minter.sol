// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;


library SafeMath {

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "addition overflow");

        return c;
    }


    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "subtraction overflow");
    }


    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }


    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }


    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }


    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }


    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return mod(a, b, "SafeMath: modulo by zero");
    }


    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b != 0, errorMessage);
        return a % b;
    }
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


interface ICAT {

    function mint(address _to) external returns (uint256);

    function upgrade(uint256 _tokenId) external;

    function totalSupply() external view returns (uint256);

    function level(uint256 _tokenId) external view returns (uint256);

}


contract Permission {
    address public owner;
    mapping(address => bool) public operators;

    modifier onlyOwner(){
        require(msg.sender == owner, "Only Owner");
        _;
    }

    modifier onlyOperator(){
        require(operators[msg.sender], "Only Operator");
        _;
    }

    function _initPermission() internal {
        owner = msg.sender;
        addOperator(msg.sender);
    }

    function transferOwner(address _newOwner) public onlyOwner {
        removeOperator(owner);
        addOperator(_newOwner);
        owner = _newOwner;
    }

    function addOperator(address _operator) public onlyOwner {
        operators[_operator] = true;
    }

    function removeOperator(address _operator) public onlyOwner {
        operators[_operator] = false;
    }
}


contract Minter is Permission {
    using SafeMath for uint256;

    ICAT public icat;

    struct Token {
        IERC20 erc20Address;
        uint256 amount;
    }


    uint256 public basePrice = 500000000000000000;

    uint256 public freeThreshold = 500;

    uint256 public publicThreshold = 2000;

    mapping(uint256 => Token[]) public upgradeCosts;



    constructor(address _cat, address _primaryToken, address _secondaryToken) {
        icat = ICAT(_cat);
        _initPermission();
        upgradeCosts[2].push(Token(IERC20(_primaryToken), 500000000000000000000));
        upgradeCosts[3].push(Token(IERC20(_primaryToken), 5000000000000000000000));
        upgradeCosts[4].push(Token(IERC20(_primaryToken), 15000000000000000000000));
        upgradeCosts[4].push(Token(IERC20(_secondaryToken), 500000000000000000000));
        upgradeCosts[5].push(Token(IERC20(_primaryToken), 50000000000000000000000));
        upgradeCosts[5].push(Token(IERC20(_secondaryToken), 2000000000000000000000));
    }


    function changeIcat(address _cat, address _primaryToken, address _secondaryToken) public onlyOwner {
        icat = ICAT(_cat);

    }

    function changeBasePrice(uint256 _basePrice) public onlyOwner {
        basePrice = _basePrice;
    }

    function changeFreeThreshold(uint256 _value) public onlyOwner {
        freeThreshold = _value;
    }

    function changePublicThreshold(uint256 _value) public onlyOwner {
        publicThreshold = _value;
    }

    function batchFreeMint(address[] memory _receivers) public onlyOperator {
        require(icat.totalSupply().add(_receivers.length) < freeThreshold, "Free mint count exceeded");
        for (uint i = 0; i < _receivers.length; i++) {
            icat.mint(_receivers[i]);
        }
    }

    function freeMint(address _to) public onlyOperator {
        require(icat.totalSupply() < freeThreshold, "Free mint count exceeded");
        icat.mint(_to);
    }


    function _mint(address _to) internal {

    }


    function whiteListMint(bytes memory _signature) public {
        require(checkSign(_signature), "Signature not right");
        require(icat.totalSupply() >= freeThreshold, "Not reach white list mint requirement");
        require(icat.totalSupply() < publicThreshold, "White list mint count exceeded");
        icat.mint(msg.sender);
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


    function publicMint() public payable {
        require(icat.totalSupply() >= publicThreshold, "Public mint not open yet");
        uint256 price = publicMintPrice();
        require(msg.value >= price, "Insufficient");
        if (msg.value.sub(price) > 0) {
            payable(msg.sender).transfer(msg.value.sub(price));
        }
        icat.mint(msg.sender);
    }

    function publicMintPrice() public view returns (uint256){
        uint256 totalSupply = icat.totalSupply();
        if (totalSupply < publicThreshold) {
            return basePrice;
        }
        return basePrice.mul(totalSupply.sub(publicThreshold).div(1000).add(1));
    }

    function getUpgradeCost(uint256 _level) public view returns (Token[] memory){
        return upgradeCosts[_level];
    }

    function setUpgradeCost(uint256 _level, Token[] memory _prices) public onlyOwner {
        delete upgradeCosts[_level];
        _pushCosts(upgradeCosts[_level], _prices);
    }

    function _pushCosts(Token[] storage _self, Token[] memory _costs) internal {
        for (uint i = 0; i < _costs.length; i++) {
            _self.push(Token(_costs[i].erc20Address, _costs[i].amount));
        }
    }

    function upgrade(uint256 _tokenId) public {
        uint256 currentLevel = icat.level(_tokenId);
        receiveToken(currentLevel + 1);
        icat.upgrade(_tokenId);
    }

    function receiveToken(uint256 _level) public payable {
        Token[] memory costs = upgradeCosts[_level];
        for (uint i = 0; i < costs.length; i++) {
            if (address(costs[i].erc20Address) == address(0)) {
                if (costs[i].amount > 0) {
                    require(msg.value >= costs[i].amount, "Insufficient");
                }
                payable(msg.sender).transfer(msg.value - costs[i].amount);
            } else {
                costs[i].erc20Address.transferFrom(msg.sender, address(this), costs[i].amount);
            }
        }
    }

    function withdraw(address _to, address _token, uint256 _amount) public onlyOwner {
        if (address(_token) == address(0)) {
            require(address(this).balance >= _amount, "Insufficient balance");
            payable(_to).transfer(_amount);
        } else {
            require(IERC20(_token).balanceOf(address(this)) >= _amount, "Insufficient balance");
            IERC20(_token).transfer(_to, _amount);
        }
    }


}