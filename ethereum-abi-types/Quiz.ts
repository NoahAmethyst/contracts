import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from 'ethers';
import { EthersContractContextV5 } from 'ethereum-abi-types-generator';

export type ContractContext = EthersContractContextV5<
  Quiz,
  QuizMethodNames,
  QuizEventsContext,
  QuizEvents
>;

export declare type EventFilter = {
  address?: string;
  topics?: Array<string>;
  fromBlock?: string | number;
  toBlock?: string | number;
};

export interface ContractTransactionOverrides {
  /**
   * The maximum units of gas for the transaction to use
   */
  gasLimit?: number;
  /**
   * The price (in wei) per unit of gas
   */
  gasPrice?: BigNumber | string | number | Promise<any>;
  /**
   * The nonce to use in the transaction
   */
  nonce?: number;
  /**
   * The amount to send with the transaction (i.e. msg.value)
   */
  value?: BigNumber | string | number | Promise<any>;
  /**
   * The chain ID (or network ID) to use
   */
  chainId?: number;
}

export interface ContractCallOverrides {
  /**
   * The address to execute the call as
   */
  from?: string;
  /**
   * The maximum units of gas for the transaction to use
   */
  gasLimit?: number;
}
export type QuizEvents = 'Awards' | 'CreateQuiz';
export interface QuizEventsContext {
  Awards(...parameters: any): EventFilter;
  CreateQuiz(...parameters: any): EventFilter;
}
export type QuizMethodNames =
  | 'new'
  | 'addAppOperator'
  | 'addInductees'
  | 'awards'
  | 'changeLottery'
  | 'changeOperator'
  | 'changeQuizToken'
  | 'changeRewardAmount'
  | 'correctRewardAmount'
  | 'createQuiz'
  | 'dataStorage'
  | 'editQuiz'
  | 'getAppQuizIds'
  | 'getInductees'
  | 'getLotteryResults'
  | 'getQuiz'
  | 'getQuizzes'
  | 'getShouldAwardQuizIds'
  | 'lottery'
  | 'operator'
  | 'owner'
  | 'quizToken'
  | 'transferOwner';
export interface AwardsEventEmittedResponse {
  _quizId: Arrayish;
}
export interface CreateQuizEventEmittedResponse {
  _appId: string;
  _quizId: BigNumberish;
  _groupId: BigNumberish;
  _botType: BigNumberish;
  questions: string[];
  _rewardAmount: BigNumberish;
  _startTime: BigNumberish;
  _activeTime: BigNumberish;
}
export interface QuizdetailResponse {
  id: BigNumber;
  0: BigNumber;
  app_id: string;
  1: string;
  questions: string[];
  2: string[];
  amount: BigNumber;
  3: BigNumber;
  group: BigNumber;
  4: BigNumber;
  botType: BigNumber;
  5: BigNumber;
  exist: boolean;
  6: boolean;
  over: boolean;
  7: boolean;
  startTime: BigNumber;
  8: BigNumber;
  activeTime: BigNumber;
  9: BigNumber;
  title: string;
  10: string;
  photo: string;
  11: string;
  participate: BigNumber;
  12: BigNumber;
}
export interface Quiz {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   * @param _operator Type: address, Indexed: false
   * @param _lottery Type: address, Indexed: false
   * @param _quizToken Type: address, Indexed: false
   * @param _storage Type: address, Indexed: false
   * @param _rewardAmount Type: uint256, Indexed: false
   */
  'new'(
    _operator: string,
    _lottery: string,
    _quizToken: string,
    _storage: string,
    _rewardAmount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _appId Type: string, Indexed: false
   * @param _newOperator Type: address, Indexed: false
   */
  addAppOperator(
    _appId: string,
    _newOperator: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _appId Type: string, Indexed: false
   * @param _quizId Type: uint256, Indexed: false
   * @param _inductees Type: address[], Indexed: false
   * @param _participateNumber Type: uint256, Indexed: false
   */
  addInductees(
    _appId: string,
    _quizId: BigNumberish,
    _inductees: string[],
    _participateNumber: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _appId Type: string, Indexed: false
   * @param _quizId Type: uint256, Indexed: false
   */
  awards(
    _appId: string,
    _quizId: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _newLottery Type: address, Indexed: false
   */
  changeLottery(
    _newLottery: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _newOperator Type: address, Indexed: false
   */
  changeOperator(
    _newOperator: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _newQuizToken Type: address, Indexed: false
   */
  changeQuizToken(
    _newQuizToken: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _newAmount Type: uint256, Indexed: false
   */
  changeRewardAmount(
    _newAmount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  correctRewardAmount(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param _appId Type: string, Indexed: false
   * @param _quizId Type: uint256, Indexed: false
   * @param _groupId Type: int256, Indexed: false
   * @param _botType Type: uint256, Indexed: false
   * @param _questions Type: string[], Indexed: false
   * @param _rewardAmount Type: uint256, Indexed: false
   * @param _startTime Type: uint256, Indexed: false
   * @param _activeTime Type: uint256, Indexed: false
   * @param _title Type: string, Indexed: false
   * @param _photo Type: string, Indexed: false
   */
  createQuiz(
    _appId: string,
    _quizId: BigNumberish,
    _groupId: BigNumberish,
    _botType: BigNumberish,
    _questions: string[],
    _rewardAmount: BigNumberish,
    _startTime: BigNumberish,
    _activeTime: BigNumberish,
    _title: string,
    _photo: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  dataStorage(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _appId Type: string, Indexed: false
   * @param _quizId Type: uint256, Indexed: false
   * @param _groupId Type: int256, Indexed: false
   * @param _questions Type: string[], Indexed: false
   * @param _startTime Type: uint256, Indexed: false
   * @param _activeTime Type: uint256, Indexed: false
   * @param _title Type: string, Indexed: false
   * @param _photo Type: string, Indexed: false
   */
  editQuiz(
    _appId: string,
    _quizId: BigNumberish,
    _groupId: BigNumberish,
    _questions: string[],
    _startTime: BigNumberish,
    _activeTime: BigNumberish,
    _title: string,
    _photo: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _appId Type: string, Indexed: false
   */
  getAppQuizIds(
    _appId: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _quizId Type: uint256, Indexed: false
   */
  getInductees(
    _quizId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<string[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _quizId Type: uint256, Indexed: false
   * @param _index Type: uint256, Indexed: false
   */
  getLotteryResults(
    _quizId: BigNumberish,
    _index: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<string[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _quizId Type: uint256, Indexed: false
   */
  getQuiz(
    _quizId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<QuizdetailResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _ids Type: uint256[], Indexed: false
   */
  getQuizzes(
    _ids: BigNumberish[],
    overrides?: ContractCallOverrides
  ): Promise<QuizdetailResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getShouldAwardQuizIds(
    overrides?: ContractCallOverrides
  ): Promise<BigNumber[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  lottery(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  operator(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  owner(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  quizToken(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _newOwner Type: address, Indexed: false
   */
  transferOwner(
    _newOwner: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
}
