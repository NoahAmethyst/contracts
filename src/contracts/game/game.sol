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
        uint256 ticketAmount;
        //option
        uint256 effectStartTime;
        uint256 effectEndTime;
        //option auto start
        bool daily;
        //24H
        uint256 startH;
        uint256 startM;
        bool exist;
        address creator;
    }


    function setGame(string memory _appId, GameDetail memory _game) external;

    function getGame(uint256 _id) external view returns (GameDetail memory);

    function getGames(uint256[] memory _ids) external view returns (GameDetail[] memory);

    function getAppGames(string memory _appId) external view returns (uint256[] memory);

    function getGameIds() external view returns (uint256[] memory);

    function getPlayers(uint256 _gameId, uint256 _ground) external view returns (address[] memory);

    function setPlayers(uint256 _gameId, uint256 _round, address[] memory _players) external;

    function addPlayer(uint256 _gameId, uint256 _round, address _player) external;

    function getBuffPlayers(uint256 _gameId, uint256 _round) external view returns (uint256[] memory);

    function setBuffPlayers(uint256 _gameId, uint256 _round, uint256[] memory _indexes) external;

    function addBuffPlayers(uint256 _gameId, uint256 _round, uint _index) external;

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


contract Permission {
    address public owner;
    address payable public operator;
    mapping(string => address payable) appOperators;

    modifier onlyOwner(){
        require(msg.sender == owner, "Only Owner");
        _;
    }

    function transferOwner(address _newOwner) public onlyOwner {
        owner = _newOwner;
    }

    function isOperator(string memory _appId) public view returns (bool){
        return (operator == msg.sender || address(appOperators[_appId]) == msg.sender);
    }

    function changeOperator(address payable _newOperator) public onlyOwner {
        operator = _newOperator;
    }

    function addAppOperator(string memory _appId, address payable _newOperator) public onlyOwner {
        appOperators[_appId] = _newOperator;
    }

    function delAppOperator(string memory _appId) public onlyOwner {
        appOperators[_appId] = payable(0);
    }
}


