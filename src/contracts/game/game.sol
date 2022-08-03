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
        uint256 botType;
        string startContent;
        string endContent;

        uint256 eliminateMinNum;
        uint256 eliminateMaxNum;
        // v/100
        uint256 eliminateProportion;
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


contract Game {

    using SafeMath for uint256;
    address  public owner;
    address payable public operator;
    mapping(string => address payable) appOperators;
    IAdminData public adminData;
    IGameData public gameData;


    uint256 public correctRewardAmount;

    constructor(address payable _operator, IAdminData _adminData, IGameData _gameData) {
        owner = msg.sender;
        operator = _operator;
        adminData = _adminData;
        gameData = _gameData;
    }


    modifier checkGame(uint256 _gameId){
        require(_quizId != 0, "invalid quizId 0");
        require(gameData.getGame(_gameId).exist, "nonexistent game");
        _;
    }

    modifier onlyOwner(){
        require(msg.sender == owner, "Only Owner");
        _;
    }

    modifier onlyAdmin(string memory _appId) {
        require(adminData.checkAdmin(_appId, msg.sender) || operator == msg.sender
        || address(appOperators[_appId]) == msg.sender || owner == msg.sender, "Only admin");
        _;
    }

    function transferOwner(address _newOwner) public onlyOwner {
        owner = _newOwner;
    }

    function changeOperator(address payable _newOperator) public onlyOwner {
        operator = _newOperator;
    }

    function addAppOperator(string memory _appId, address payable _newOperator) public onlyOwner {
        appOperators[_appId] = _newOperator;
    }

    function createQuiz(string memory _appId, uint256 _quizId, int256 _groupId, uint _botType, string[] memory _questions,
        uint256 _rewardAmount, uint256 _startTime, uint256 _activeTime, string memory _title, string memory _photo) payable public onlyAdmin(_appId) {
        require(_quizId != 0, "invalid quizId 0");
        IDataStorage.QuizDetail memory quiz = dataStorage.getQuiz(_quizId);
        require(!quiz.exist, "exist quiz");
        _rewardAmount = correctRewardAmount;

        address payable thisOperator = appOperators[_appId];

        if (address(msg.sender) != address(operator) && address(msg.sender) != owner) {
            require(msg.value > 0, "you should prepay for gas");
            if (address(thisOperator) != address(0)) {
                require(msg.value > 0, "you should prepay for gas");
                thisOperator.transfer(msg.value);
            } else {
                operator.transfer(msg.value);
            }
        }

        quiz.id = _quizId;
        quiz.app_id = _appId;
        quiz.amount = _rewardAmount;
        quiz.questions = _questions;
        quiz.group = _groupId;
        quiz.exist = true;
        quiz.botType = _botType;
        quiz.title = _title;
        quiz.photo = _photo;
        quiz.startTime = _startTime;
        quiz.activeTime = _activeTime;

        dataStorage.setQuiz(_appId, quiz);

        emit CreateQuiz(_appId, _quizId, _groupId, _botType, _questions, _rewardAmount, _startTime, _activeTime);
    }


    function editQuiz(string memory _appId, uint256 _quizId, int256 _groupId, string[] memory _questions, uint256 _startTime, uint256 _activeTime, string memory _title, string memory _photo) public
    onlyAdmin(_appId)
    checkQuiz(_quizId) {
        IDataStorage.QuizDetail memory quiz = dataStorage.getQuiz(_quizId);
        if (_groupId != 0) {
            quiz.group = _groupId;
        }
        if (_questions.length > 0) {
            quiz.questions = _questions;
        }
        if (_startTime > 0) {
            quiz.startTime = _startTime;
        }
        if (_activeTime > 0) {
            quiz.activeTime = _activeTime;
        }
        if (bytes(_title).length > 0) {
            quiz.title = _title;
        }
        if (bytes(_photo).length > 0) {
            quiz.photo = _photo;
        }

        dataStorage.setQuiz(_appId, quiz);
    }


    function getQuiz(uint256 _quizId) public view returns (IDataStorage.QuizDetail memory) {
        return dataStorage.getQuiz(_quizId);
    }

    function getQuizzes(uint256[] memory _ids) public view returns (IDataStorage.QuizDetail[] memory){
        return dataStorage.getQuizzes(_ids);
    }


    function getShouldAwardQuizIds() public view returns (uint256[] memory) {
        return dataStorage.getShouldAwardQuizIds();
    }

    function getAppQuizIds(string memory _appId) public view returns (uint256[] memory){
        return dataStorage.getAppQuizIds(_appId);
    }


    function getInductees(uint256 _quizId) public view returns (address[] memory){
        return dataStorage.getInductees(_quizId);
    }

    function addInductees(string memory _appId, uint256 _quizId, address[] memory _inductees, uint256 _participateNumber) public checkQuiz(_quizId) onlyAdmin(_appId) {
        IDataStorage.QuizDetail memory quiz = dataStorage.getQuiz(_quizId);
        require(!quiz.over, "quiz is over");
        dataStorage.addInductees(_quizId, _inductees, _participateNumber);
    }

    function awards(string memory _appId, uint256 _quizId) public checkQuiz(_quizId) onlyAdmin(_appId) {
        IDataStorage.QuizDetail memory quiz = dataStorage.getQuiz(_quizId);
        require(!quiz.over, "quiz is over");

        address[] memory thisInductees = dataStorage.getInductees(_quizId);
        uint256 i = 0;

        while (i < thisInductees.length) {
            quizToken.mint(thisInductees[i], quiz.amount);
            i += 1;
        }

        quiz.over = true;
        dataStorage.overQuiz(_quizId);
        lottery.drawALottery(_quizId);
    }


    function getLotteryResults(uint256 _quizId, uint256 _index) public view returns (address[] memory){
        return dataStorage.getLotteryResult(_quizId, _index);
    }
}