// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../airdrop.sol";


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

contract DataStorage {
    using SafeMath for uint256;
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

    function transferOwner(address _newOwner) public onlyOwner {
        owner = _newOwner;
        operators[_newOwner] = true;
    }

    function addOperator(address _newOperator) public onlyOwner {
        operators[_newOperator] = true;
    }


    constructor() {
        owner = msg.sender;
        operators[msg.sender] = true;
    }

    //game
    struct GameDetail {
        uint256 id;
        uint256 type;
        string appId;
        uint256 botType;
        string startContent;
        string endContent;

        uint256 eliminateMinNum;
        uint256 eliminateMaxNum;
        // v/100
        uint256 eliminateProportion;
        uint256 winNum;
        uint256[] buffIds;
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

    mapping(uint256 => GameDetail) private games;
    mapping(string => uint256[]) public appGames;
    mapping(uint256 => mapping(address => uint256)) userBuff;

    uint256[] private gameIds;
    uint256[] private notOverGameIds;


    function setGame(string memory _appId, GameDetail memory _game) public onlyOperator {
        if (!games[_game.id].exist) {
            games[_game.id] = _game;
            appGames[_appId].push(_game.id);
            gameIds.push(_game.id);
        }
    }

    function overGame(string memory _appId, uint256 _id) public onlyOperator {
        games[_id].over = true;
        _popOverGame(_id);
    }

    function getGame(uint256 _id) public view returns (GameDetail memory) {
        return games[_id];
    }

    function getQuizzes(uint256[] memory _ids) public view returns (GameDetail[] memory) {
        GameDetail[] memory details = new GameDetail[](_ids.length);
        for (uint i = 0; i < _ids.length; i++) {
            games[i] = games[_ids[i]];
        }
        return details;
    }


    function getNotOverGameList() public view returns (uint256[] memory){
        return notOverGameIds;
    }

    function getAppGames(string memory _appId) public view returns (uint256[] memory){
        return appGames[_appId];
    }


    function _popOverGame(uint256 _id) internal {
        uint256 lastNotOverGameIdIndex = notOverGameIds.length - 1;
        uint256 notOverGameIdIndex = 0;
        for (uint256 i = 0; i < lastNotOverGameIdIndex; i ++) {
            if (notOverGameIds[i] == _id) {
                notOverGameIdIndex = i;
            }
        }

        // When the question to delete is the last question, the swap operation is unnecessary
        if (lastNotOverGameIdIndex != notOverGameIdIndex) {
            notOverGameIds[notOverGameIdIndex] = notOverGameIds[lastNotOverGameIdIndex];
        }
        notOverGameIds.pop();
    }




    //game result
    struct GameResult {
        uint256 id;
        address[] winners;
        uint256 participate;
        address sponsor;
        uint256 launchTime;
    }

    mapping(uint256 => GameResult[]) private gameResults;


    function setGameResult(string memory _appId, GameResult memory _result) public onlyOperator {
        if (games[_result.id].exist) {
            gameResults[_result.id].push(_result);
        }
    }

    function getGameResults(uint256 _id) public view returns (GameResult[] memory){
        return gameResults[_id];
    }


}