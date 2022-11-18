// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;


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


interface IDataStorage {

    struct QuizDetail {
        uint256 id;
        string app_id;
        string[] questions;
        uint256 amount;
        int256 group;
        uint botType;
        bool exist;
        bool over;
        uint256 startTime;
        uint256 activeTime;
        string title;
        string photo;
        uint256 participate;
    }


    function setQuiz(string memory _appId, QuizDetail memory _quiz) external;

    function overQuiz(uint256 _quizId) external;

    function getQuiz(uint256 _quizId) external view returns (QuizDetail memory);

    function getQuizzes(uint256[] memory _quizIds) external view returns (QuizDetail[] memory);

    function addInductees(uint256 _quizId, address[] memory _inductees, uint256 _participate) external;


    function getShouldAwardQuizIds() external view returns (uint256[] memory);

    function getAppQuizIds(string memory _appId) external view returns (uint256[] memory);


    struct Lottery {
        IERC20 token;
        uint256[] amounts;
        uint256[] fixedNum;
        uint256[] proportionNum;
        uint256 totalAmount;
        bool isEth;
        bool over;
        bool exist;
    }

    function checkAdmin(string memory _appId, address _sender) external view returns (bool);

    function getInductees(uint256 _quizId) external view returns (address[] memory);

    function setLottery(address _creator, uint256 _lotteryId, Lottery memory _lottery) external;

    function overLottery(uint256 _lotteryId) external;

    function getLottery(uint256 _lotteryId) external view returns (Lottery memory);

    function getLotteries(uint256[] memory _lotteryIds) external view returns (Lottery[] memory);

    function setLotteryResult(uint256 _lotteryId, uint256 _index, address[] memory _winner) external;

    function getLotteryResult(uint256 _lotteryId, uint256 _index) external view returns (address[] memory);

    function getLotteryCreator(uint256 _lotteryId) external view returns (address);

    function setEthBank(address _holder, uint256 _amount) external;

    function getEthBank(address _holder) external view returns (uint256);

    function setErc20Bank(address _holder, IERC20 _token, uint256 _amount) external;

    function getErc20Bank(address _holder, IERC20 _token) external view returns (uint256);

    function transferOwner(address _newOwner) external;

    function addAdmin(string memory _appId, address _admin) external;

    function getAppAdmins(string memory _appId) external view returns (address[] memory);
}


contract TransferData {

    address public owner;

    IDataStorage public oldStorage;
    IDataStorage public newStorage;


    modifier onlyOwner(){
        require(msg.sender == owner, "Only Owner");
        _;
    }

    constructor(IDataStorage _old, IDataStorage _new){
        owner = msg.sender;
        oldStorage = _old;
        newStorage = _new;
    }


    function transferQuiz(string memory _appId) public onlyOwner {
        uint256[] memory ids = oldStorage.getAppQuizIds(_appId);
        for (uint i = 0; i < ids.length; i++) {
            IDataStorage.QuizDetail memory quiz = oldStorage.getQuiz(ids[i]);
            if (!quiz.exist) {
                continue;
            }
            newStorage.setQuiz(_appId, quiz);

            address[] memory inductees = oldStorage.getInductees(quiz.id);
            if (inductees.length > 0) {
                newStorage.addInductees(quiz.id, inductees, quiz.participate);
            }
            if (quiz.over) {
                newStorage.overQuiz(quiz.id);
            }
            IDataStorage.Lottery memory lottery = oldStorage.getLottery(quiz.id);
            if (!lottery.exist) {
                continue;
            }
            address creator = oldStorage.getLotteryCreator(quiz.id);
            newStorage.setLottery(creator, quiz.id, lottery);
            if (lottery.isEth) {
                uint256 balance = oldStorage.getEthBank(creator);
                newStorage.setEthBank(creator, balance);
            } else {
                uint256 balance = oldStorage.getErc20Bank(creator, lottery.token);
                newStorage.setErc20Bank(creator, lottery.token, balance);

            }
            if (lottery.over) {
                address[] memory winners = oldStorage.getLotteryResult(quiz.id, 0);
                if (winners.length > 0) {
                    newStorage.setLotteryResult(quiz.id, 0, winners);
                }
                newStorage.overLottery(quiz.id);
            }
        }
    }


    function CopyAdmins(string memory _appId) public onlyOwner {
        address[] memory admins = oldStorage.getAppAdmins(_appId);
        for (uint i = 0; i < admins.length; i++) {
            newStorage.addAdmin(_appId, admins[i]);
        }
    }

    function TransferDataOwner() public onlyOwner {
        newStorage.transferOwner(msg.sender);
    }
}





