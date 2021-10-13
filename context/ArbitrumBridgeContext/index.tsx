import React, { useContext, useEffect, useState, useMemo } from 'react';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { useWeb3 } from '../Web3Context/Web3Context';
import { networkConfig, Network } from '../Web3Context/Web3Context.Config';
import { useTransactionContext } from '../TransactionContext';
import { ERC20__factory, ERC20 } from '@tracer-protocol/perpetual-pools-contracts/types';
import { destinationNetworkLookup, bridgeableTokens, bridgeableTickers } from '../../libs/utils/bridge';
import { Bridge, L1TokenData, L2TokenData, Inbox__factory } from 'arb-ts';
import { Children } from '@libs/types/General';

import { BridgeableAsset, BridgeableBalances } from '../../libs/types/General';
import { ARBITRUM, MAINNET, MAX_SOL_UINT } from '@libs/constants';
interface ArbitrumBridgeProps {
    bridgeToken: (tokenAddress: string, amount: BigNumber, onSuccess: () => void) => void;
    bridgeEth: (amount: BigNumber, onSuccess: () => void) => void;
    approveToken: (tokenAddress: string, spender: string) => void;
    refreshBridgeableBalance: (asset: BridgeableAsset) => Promise<void>;
    fromNetwork: Network;
    toNetwork: Network;
    bridgeableTokenList: typeof bridgeableTokens[string];
    bridgeableAssetList: BridgeableAsset[];
    bridgeableBalances: BridgeableBalances;
    showBridgeModal: () => void;
    hideBridgeModal: () => void;
    bridgeModalIsOpen: boolean;
}

export const ArbitrumBridgeContext = React.createContext<ArbitrumBridgeProps>({
    bridgeToken: (tokenAddress: string, amount: BigNumber) =>
        console.debug(`arbitrumBridge.bridgeToken not ready`, tokenAddress, amount),
    bridgeEth: (amount: BigNumber, onSuccess: () => void) =>
        console.debug(`arbitrumBridge.bridgeEth not ready`, amount, onSuccess),
    approveToken: (tokenAddress: string, spender: string) =>
        console.debug(`arbitrumBridge.approve not ready`, tokenAddress, spender),
    refreshBridgeableBalance: async (asset: BridgeableAsset) =>
        console.debug(`arbitrumBridge.refreshBridgeableBalance not ready`, asset),
    fromNetwork: networkConfig[MAINNET],
    toNetwork: networkConfig[ARBITRUM],
    bridgeableTokenList: [],
    bridgeableAssetList: [],
    bridgeableBalances: {},
    showBridgeModal: () => console.debug('arbitrumBridge.showBridgeModal not ready'),
    hideBridgeModal: () => console.debug('arbitrumBridge.hideBridgeModal not ready'),
    bridgeModalIsOpen: false,
});

const BRIDGEABLE_ASSET_ETH = {
    name: 'Ethereum',
    symbol: bridgeableTickers.ETH,
    address: null,
    displayDecimals: 6,
    decimals: 18,
};

