/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface PoolKeeperInterface extends ethers.utils.Interface {
  functions: {
    "BASE_TIP()": FunctionFragment;
    "BLOCK_TIME()": FunctionFragment;
    "MAX_DECIMALS()": FunctionFragment;
    "TIP_DELTA_PER_BLOCK()": FunctionFragment;
    "checkUpkeepMultiplePools(address[])": FunctionFragment;
    "checkUpkeepSinglePool(address)": FunctionFragment;
    "executionPrice(address)": FunctionFragment;
    "factory()": FunctionFragment;
    "keeperGas(address,uint256,uint256)": FunctionFragment;
    "keeperReward(address,uint256,uint256,uint256,uint256)": FunctionFragment;
    "keeperTip(uint256,uint256)": FunctionFragment;
    "newPool(address)": FunctionFragment;
    "owner()": FunctionFragment;
    "performUpkeepMultiplePools(address[])": FunctionFragment;
    "performUpkeepSinglePool(address)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setFactory(address)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "BASE_TIP", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "BLOCK_TIME",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "MAX_DECIMALS",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "TIP_DELTA_PER_BLOCK",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "checkUpkeepMultiplePools",
    values: [string[]]
  ): string;
  encodeFunctionData(
    functionFragment: "checkUpkeepSinglePool",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "executionPrice",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "factory", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "keeperGas",
    values: [string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "keeperReward",
    values: [string, BigNumberish, BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "keeperTip",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "newPool", values: [string]): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "performUpkeepMultiplePools",
    values: [string[]]
  ): string;
  encodeFunctionData(
    functionFragment: "performUpkeepSinglePool",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "setFactory", values: [string]): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;

  decodeFunctionResult(functionFragment: "BASE_TIP", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "BLOCK_TIME", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "MAX_DECIMALS",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "TIP_DELTA_PER_BLOCK",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "checkUpkeepMultiplePools",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "checkUpkeepSinglePool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "executionPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "factory", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "keeperGas", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "keeperReward",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "keeperTip", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "newPool", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "performUpkeepMultiplePools",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "performUpkeepSinglePool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setFactory", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "KeeperPaid(address,address,uint256)": EventFragment;
    "KeeperPaymentError(address,address,uint256)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "PoolAdded(address,int256)": EventFragment;
    "PoolUpkeepError(address,string)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "KeeperPaid"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "KeeperPaymentError"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PoolAdded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PoolUpkeepError"): EventFragment;
}

export class PoolKeeper extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: PoolKeeperInterface;

  functions: {
    BASE_TIP(overrides?: CallOverrides): Promise<[BigNumber]>;

    BLOCK_TIME(overrides?: CallOverrides): Promise<[BigNumber]>;

    MAX_DECIMALS(overrides?: CallOverrides): Promise<[BigNumber]>;

    TIP_DELTA_PER_BLOCK(overrides?: CallOverrides): Promise<[BigNumber]>;

    checkUpkeepMultiplePools(
      _pools: string[],
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    checkUpkeepSinglePool(
      _pool: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    executionPrice(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    factory(overrides?: CallOverrides): Promise<[string]>;

    keeperGas(
      _pool: string,
      _gasPrice: BigNumberish,
      _gasSpent: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    keeperReward(
      _pool: string,
      _gasPrice: BigNumberish,
      _gasSpent: BigNumberish,
      _savedPreviousUpdatedTimestamp: BigNumberish,
      _poolInterval: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    keeperTip(
      _savedPreviousUpdatedTimestamp: BigNumberish,
      _poolInterval: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    newPool(
      _poolAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    performUpkeepMultiplePools(
      pools: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    performUpkeepSinglePool(
      _pool: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setFactory(
      _factory: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  BASE_TIP(overrides?: CallOverrides): Promise<BigNumber>;

  BLOCK_TIME(overrides?: CallOverrides): Promise<BigNumber>;

  MAX_DECIMALS(overrides?: CallOverrides): Promise<BigNumber>;

  TIP_DELTA_PER_BLOCK(overrides?: CallOverrides): Promise<BigNumber>;

  checkUpkeepMultiplePools(
    _pools: string[],
    overrides?: CallOverrides
  ): Promise<boolean>;

  checkUpkeepSinglePool(
    _pool: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  executionPrice(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  factory(overrides?: CallOverrides): Promise<string>;

  keeperGas(
    _pool: string,
    _gasPrice: BigNumberish,
    _gasSpent: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  keeperReward(
    _pool: string,
    _gasPrice: BigNumberish,
    _gasSpent: BigNumberish,
    _savedPreviousUpdatedTimestamp: BigNumberish,
    _poolInterval: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  keeperTip(
    _savedPreviousUpdatedTimestamp: BigNumberish,
    _poolInterval: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  newPool(
    _poolAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  performUpkeepMultiplePools(
    pools: string[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  performUpkeepSinglePool(
    _pool: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setFactory(
    _factory: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    BASE_TIP(overrides?: CallOverrides): Promise<BigNumber>;

    BLOCK_TIME(overrides?: CallOverrides): Promise<BigNumber>;

    MAX_DECIMALS(overrides?: CallOverrides): Promise<BigNumber>;

    TIP_DELTA_PER_BLOCK(overrides?: CallOverrides): Promise<BigNumber>;

    checkUpkeepMultiplePools(
      _pools: string[],
      overrides?: CallOverrides
    ): Promise<boolean>;

    checkUpkeepSinglePool(
      _pool: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    executionPrice(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    factory(overrides?: CallOverrides): Promise<string>;

    keeperGas(
      _pool: string,
      _gasPrice: BigNumberish,
      _gasSpent: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    keeperReward(
      _pool: string,
      _gasPrice: BigNumberish,
      _gasSpent: BigNumberish,
      _savedPreviousUpdatedTimestamp: BigNumberish,
      _poolInterval: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    keeperTip(
      _savedPreviousUpdatedTimestamp: BigNumberish,
      _poolInterval: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    newPool(_poolAddress: string, overrides?: CallOverrides): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    performUpkeepMultiplePools(
      pools: string[],
      overrides?: CallOverrides
    ): Promise<void>;

    performUpkeepSinglePool(
      _pool: string,
      overrides?: CallOverrides
    ): Promise<void>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setFactory(_factory: string, overrides?: CallOverrides): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    KeeperPaid(
      _pool?: string | null,
      keeper?: string | null,
      reward?: null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { _pool: string; keeper: string; reward: BigNumber }
    >;

    KeeperPaymentError(
      _pool?: string | null,
      keeper?: string | null,
      expectedReward?: null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { _pool: string; keeper: string; expectedReward: BigNumber }
    >;

    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;

    PoolAdded(
      poolAddress?: string | null,
      firstPrice?: BigNumberish | null
    ): TypedEventFilter<
      [string, BigNumber],
      { poolAddress: string; firstPrice: BigNumber }
    >;

    PoolUpkeepError(
      pool?: string | null,
      reason?: null
    ): TypedEventFilter<[string, string], { pool: string; reason: string }>;
  };

  estimateGas: {
    BASE_TIP(overrides?: CallOverrides): Promise<BigNumber>;

    BLOCK_TIME(overrides?: CallOverrides): Promise<BigNumber>;

    MAX_DECIMALS(overrides?: CallOverrides): Promise<BigNumber>;

    TIP_DELTA_PER_BLOCK(overrides?: CallOverrides): Promise<BigNumber>;

    checkUpkeepMultiplePools(
      _pools: string[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    checkUpkeepSinglePool(
      _pool: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    executionPrice(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    factory(overrides?: CallOverrides): Promise<BigNumber>;

    keeperGas(
      _pool: string,
      _gasPrice: BigNumberish,
      _gasSpent: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    keeperReward(
      _pool: string,
      _gasPrice: BigNumberish,
      _gasSpent: BigNumberish,
      _savedPreviousUpdatedTimestamp: BigNumberish,
      _poolInterval: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    keeperTip(
      _savedPreviousUpdatedTimestamp: BigNumberish,
      _poolInterval: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    newPool(
      _poolAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    performUpkeepMultiplePools(
      pools: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    performUpkeepSinglePool(
      _pool: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setFactory(
      _factory: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    BASE_TIP(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    BLOCK_TIME(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    MAX_DECIMALS(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    TIP_DELTA_PER_BLOCK(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    checkUpkeepMultiplePools(
      _pools: string[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    checkUpkeepSinglePool(
      _pool: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    executionPrice(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    factory(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    keeperGas(
      _pool: string,
      _gasPrice: BigNumberish,
      _gasSpent: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    keeperReward(
      _pool: string,
      _gasPrice: BigNumberish,
      _gasSpent: BigNumberish,
      _savedPreviousUpdatedTimestamp: BigNumberish,
      _poolInterval: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    keeperTip(
      _savedPreviousUpdatedTimestamp: BigNumberish,
      _poolInterval: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    newPool(
      _poolAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    performUpkeepMultiplePools(
      pools: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    performUpkeepSinglePool(
      _pool: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setFactory(
      _factory: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
