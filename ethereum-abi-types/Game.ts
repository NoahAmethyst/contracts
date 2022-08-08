import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from 'ethers';
import { EthersContractContextV5 } from 'ethereum-abi-types-generator';

export type ContractContext = EthersContractContextV5<
  Game,
  GameMethodNames,
  GameEventsContext,
  GameEvents
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
export type GameEvents = undefined;
export interface GameEventsContext {}
export type GameMethodNames =
  | 'new'
  | 'addAppOperator'
  | 'adminData'
  | 'buffToken'
  | 'buffValue'
  | 'buyBuff'
  | 'buyErc20Ticket'
  | 'buyEthTicket'
  | 'changeAdminData'
  | 'changeBuffToken'
  | 'changeBuffValue'
  | 'changeGameData'
  | 'changeOperator'
  | 'createGame'
  | 'delAppOperator'
  | 'erc20Exist'
  | 'erc20List'
  | 'gameData'
  | 'gameRoundOver'
  | 'isOperator'
  | 'operator'
  | 'owner'
  | 'startGame'
  | 'transferAsset'
  | 'transferOwner';
export interface CreateGameRequest {
  id: BigNumberish;
  category: BigNumberish;
  appId: string;
  groupId: BigNumberish;
  botType: BigNumberish;
  title: string;
  introduction: string;
  story: string;
  eliminateProportion: BigNumberish;
  awardProportion: BigNumberish;
  winNum: BigNumberish;
  buffIds: BigNumberish[];
  events: string[];
  ticketIsEth: boolean;
  ticketsToken: string;
  ticketAmount: BigNumberish;
  effectStartTime: BigNumberish;
  effectEndTime: BigNumberish;
  daily: boolean;
  startH: BigNumberish;
  startM: BigNumberish;
  exist: boolean;
  creator: string;
}
export interface Game {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   * @param _operator Type: address, Indexed: false
   * @param _adminData Type: address, Indexed: false
   * @param _gameData Type: address, Indexed: false
   * @param _buffToken Type: address, Indexed: false
   * @param _buffValue Type: uint256, Indexed: false
   */
  'new'(
    _operator: string,
    _adminData: string,
    _gameData: string,
    _buffToken: string,
    _buffValue: BigNumberish,
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
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  adminData(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  buffToken(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  buffValue(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _gameId Type: uint256, Indexed: false
   * @param _round Type: uint256, Indexed: false
   * @param _buffId Type: uint256, Indexed: false
   */
  buyBuff(
    _gameId: BigNumberish,
    _round: BigNumberish,
    _buffId: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _gameId Type: uint256, Indexed: false
   * @param _round Type: uint256, Indexed: false
   */
  buyErc20Ticket(
    _gameId: BigNumberish,
    _round: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param _gameId Type: uint256, Indexed: false
   * @param _round Type: uint256, Indexed: false
   */
  buyEthTicket(
    _gameId: BigNumberish,
    _round: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _newData Type: address, Indexed: false
   */
  changeAdminData(
    _newData: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _newToken Type: address, Indexed: false
   */
  changeBuffToken(
    _newToken: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _newValue Type: uint256, Indexed: false
   */
  changeBuffValue(
    _newValue: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _newData Type: address, Indexed: false
   */
  changeGameData(
    _newData: string,
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
   * @param _game Type: tuple, Indexed: false
   */
  createGame(
    _game: CreateGameRequest,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _appId Type: string, Indexed: false
   */
  delAppOperator(
    _appId: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: address, Indexed: false
   */
  erc20Exist(
    parameter0: string,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   */
  erc20List(
    parameter0: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  gameData(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _appId Type: string, Indexed: false
   * @param _gameId Type: uint256, Indexed: false
   * @param _round Type: uint256, Indexed: false
   */
  gameRoundOver(
    _appId: string,
    _gameId: BigNumberish,
    _round: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _appId Type: string, Indexed: false
   */
  isOperator(
    _appId: string,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
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
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param _appId Type: string, Indexed: false
   * @param _gameId Type: uint256, Indexed: false
   * @param _launchTime Type: uint256, Indexed: false
   */
  startGame(
    _appId: string,
    _gameId: BigNumberish,
    _launchTime: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
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
