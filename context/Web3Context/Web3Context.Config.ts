import { PoolFactory__factory } from '@tracer-protocol/perpetual-pools-contracts/types';
import { StakingRewards__factory } from '@libs/staking/typechain/factories/StakingRewards__factory';

import { ethers } from 'ethers';

// the vault address is the same on all networks
const BALANCER_VAULT_ADDRESS = '0xBA12222222228d8Ba445958a75a0704d566BF2C8';

type Farm = {
    address: string;
    abi: ethers.ContractInterface;
    pool: string;
    balancerPoolId?: string;
    link?: string;
    linkText?: string;
};

export type Network = {
    name: string;
    previewUrl: string;
    contracts: {
        [name: string]: {
            address: string | undefined;
            abi: ethers.ContractInterface;
        };
    };
    poolFarms: Farm[];
    bptFarms: Farm[];
    hex: string;
    publicRPC: string;
    graphUri: string;
    id: string;
    balancerVaultAddress: string;
    usdcAddress: string;
    // lookup from known token addresses to Chainink price feed address
    // https://docs.chain.link/docs/arbitrum-price-feeds/
    knownUSDCPriceFeeds: {
        [address: string]: string;
    };
    isArbitrum: boolean;
};
/**
 * Network store which allows swapping between networks and fetching from different data sources.
 * Keys are the ID of the network.
 * The 0 network is a default network when the user has not connected their address.
 *  The data sources for the 0 network are populated from the env variables.
 * The local config also uses the ENV variables so the commit history is not riddled with updates to
 *  this config.
 * Do not change the other network configs unless the contract addresses have changed.
 */
