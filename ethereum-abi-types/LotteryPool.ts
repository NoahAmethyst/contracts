import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from 'ethers';
import { EthersContractContextV5 } from 'ethereum-abi-types-generator';

export type ContractContext = EthersContractContextV5<
  LotteryPool,
  LotteryPoolMethodNames,
  LotteryPoolEventsContext,
  LotteryPoolEvents
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
export type LotteryPoolEvents = undefined;
export interface LotteryPoolEventsContext {}
export type LotteryPoolMethodNames =
  | 'new'
  | 'addOperator'
  | 'changeStorage'
  | 'createEthLottery'
  | 'createLottery'
  | 'dataStorage'
  | 'drawALottery'
  | 'getErc20List'
  | 'getLotteries'
  | 'getLottery'
  | 'getLotteryResults'
  | 'operators'
  | 'owner'
  | 'transferAsset'
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
export interface LotteryPool {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   * @param _operator Type: address, Indexed: false
   * @param _storage Type: address, Indexed: false
   */
  'new'(
    _operator: string,
    _storage: string,
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
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _newStorage Type: address, Indexed: false
   */
  changeStorage(
    _newStorage: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param _appId Type: string, Indexed: false
   * @param _lotteryId Type: uint256, Indexed: false
   * @param _fixedNum Type: uint256[], Indexed: false
   * @param _proportionNum Type: uint256[], Indexed: false
   * @param _amounts Type: uint256[], Indexed: false
   */
  createEthLottery(
    _appId: string,
    _lotteryId: BigNumberish,
    _fixedNum: BigNumberish[],
    _proportionNum: BigNumberish[],
    _amounts: BigNumberish[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _appId Type: string, Indexed: false
   * @param _lotteryId Type: uint256, Indexed: false
   * @param _rewardToken Type: address, Indexed: false
   * @param _fixedNum Type: uint256[], Indexed: false
   * @param _proportionNum Type: uint256[], Indexed: false
   * @param _amounts Type: uint256[], Indexed: false
   */
  createLottery(
    _appId: string,
    _lotteryId: BigNumberish,
    _rewardToken: string,
    _fixedNum: BigNumberish[],
    _proportionNum: BigNumberish[],
    _amounts: BigNumberish[],
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
   * @param _lotteryId Type: uint256, Indexed: false
   */
  drawALottery(
    _lotteryId: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getErc20List(overrides?: ContractCallOverrides): Promise<string[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _ids Type: uint256[], Indexed: false
   */
  getLotteries(
    _ids: BigNumberish[],
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
   * @param _index Type: uint256, Indexed: false
   */
  getLotteryResults(
    _lotteryId: BigNumberish,
    _index: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<string[]>;
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
   * @param _to Type: address, Indexed: false
   */
  transferAsset(
    _to: string,
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
