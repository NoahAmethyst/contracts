import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from 'ethers';
import { EthersContractContextV5 } from 'ethereum-abi-types-generator';

export type ContractContext = EthersContractContextV5<
  IDataStorage,
  IDataStorageMethodNames,
  IDataStorageEventsContext,
  IDataStorageEvents
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
export type IDataStorageEvents = undefined;
export interface IDataStorageEventsContext {}
export type IDataStorageMethodNames =
  | 'addInductees'
  | 'checkAdmin'
  | 'getAppQuizIds'
  | 'getInductees'
  | 'getLotteryResult'
  | 'getQuiz'
  | 'getQuizzes'
  | 'getShouldAwardQuizIds'
  | 'overQuiz'
  | 'setQuiz';
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
export interface IDataStorage {
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
  getLotteryResult(
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
}