export const networkConfig: Record<string, Network> = {
    '0': {
        id: '0',
        previewUrl: '',
        name: 'Unknown',
        isArbitrum: false,
        contracts: {},
        poolFarms: [],
        bptFarms: [],
        publicRPC: '',
        hex: '0x0',
        graphUri: process.env.NEXT_PUBLIC_GRAPH_URI ?? '',
        balancerVaultAddress: BALANCER_VAULT_ADDRESS,
        usdcAddress: '',
        knownUSDCPriceFeeds: {},
    },
    '421611': {
        id: '421611',
        name: 'Arbitrum Rinkeby',
        isArbitrum: true,
        previewUrl: 'https://rinkeby-explorer.arbitrum.io/#',
        contracts: {
            poolFactory: {
                address: '0x69D044eCf45500882FdA0A796744231b1Fb5eFD5',
                abi: PoolFactory__factory.abi,
            },
        },
        poolFarms: [
            {
                address: '0xa39fA0857D5967E6Ab3A247b179C474cFE5415A9',
                pool: '',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0x6213c21518EF9d4875d9C41F7ad8d16B4f986cB2',
                pool: '',
                abi: StakingRewards__factory.abi,
            },
        ],
        bptFarms: [],
        hex: '0x66EEB',
        // publicRPC: 'https://rinkeby.arbitrum.io/rpc',
        publicRPC: 'https://arb-rinkeby.g.alchemy.com/v2/1ubMUPL8G2qKC9mowTJ718HCY4Hq4PCx',
        graphUri: 'https://api.thegraph.com/subgraphs/name/tracer-protocol/tracer-arbitrum',
        balancerVaultAddress: BALANCER_VAULT_ADDRESS,
        usdcAddress: '',
        knownUSDCPriceFeeds: {},
    },
    '42161': {
        id: '42161',
        name: 'Arbitrum',
        isArbitrum: true,
        previewUrl: 'https://explorer.arbitrum.io/#',
        contracts: {
            poolFactory: {
                address: '0x98C58c1cEb01E198F8356763d5CbA8EB7b11e4E2',
                abi: PoolFactory__factory.abi,
            },
        },
        poolFarms: [
            {
                address: '0xA2bACCD1AA980f80b37BC950CE3eE2d5816d7EC0', // 1-BTC/USDC-long
                pool: '0x146808f54DB24Be2902CA9f595AD8f27f56B2E76',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0xD04dDCAEca6bf283A430Cb9E847CEEd5Da419Fa0', // 1-BTC/USDC-short
                pool: '0x146808f54DB24Be2902CA9f595AD8f27f56B2E76',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0xEb05e160D3C1990719aa25d74294783fE4e3D3Ef', // 3-BTC/USD-long
                pool: '0x70988060e1FD9bbD795CA097A09eA1539896Ff5D',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0xeA4FF5ED11F93AA0Ce7744B1D40093f52eA1cda8', // 3-BTC/USDC-short
                pool: '0x70988060e1FD9bbD795CA097A09eA1539896Ff5D',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0xA18413dC5506A91138e0604C283E36B021b8849B', // 1-ETH/USDC-long
                pool: '0x3A52aD74006D927e3471746D4EAC73c9366974Ee',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0x9769F208239C740cC40E9CB3427c34513213B83f', // 1-ETH/USDC-short
                pool: '0x3A52aD74006D927e3471746D4EAC73c9366974Ee',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0x07cCcDC913bCbab246fC6E38E81b0C53AaB3De9b', // 3-ETH/USDC-long
                pool: '0x54114e9e1eEf979070091186D7102805819e916B',
                abi: StakingRewards__factory.abi,
            },
            {
                address: '0xE1c9C69a26BD5c6E4b39E6870a4a2B01b4e033bC', // 3-ETH/USDC-short
                pool: '0x54114e9e1eEf979070091186D7102805819e916B',
                abi: StakingRewards__factory.abi,
            },
        ],
        bptFarms: [
            {
                // 50 wETH 33 3S-ETH 17 3L-ETH
                address: '0x06F0A46Ba44de4f5AA327237b0b3A1610f125d8f',
                balancerPoolId: '0x996616bde0cb4974e571f17d31c844da2bd177f8000100000000000000000018',
                pool: '0x54114e9e1eEf979070091186D7102805819e916B',
                abi: StakingRewards__factory.abi,
                link: 'https://arbitrum.balancer.fi/#/pool/0x996616bde0cb4974e571f17d31c844da2bd177f8000100000000000000000018',
            },
            {
                // 50 wBTC 33 3S-BTC 17 3L-BTC
                address: '0xdbEA4B2F086D0e7259Ff84d2A088896E8Adb79Cf',
                balancerPoolId: '0xcf3ae4b9235b1c203457e472a011c12c3a2fde93000100000000000000000019',
                pool: '0x70988060e1FD9bbD795CA097A09eA1539896Ff5D',
                abi: StakingRewards__factory.abi,
                link: 'https://arbitrum.balancer.fi/#/pool/0xcf3ae4b9235b1c203457e472a011c12c3a2fde93000100000000000000000019',
            },
            {
                // 33 1S-ETH 33 1L-ETH 33 USDC
                address: '0xBcA90fe2c8cc273Bb4ba1147FAdA3097f9316F9c',
                balancerPoolId: '0x6ee86e032173716a41818e6d6d320a752176d69700010000000000000000001c',
                pool: '0x3A52aD74006D927e3471746D4EAC73c9366974Ee',
                abi: StakingRewards__factory.abi,
                link: 'https://arbitrum.balancer.fi/#/pool/0x6ee86e032173716a41818e6d6d320a752176d69700010000000000000000001c',
            },
            {
                // 33 1S-BTC 33 1L-BTC 33 USDC
                address: '0xB8d52DE47a6C3a3A5679A72f2f7c05b30A9B5309',
                balancerPoolId: '0x17a35e3d578797e34131d10e66c11170848c6da100010000000000000000001d',
                pool: '0x146808f54DB24Be2902CA9f595AD8f27f56B2E76',
                abi: StakingRewards__factory.abi,
                link: 'https://arbitrum.balancer.fi/#/pool/0x17a35e3d578797e34131d10e66c11170848c6da100010000000000000000001d',
            },
        ],
        hex: '0xA4B1',
        publicRPC: 'https://arb1.arbitrum.io/rpc',
        graphUri: 'TODO',
        balancerVaultAddress: BALANCER_VAULT_ADDRESS,
        usdcAddress: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
        knownUSDCPriceFeeds: {
            // wBTC: BTC/USD
            '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f': '0x6ce185860a4963106506C203335A2910413708e9',
            // wETH: ETH/USD
            '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1': '0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612',
        },
    },
    '1337': {
        id: '1337',
        name: 'Local',
        isArbitrum: false,
        previewUrl: '',
        contracts: {
            poolFactory: {
                address: process.env.NEXT_PUBLIC_POOL_FACTORY_ADDRESS,
                abi: PoolFactory__factory.abi,
            },
        },
        hex: '',
        poolFarms: [],
        bptFarms: [],
        publicRPC: '',
        graphUri: 'http://localhost:8000/subgraphs/name/dospore/tracer-graph',
        balancerVaultAddress: BALANCER_VAULT_ADDRESS,
        usdcAddress: '',
        knownUSDCPriceFeeds: {},
    },
    '1': {
        // TODO: fill this out properly
        id: '1',
        name: 'Mainnet',
        isArbitrum: false,
        previewUrl: '',
        contracts: {
            poolFactory: {
                address: process.env.NEXT_PUBLIC_POOL_FACTORY_ADDRESS,
                abi: PoolFactory__factory.abi,
            },
        },
        hex: '0x1',
        poolFarms: [],
        bptFarms: [],
        publicRPC: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
        graphUri: 'http://localhost:8000/subgraphs/name/dospore/tracer-graph',
        balancerVaultAddress: BALANCER_VAULT_ADDRESS,
        usdcAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        knownUSDCPriceFeeds: {},
    },
    '4': {
        // TODO: fill this out properly
        id: '4',
        name: 'Rinkeby',
        isArbitrum: false,
        previewUrl: '',
        contracts: {
            poolFactory: {
                address: process.env.NEXT_PUBLIC_POOL_FACTORY_ADDRESS,
                abi: PoolFactory__factory.abi,
            },
        },
        hex: '0x4',
        poolFarms: [],
        bptFarms: [],
        publicRPC: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
        graphUri: 'http://localhost:8000/subgraphs/name/dospore/tracer-graph',
        balancerVaultAddress: BALANCER_VAULT_ADDRESS,
        usdcAddress: '0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b',
        knownUSDCPriceFeeds: {},
    },
};
