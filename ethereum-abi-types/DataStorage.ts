import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from 'ethers';
import { EthersContractContextV5 } from 'ethereum-abi-types-generator';

export type ContractContext = EthersContractContextV5<
  DataStorage,
  DataStorageMethodNames,
  DataStorageEventsContext,
  DataStorageEvents
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
export type DataStorageEvents = undefined;
export interface DataStorageEventsContext {}
export type DataStorageMethodNames =
  | 'new'
  | 'addAdmin'
  | 'addInductees'
  | 'addOperator'
  | 'admins'
  | 'appQuizzes'
  | 'checkAdmin'
  | 'delAdmin'
  | 'getAppAdmins'
  | 'getAppQuizIds'
  | 'getErc20Bank'
  | 'getEthBank'
  | 'getInductees'
  | 'getLotteries'
  | 'getLottery'
  | 'getLotteryCreator'
  | 'getLotteryResult'
  | 'getQuiz'
  | 'getQuizzes'
  | 'getShouldAwardQuizIds'
  | 'operators'
  | 'overLottery'
  | 'overQuiz'
  | 'owner'
  | 'setErc20Bank'
  | 'setEthBank'
  | 'setLottery'
  | 'setLotteryResult'
  | 'setQuiz'
  | 'transferOwner';
export interface LotteryResponse {
  token: string;
  0: string;
  amounts: BigNumber[];
  1: BigNumber[];
  fixedNum: BigNumber[];
  2: BigNumber[];
  proportionNum: BigNumber[];
  3: BigNumber[];
  totalAmount: BigNumber;
  4: BigNumber;
  isEth: boolean;
  5: boolean;
  over: boolean;
  6: boolean;
  exist: boolean;
  7: boolean;
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
export interface SetLotteryRequest {
  token: string;
  amounts: BigNumberish[];
  fixedNum: BigNumberish[];
  proportionNum: BigNumberish[];
  totalAmount: BigNumberish;
  isEth: boolean;
  over: boolean;
  exist: boolean;
}
export interface SetQuizRequest {
  id: BigNumberish;
  app_id: string;
  questions: string[];
  amount: BigNumberish;
  group: BigNumberish;
  botType: BigNumberish;
  exist: boolean;
  over: boolean;
  startTime: BigNumberish;
  activeTime: BigNumberish;
  title: string;
  photo: string;
  participate: BigNumberish;
}
export interface DataStorage {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   */
  'new'(overrides?: ContractTransactionOverrides): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _appId Type: string, Indexed: false
   * @param _admin Type: address, Indexed: false
   */
  addAdmin(
    _appId: string,
    _admin: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _quizId Type: uint256, Indexed: false
   * @param _inductees Type: address[], Indexed: false
   * @param _participate Type: uint256, Indexed: false
   */
  addInductees(
    _quizId: BigNumberish,
    _inductees: string[],
    _participate: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _newOperator Type: address, Indexed: false
   */
  addOperator(
    _newOperator: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: string, Indexed: false
   * @param parameter1 Type: uint256, Indexed: false
   */
  admins(
    parameter0: string,
    parameter1: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: string, Indexed: false
   * @param parameter1 Type: uint256, Indexed: false
   */
  appQuizzes(
    parameter0: string,
    parameter1: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _appId Type: string, Indexed: false
   * @param _sender Type: address, Indexed: false
   */
  checkAdmin(
    _appId: string,
    _sender: string,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _appId Type: string, Indexed: false
   * @param _delAdmin Type: address, Indexed: false
   */
  delAdmin(
    _appId: string,
    _delAdmin: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _appId Type: string, Indexed: false
   */
  getAppAdmins(
    _appId: string,
    overrides?: ContractCallOverrides
  ): Promise<string[]>;
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
   * @param _holder Type: address, Indexed: false
   * @param _token Type: address, Indexed: false
   */
  getErc20Bank(
    _holder: string,
    _token: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _holder Type: address, Indexed: false
   */
  getEthBank(
    _holder: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
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
   * @param _lotteryIds Type: uint256[], Indexed: false
   */
  getLotteries(
    _lotteryIds: BigNumberish[],
    overrides?: ContractCallOverrides
  ): Promise<LotteryResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _lotteryId Type: uint256, Indexed: false
   */
  getLottery(
    _lotteryId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<LotteryResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _lotteryId Type: uint256, Indexed: false
   */
  getLotteryCreator(
    _lotteryId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _lotteryId Type: uint256, Indexed: false
   * @param _index Type: uint256, Indexed: false
   */
  getLotteryResult(
    _lotteryId: BigNumberish,
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
   * @param _quizIds Type: uint256[], Indexed: false
   */
  getQuizzes(
    _quizIds: BigNumberish[],
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
   * @param parameter0 Type: address, Indexed: false
   */
  operators(
    parameter0: string,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _lotteryId Type: uint256, Indexed: false
   */
  overLottery(
    _lotteryId: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _quizId Type: uint256, Indexed: false
   */
  overQuiz(
    _quizId: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  owner(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _holder Type: address, Indexed: false
   * @param _token Type: address, Indexed: false
   * @param _amount Type: uint256, Indexed: false
   */
  setErc20Bank(
    _holder: string,
    _token: string,
    _amount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _holder Type: address, Indexed: false
   * @param _amount Type: uint256, Indexed: false
   */
  setEthBank(
    _holder: string,
    _amount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _creator Type: address, Indexed: false
   * @param _lotteryId Type: uint256, Indexed: false
   * @param _lottery Type: tuple, Indexed: false
   */
  setLottery(
    _creator: string,
    _lotteryId: BigNumberish,
    _lottery: SetLotteryRequest,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _lotteryId Type: uint256, Indexed: false
   * @param _index Type: uint256, Indexed: false
   * @param _winner Type: address[], Indexed: false
   */
  setLotteryResult(
    _lotteryId: BigNumberish,
    _index: BigNumberish,
    _winner: string[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _appId Type: string, Indexed: false
   * @param _quiz Type: tuple, Indexed: false
   */
  setQuiz(
    _appId: string,
    _quiz: SetQuizRequest,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
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
