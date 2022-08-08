import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from 'ethers';
import { EthersContractContextV5 } from 'ethereum-abi-types-generator';

export type ContractContext = EthersContractContextV5<
  GameDataStorage,
  GameDataStorageMethodNames,
  GameDataStorageEventsContext,
  GameDataStorageEvents
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
export type GameDataStorageEvents = undefined;
export interface GameDataStorageEventsContext {}
export type GameDataStorageMethodNames =
  | 'new'
  | 'addBuffPlayers'
  | 'addOperator'
  | 'addPlayer'
  | 'availableSize'
  | 'delOperator'
  | 'editGameRound'
  | 'getAppGames'
  | 'getAvailiableGameIds'
  | 'getBuffPlayers'
  | 'getGame'
  | 'getGameIds'
  | 'getGameLatestRoundNum'
  | 'getGameRound'
  | 'getGameRoundList'
  | 'getGames'
  | 'getPlayers'
  | 'getTicketsPool'
  | 'initGameRound'
  | 'operators'
  | 'owner'
  | 'setAvailableSize'
  | 'setBuffPlayers'
  | 'setGame'
  | 'setPlayers'
  | 'transferOwner';
export interface EditGameRoundRequest {
  gameId: BigNumberish;
  winners: string[];
  participate: BigNumberish;
  sponsor: string;
  launchTime: BigNumberish;
  eliminatePlayerIndexes: BigNumberish[];
  buffUsersIndexes: BigNumberish[];
  eventsIndexes: BigNumberish[];
  over: boolean;
  exist: boolean;
}
export interface GamedetailResponse {
  id: BigNumber;
  0: BigNumber;
  category: BigNumber;
  1: BigNumber;
  appId: string;
  2: string;
  groupId: BigNumber;
  3: BigNumber;
  botType: BigNumber;
  4: BigNumber;
  title: string;
  5: string;
  introduction: string;
  6: string;
  story: string;
  7: string;
  eliminateProportion: BigNumber;
  8: BigNumber;
  awardProportion: BigNumber;
  9: BigNumber;
  winNum: BigNumber;
  10: BigNumber;
  buffIds: BigNumber[];
  11: BigNumber[];
  events: string[];
  12: string[];
  ticketIsEth: boolean;
  13: boolean;
  ticketsToken: string;
  14: string;
  ticketAmount: BigNumber;
  15: BigNumber;
  effectStartTime: BigNumber;
  16: BigNumber;
  effectEndTime: BigNumber;
  17: BigNumber;
  daily: boolean;
  18: boolean;
  startH: BigNumber;
  19: BigNumber;
  startM: BigNumber;
  20: BigNumber;
  exist: boolean;
  21: boolean;
  creator: string;
  22: string;
}
export interface GameroundResponse {
  gameId: BigNumber;
  0: BigNumber;
  winners: string[];
  1: string[];
  participate: BigNumber;
  2: BigNumber;
  sponsor: string;
  3: string;
  launchTime: BigNumber;
  4: BigNumber;
  eliminatePlayerIndexes: BigNumber[];
  5: BigNumber[];
  buffUsersIndexes: BigNumber[];
  6: BigNumber[];
  eventsIndexes: BigNumber[];
  7: BigNumber[];
  over: boolean;
  8: boolean;
  exist: boolean;
  9: boolean;
}
export interface SetGameRequest {
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
export interface GameDataStorage {
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
   * @param _gameId Type: uint256, Indexed: false
   * @param _round Type: uint256, Indexed: false
   * @param _index Type: uint256, Indexed: false
   */
  addBuffPlayers(
    _gameId: BigNumberish,
    _round: BigNumberish,
    _index: BigNumberish,
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
   * @param _gameId Type: uint256, Indexed: false
   * @param _round Type: uint256, Indexed: false
   * @param _player Type: address, Indexed: false
   */
  addPlayer(
    _gameId: BigNumberish,
    _round: BigNumberish,
    _player: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  availableSize(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _removeOperator Type: address, Indexed: false
   */
  delOperator(
    _removeOperator: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _gameId Type: uint256, Indexed: false
   * @param _round Type: uint256, Indexed: false
   * @param _gameRound Type: tuple, Indexed: false
   */
  editGameRound(
    _gameId: BigNumberish,
    _round: BigNumberish,
    _gameRound: EditGameRoundRequest,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _appId Type: string, Indexed: false
   */
  getAppGames(
    _appId: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getAvailiableGameIds(overrides?: ContractCallOverrides): Promise<BigNumber[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _gameId Type: uint256, Indexed: false
   * @param _round Type: uint256, Indexed: false
   */
  getBuffPlayers(
    _gameId: BigNumberish,
    _round: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _id Type: uint256, Indexed: false
   */
  getGame(
    _id: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<GamedetailResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getGameIds(overrides?: ContractCallOverrides): Promise<BigNumber[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _gameId Type: uint256, Indexed: false
   */
  getGameLatestRoundNum(
    _gameId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _gameId Type: uint256, Indexed: false
   * @param _round Type: uint256, Indexed: false
   */
  getGameRound(
    _gameId: BigNumberish,
    _round: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<GameroundResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _gameId Type: uint256, Indexed: false
   */
  getGameRoundList(
    _gameId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<GameroundResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _ids Type: uint256[], Indexed: false
   */
  getGames(
    _ids: BigNumberish[],
    overrides?: ContractCallOverrides
  ): Promise<GamedetailResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _gameId Type: uint256, Indexed: false
   * @param _ground Type: uint256, Indexed: false
   */
  getPlayers(
    _gameId: BigNumberish,
    _ground: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<string[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _gameId Type: uint256, Indexed: false
   * @param _round Type: uint256, Indexed: false
   */
  getTicketsPool(
    _gameId: BigNumberish,
    _round: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _gameId Type: uint256, Indexed: false
   * @param _sponsor Type: address, Indexed: false
   * @param _launchTime Type: uint256, Indexed: false
   */
  initGameRound(
    _gameId: BigNumberish,
    _sponsor: string,
    _launchTime: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
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
   * @param _newSize Type: uint256, Indexed: false
   */
  setAvailableSize(
    _newSize: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _gameId Type: uint256, Indexed: false
   * @param _round Type: uint256, Indexed: false
   * @param _indexes Type: uint256[], Indexed: false
   */
  setBuffPlayers(
    _gameId: BigNumberish,
    _round: BigNumberish,
    _indexes: BigNumberish[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _appId Type: string, Indexed: false
   * @param _game Type: tuple, Indexed: false
   */
  setGame(
    _appId: string,
    _game: SetGameRequest,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _gameId Type: uint256, Indexed: false
   * @param _round Type: uint256, Indexed: false
   * @param _players Type: address[], Indexed: false
   */
  setPlayers(
    _gameId: BigNumberish,
    _round: BigNumberish,
    _players: string[],
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