export const ArbitrumBridgeStore: React.FC = ({ children }: Children) => {
    const { account, signer, provider, network = 1 } = useWeb3();
    const { handleTransaction } = useTransactionContext();
    const [bridgeableBalances, setBridgeableBalances] = useState<BridgeableBalances>({});
    const [bridgeModalIsOpen, setBridgeModalIsOpen] = useState(false);
    const [bridge, setBridge] = useState<Bridge | null>(null);

    const fromNetwork = useMemo(() => networkConfig[network], [network]);
    const toNetwork = useMemo(() => networkConfig[destinationNetworkLookup[network]], [network]);

    const bridgeableTokenList = useMemo(() => bridgeableTokens[network], [network]);

    const bridgeableAssetList: BridgeableAsset[] = useMemo(() => {
        if (!toNetwork) {
            return [];
        }
        return [...bridgeableTokenList, BRIDGEABLE_ASSET_ETH];
    }, [bridgeableTokenList]);

    useEffect(() => {
        if (!provider) {
            return;
        }

        if (!account) {
            return;
        }

        if (!fromNetwork || !toNetwork) {
            return;
        }

        const createBridge = async () => {
            // await provider._networkPromise;

            const ethSigner = fromNetwork.isArbitrum
                ? new ethers.providers.JsonRpcProvider(toNetwork.publicRPC).getSigner(account)
                : provider.getSigner(account);

            const arbSigner = fromNetwork.isArbitrum
                ? provider.getSigner(account)
                : new ethers.providers.JsonRpcProvider(toNetwork.publicRPC).getSigner(account);

            const bridge = await Bridge.init(ethSigner, arbSigner);

            setBridge(bridge);
        };

        createBridge();
    }, [fromNetwork, account]);

    const bridgeEth = async (amount: BigNumber, onSuccess: () => void) => {
        if (!handleTransaction) {
            console.error('Failed to bridge ETH: handleTransaction is unavailable');
            return;
        }
        if (!account) {
            console.error('Failed to bridge ETH: account is unavailable');
            return;
        }
        if (!bridge) {
            console.error('Failed to bridge ETH: bridge is unavailable');
            return;
        }
        if (!provider) {
            console.error('Failed to bridge ETH: provider is unavailable');
            return;
        }

        if (fromNetwork.isArbitrum) {
            // on layer 2, withdraw eth to layer 1
            const arbSys = bridge.l2Bridge.arbSys;

            handleTransaction(arbSys.withdrawEth, [account, { value: ethers.utils.parseEther(amount.toFixed()) }], {
                onSuccess: () => {
                    onSuccess();
                    refreshBridgeableBalance(BRIDGEABLE_ASSET_ETH);
                },
            });
        } else {
            // on layer 1, deposit eth to layer 2

            const inboxAddress = await bridge.l1GatewayRouter.inbox();
            const inbox = new Inbox__factory(provider.getSigner(0)).attach(inboxAddress);

            const [maxSubmissionPrice] = await bridge.l2Bridge.getTxnSubmissionPrice(0);

            handleTransaction(
                inbox.depositEth,
                [maxSubmissionPrice, { value: ethers.utils.parseEther(amount.toFixed()) }],
                {
                    onSuccess: () => {
                        onSuccess();
                        refreshBridgeableBalance(BRIDGEABLE_ASSET_ETH);
                    },
                },
            );
        }
    };

    // takes the token address and an amount to deposit
    // wrote these two to be not be hard fixed to USDC
    const bridgeToken = async (tokenAddress: string, amount: BigNumber, onSuccess: () => void) => {
        if (!handleTransaction) {
            console.error('Failed to bridge ERC20, handleTransaction is unavailable');
            return;
        }
        if (!account) {
            console.error('Failed to bridge ERC20: account is unavailable');
            return;
        }
        if (!bridge) {
            console.error('Failed to bridge ERC20: bridge is unavailable');
            return;
        }
        if (!provider) {
            console.error('Failed to bridge ERC20: provider is unavailable');
            return;
        }
        const bridgeableToken = bridgeableTokenList.find((token) => token.address === tokenAddress);
        if (!bridgeableToken) {
            console.error(`Failed to bridge ERC20: bridgeable token not found with address ${tokenAddress}`);
            return;
        }
        if (fromNetwork.isArbitrum) {
            // we are on layer 2, withdraw back to layer 1

            const l1TokenAddress = await bridge.l2Bridge.getERC20L1Address(tokenAddress);

            handleTransaction(
                bridge.l2Bridge.l2GatewayRouter.functions['outboundTransfer(address,address,uint256,bytes)'],
                [l1TokenAddress, account, ethers.utils.parseUnits(amount.toFixed(), bridgeableToken.decimals), '0x'],
                {
                    onSuccess: () => {
                        onSuccess();
                        refreshBridgeableBalance(bridgeableToken);
                    },
                },
            );
        } else {
            // we are on layer 1, deposit into layer 2

            const depositParams = await bridge.getDepositTxParams({
                erc20L1Address: tokenAddress,
                amount: ethers.utils.parseUnits(amount.toFixed(), bridgeableToken.decimals),
                destinationAddress: account,
            });

            const abiCoder = new ethers.utils.AbiCoder();
            const data = abiCoder.encode(['uint256', 'bytes'], [depositParams.maxSubmissionCost, '0x']);

            handleTransaction(
                bridge.l1GatewayRouter.outboundTransfer,
                [
                    depositParams.erc20L1Address,
                    depositParams.destinationAddress || account,
                    depositParams.amount,
                    depositParams.maxGas,
                    depositParams.gasPriceBid,
                    data,
                    {
                        value: depositParams.l1CallValue,
                    },
                ],
                {
                    onSuccess: () => {
                        onSuccess();
                        refreshBridgeableBalance(bridgeableToken);
                    },
                },
            );
        }
    };

    const approveToken = (tokenAddress: string, spender: string) => {
        if (!handleTransaction) {
            console.error('Failed to approve bridgeable token: handleTransaction unavailable');
            return;
        }

        const token = new ethers.Contract(tokenAddress, ERC20__factory.abi, signer) as ERC20;

        handleTransaction(token.approve, [spender, MAX_SOL_UINT], {
            onSuccess: () => {
                // TODO convert to hashmap to avoid looping both here and in bridgeToken
                const bridgeableAsset = bridgeableTokenList.find((token) => token.address === tokenAddress);

                if (bridgeableAsset) {
                    refreshBridgeableBalance(bridgeableAsset);
                }
            },
        });
    };

    const refreshBridgeableBalance = async (asset: BridgeableAsset): Promise<void> => {
        const newBridgeableBalances = Object.assign({}, bridgeableBalances);

        if (!provider || !signer || !bridge || !account) {
            return;
        }
        // ensure the top level (network) entry is initialised

        newBridgeableBalances[network] = newBridgeableBalances[network] || {};
        // if we are bridging a token from L1 -> L2, the spender is the gateway router for the L1 network

        try {
            if (asset.symbol === bridgeableTickers.ETH) {
                const balance = fromNetwork.isArbitrum
                    ? await bridge?.l2Bridge.getL2EthBalance()
                    : await bridge?.l1Bridge.getL1EthBalance();

                newBridgeableBalances[network][asset.symbol] = {
                    balance: new BigNumber(ethers.utils.formatEther(balance)),
                    allowance: new BigNumber(ethers.utils.formatEther(balance)),
                    spender: '',
                };
            } else if (asset.address) {
                const tokenData = fromNetwork.isArbitrum
                    ? await bridge.l2Bridge.getL2TokenData(asset.address)
                    : await bridge.l1Bridge.getL1TokenData(asset.address);

                const erc20GatewayAddress = await getERC20GatewayAddress(fromNetwork, asset, bridge);

                const [allowance, decimals] = await Promise.all([
                    tokenData.contract.allowance(account, erc20GatewayAddress),
                    isL1TokenData(tokenData) ? tokenData.decimals : tokenData.contract.decimals(),
                ]);

                newBridgeableBalances[network][asset.symbol] = {
                    balance: new BigNumber(ethers.utils.formatUnits(tokenData.balance, decimals)),
                    allowance: new BigNumber(ethers.utils.formatUnits(allowance, decimals)),
                    spender: erc20GatewayAddress,
                };
            }

            setBridgeableBalances(newBridgeableBalances);
        } catch (error) {
            console.error(error);
        }
    };

    const showBridgeModal = () => setBridgeModalIsOpen(true);
    const hideBridgeModal = () => setBridgeModalIsOpen(false);

    return (
        <ArbitrumBridgeContext.Provider
            value={{
                bridgeToken,
                bridgeEth,
                approveToken,
                refreshBridgeableBalance,
                fromNetwork,
                toNetwork,
                bridgeableTokenList,
                bridgeableAssetList,
                bridgeableBalances,
                showBridgeModal,
                hideBridgeModal,
                bridgeModalIsOpen,
            }}
        >
            {children}
        </ArbitrumBridgeContext.Provider>
    );
};

export const useArbitrumBridge: () => ArbitrumBridgeProps = () => {
    const context = useContext(ArbitrumBridgeContext);
    if (context === undefined) {
        throw new Error(`useArbitrumBridge must be called within ArbitrumBridge`);
    }
    return context;
};

const isL1TokenData = (tokenData: L1TokenData | L2TokenData): tokenData is L1TokenData => {
    return Boolean((tokenData as any).decimals);
};

const getERC20GatewayAddress = async (fromNetwork: Network, asset: BridgeableAsset, bridge: Bridge) => {
    if (!asset.address) {
        throw new Error('Could not get ERC20GatewayAddress: asset address is unknown');
    }

    if (fromNetwork.isArbitrum) {
        const l1Address = await bridge.l2Bridge.getERC20L1Address(asset.address);
        if (!l1Address) {
            throw new Error(
                `Could not get ERC20GatewayAddress: l2 address ${asset.address} has no known corresponding l1 address`,
            );
        }
        return bridge.l2Bridge.getGatewayAddress(l1Address);
    }

    return bridge.l1Bridge.getGatewayAddress(asset.address);
};
