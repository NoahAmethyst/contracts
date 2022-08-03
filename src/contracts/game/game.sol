// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

library SafeMath {

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }


    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "SafeMath: subtraction overflow");
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


interface IAdminData {
    function checkAdmin(string memory _appId, address _sender) external view returns (bool);
}


interface IGameData {

    //game
    struct GameDetail {
        uint256 id;
        uint256 category;
        string appId;
        int256 groupId;
        uint256 botType;
        string title;
        string introduction;
        string endContent;

        uint256 eliminateMinNum;
        uint256 eliminateMaxNum;
        // v/100
        uint256 eliminateProportion;
        uint256 awardProportion;
        uint256 winNum;
        uint256[] buffIds;
        string[] events;
        //ticket
        bool ticketIsEth;
        IERC20 ticketsToken;
        uint256 ticketsNum;
        //option
        uint256 effectStartTime;
        uint256 effectEndTime;
        //option auto start
        bool daily;
        //24H
        uint256 startH;
        uint256 startM;

        bool over;
        bool exist;
        address creator;
    }


    function setGame(string memory _appId, GameDetail memory _game) external;


    function overGame(string memory _appId, uint256 _id) external;

    function getGame(uint256 _id) external view returns (GameDetail memory);

    function getGames(uint256[] memory _ids) external view returns (GameDetail[] memory);


    function getNotOverGameList() external view returns (uint256[] memory);

    function getAppGames(string memory _appId) external view returns (uint256[] memory);

    function getGameIds() external view returns (uint256[] memory);

    function getPlayers(uint256 _gameId, uint256 _ground) external view returns (address[] memory);

    function setPlayers(uint256 _gameId, uint256 _round, address[] memory _players) external;

    function getBuffPlayers(uint256 _gameId, uint256 _round) external view returns (uint256[] memory);

    function setBuffPlayers(uint256 _gameId, uint256 _round, uint256[] memory _indexes) external;

    function getTicketsPool(uint256 _gameId, uint256 _round) external view returns (uint256);





    //game result
    struct GameResult {
        uint256 id;
        address[] winners;
        uint256 participate;
        address sponsor;
        uint256 launchTime;
        uint256[] eliminatePlayerIndexes;
        uint256[] buffUsersIndexes;
        uint256[] eventsIndexes;
    }

    function setGameResult(string memory _appId, GameResult memory _result) external;

    function getGameResult(uint256 _gameId, uint256 _round) external view returns (GameResult memory);

    function getGameResultLength(uint256 _gameId) external view returns (uint256);

    function getGameResults(uint256 _gameId) external view returns (GameResult[] memory);

}


contract Operator {
    address payable public operator;
    mapping(string => address payable) appOperators;

    function _changeOperator(address payable _newOperator) internal {
        operator = _newOperator;
    }

    function _addAppOperator(string memory _appId, address payable _newOperator) internal {
        appOperators[_appId] = _newOperator;
    }

}


contract Ownable is Operator {
    address public owner;

    modifier onlyOwner(){
        require(msg.sender == owner, "Only Owner");
        _;
    }

    function transferOwner(address _newOwner) public onlyOwner {
        owner = _newOwner;
    }
}

contract Game is Ownable {

    using SafeMath for uint256;

    IAdminData public adminData;
    IGameData public gameData;


    constructor(address payable _operator, IAdminData _adminData, IGameData _gameData) {
        owner = msg.sender;
        operator = _operator;
        adminData = _adminData;
        gameData = _gameData;
    }


    modifier checkGame(uint256 _gameId){
        require(_gameId != 0, "invalid quizId 0");
        require(gameData.getGame(_gameId).exist, "nonexistent game");
        _;
    }


    modifier onlyAdmin(string memory _appId) {
        require(adminData.checkAdmin(_appId, msg.sender) || operator == msg.sender
        || address(appOperators[_appId]) == msg.sender || owner == msg.sender, "Only admin");
        _;
    }

    function changeOperator(address payable _newOperator) public onlyOwner {
        _changeOperator(_newOperator);
    }

    function addAppOperator(string memory _appId, address payable _newOperator) public onlyOwner {
        _addAppOperator(_appId, _newOperator);
    }





}