contract Game is Permission {

    using SafeMath for uint256;

    IAdminData public adminData;
    IGameData public gameData;
    IERC20 public buffToken;
    uint256 public buffValue;



    constructor(address payable _operator, IAdminData _adminData, IGameData _gameData, IERC20 _buffToken, uint256 _buffValue) {
        owner = msg.sender;
        operator = _operator;
        adminData = _adminData;
        gameData = _gameData;
        buffToken = _buffToken;
        buffValue = _buffValue;
    }


    function changeAdminData(IAdminData _newData) public onlyOwner {
        adminData = _newData;
    }

    function changeGameData(IGameData _newData) public onlyOwner {
        gameData = _newData;
    }

    function changeBuffToken(IERC20 _newToken) public onlyOwner {
        buffToken = _newToken;
    }


    modifier checkGame(uint256 _gameId){
        require(_gameId != 0, "invalid quizId 0");
        require(gameData.getGame(_gameId).exist, "nonexistent game");
        _;
    }

    modifier onlyAdmin(string memory _appId) {
        require(adminData.checkAdmin(_appId, msg.sender) || isOperator(_appId), "Only admin");
        _;
    }

    function _createGame(IGameData.GameDetail memory _game) public onlyAdmin(_game.appId) {
        require(_game.id != 0, "invalid gameId 0");
        IGameData.GameDetail memory game = gameData.getGame(_game.id);
        require(!game.exist, "exist game");
        game = _game;
        game.exist = true;
        if (!_game.daily) {
            game.startH = 0;
            game.startM = 0;
        }
        game.creator = msg.sender;
        gameData.setGame(_game.appId, game);
    }

    function buyErc20Ticket(uint256 _gameId) public checkGame(_gameId) {
        IGameData.GameDetail memory game = gameData.getGame(_gameId);
        require(!game.ticketIsEth, "ticket not erc20 token");
        uint256 round = gameData.getGameResultLength(_gameId).sub(1);
        bool hasPlayer = _checkIsJoin(_gameId, round, msg.sender);
        require(!hasPlayer, "already buy tickets");
        bool success = game.ticketsToken.transferFrom(msg.sender, address(this), game.ticketAmount);
        require(success, "buy ticket failed");

        gameData.addPlayer(_gameId, round.sub(1), msg.sender);
    }


    function buyEthTicket(uint256 _gameId) public payable checkGame(_gameId) {
        IGameData.GameDetail memory game = gameData.getGame(_gameId);
        require(game.ticketIsEth, "ticket not native token");
        uint256 round = gameData.getGameResultLength(_gameId).sub(1);
        bool hasPlayer = _checkIsJoin(_gameId, round, msg.sender);
        require(!hasPlayer, "already buy tickets");
        require(msg.value >= game.ticketAmount, "pay for ticket not enough");
        gameData.addPlayer(_gameId, round.sub(1), msg.sender);
    }

    function buyBuff(uint256 _gameId, uint256 _round, uint256 _buffId) public {
        IGameData.GameDetail memory game = gameData.getGame(_gameId);
        bool buffExist = false;
        for (uint i = 0; i < game.buffIds.length; i++) {
            if (game.buffIds[i] == _buffId) {
                buffExist = true;
                break;
            }
        }

        address[] memory players = gameData.getPlayers(_gameId, _round);
        uint index = 0;
        bool hasPlayer = false;
        for (uint i = 0; i < players.length; i++) {
            if (players[i] == msg.sender) {
                hasPlayer = true;
                index = i;
                break;
            }
        }

        require(hasPlayer, "not join the game");
        require(buffExist, "invalid buff");
        bool success = buffToken.transferFrom(msg.sender, address(this), buffValue);
        require(success, "buy buff failed");
        gameData.addBuffPlayers(_gameId, _round, index);
    }


    function getPlayers(uint256 _gameId, uint256 _round) public view returns (address[] memory){
        return gameData.getPlayers(_gameId, _round);
    }

    function getGameRound(uint256 _gameId) public view returns (uint256){
        return gameData.getGameResultLength(_gameId).add(1);
    }

    function getGameResults(uint256 _gameId) public view returns (IGameData.GameResult[] memory){
        return gameData.getGameResults(_gameId);
    }

    function getGameResult(uint256 _gameId, uint256 _round) public view returns (IGameData.GameResult memory){
        return gameData.getGameResult(_gameId, _round);
    }

    function getBuffPlayerIndexes(uint256 _gameId, uint256 _round) public view returns (uint256[] memory){
        return gameData.getBuffPlayers(_gameId, _round);
    }

    function setGameResult(string memory _appId, uint256 _gameId, address[] memory _winners, address _sponsor, uint256 _launchTime,
        uint256[] memory _eliminatePlayerIndexes, uint256[] memory _buffUsersIndexes, uint256[] memory _eventsIndexes) public onlyAdmin(_appId) checkGame(_gameId) {


        uint256 round = gameData.getGameResultLength(_gameId);
        address[] memory players = gameData.getPlayers(_gameId, round);

        IGameData.GameResult memory _result = IGameData.GameResult(
            _gameId,
            _winners,
            players.length,
            _sponsor,
            _launchTime,
            _eliminatePlayerIndexes,
            _buffUsersIndexes,
            _eventsIndexes
        );
        gameData.setGameResult(_appId, _result);

    }


    function _checkIsJoin(uint256 _gameId, uint256 _round, address _player) internal view returns (bool){
        address[] memory players = gameData.getPlayers(_gameId, _round);
        bool hasPlayer = false;
        for (uint i = 0; i < players.length; i++) {
            if (players[i] == _player) {
                hasPlayer = true;
                break;
            }
        }
        return hasPlayer;
    }

}