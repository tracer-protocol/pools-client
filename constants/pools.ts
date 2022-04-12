import { BigNumber } from 'bignumber.js';
import { KnownNetwork } from '@tracer-protocol/pools-js';
import { NETWORKS } from '@tracer-protocol/pools-js';
import Pool from '@tracer-protocol/pools-js/entities/pool';
import { PoolInfo } from '~/types/pools';

export const DEFAULT_POOLSTATE: PoolInfo = {
    poolInstance: Pool.CreateDefault(),
    userBalances: {
        shortToken: {
            approvedAmount: new BigNumber(0),
            balance: new BigNumber(0),
        },
        longToken: {
            approvedAmount: new BigNumber(0),
            balance: new BigNumber(0),
        },
        settlementToken: {
            approvedAmount: new BigNumber(0),
            balance: new BigNumber(0),
        },
        aggregateBalances: {
            longTokens: new BigNumber(0),
            shortTokens: new BigNumber(0),
            settlementTokens: new BigNumber(0),
        },
    },
    upkeepInfo: {
        isWaitingForUpkeep: false,
        expectedExecution: Math.floor(Date.now() / 1000),
    },
};

export interface PoolListMap {
    Tracer: {
        verified: string;
        factoryDeployed?: string;
    };
    External: string[];
}

type TokenListMapByNetwork = Partial<Record<KnownNetwork, PoolListMap>>;

/**
 * Mapping of the TokenLists used on each network
 */
export const POOL_LIST_MAP: TokenListMapByNetwork = {
    [NETWORKS.ARBITRUM]: {
        Tracer: {
            verified: 'https://api.tracer.finance/poolsv2/poolList?network=42161',
        },
        External: [],
    },
    [NETWORKS.ARBITRUM_RINKEBY]: {
        Tracer: {
            verified: 'https://api.tracer.finance/poolsv2/poolList?network=421611',
        },
        External: [],
    },
};

export const TCR_DECIMALS = 18;
export const USDC_DECIMALS = 6;