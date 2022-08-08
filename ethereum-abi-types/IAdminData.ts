import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from 'ethers';
import { EthersContractContextV5 } from 'ethereum-abi-types-generator';

export type ContractContext = EthersContractContextV5<
  IAdminData,
  IAdminDataMethodNames,
  IAdminDataEventsContext,
  IAdminDataEvents
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
export type IAdminDataEvents = undefined;
export interface IAdminDataEventsContext {}
export type IAdminDataMethodNames = 'checkAdmin';
export interface IAdminData {
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
}
