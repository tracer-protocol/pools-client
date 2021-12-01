import React, { useEffect, useReducer } from 'react';
import FilterBar from './FilterSelects/Bar';
import FilterModal from './FilterSelects/Modal';
import PoolsTable from './PoolsTable';
import { browseReducer, BrowseState, BrowseTableRowData, MarketFilterEnum, RebalanceEnum, SortByEnum } from './state';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import useBrowsePools from '@libs/hooks/useBrowsePools';
import { SideEnum, CommitActionEnum } from '@libs/constants';
import { noDispatch, useSwapContext } from '@context/SwapContext';
import MintBurnModal from './MintBurnModal';

export const Browse: React.FC = () => {
    const { account } = useWeb3();
    const { swapDispatch = noDispatch } = useSwapContext();

    const [state, dispatch] = useReducer(browseReducer, {
        search: '',
        marketFilter: MarketFilterEnum.All,
        rebalanceFocus: RebalanceEnum.next,
        sortBy: account ? SortByEnum.MyHoldings : SortByEnum.Name,
        filterModalOpen: false,
        mintBurnModalOpen: false,
    } as BrowseState);

    useEffect(() => {
        if (account && state.sortBy === SortByEnum.Name) {
            dispatch({ type: 'setSortBy', sortBy: SortByEnum.MyHoldings });
        }
    }, [account]);

    // parse the pools rows
    const tokens = useBrowsePools();

    const marketFilter = (pool: BrowseTableRowData): boolean => {
        switch (state.marketFilter) {
            case MarketFilterEnum.All:
                return true;
            case MarketFilterEnum.ETH:
            case MarketFilterEnum.BTC:
                return pool.name.replace(/.\-/g, '').split('/')[0] === state.marketFilter;
            default:
                return false;
        }
    };

    const searchFilter = (pool: BrowseTableRowData): boolean => {
        const searchString = state.search.toLowerCase();
        return Boolean(pool.name.toLowerCase().match(searchString));
    };

    const sorter = (tokenA: BrowseTableRowData, tokenB: BrowseTableRowData): number => {
        switch (state.sortBy) {
            case SortByEnum.TotalValueLocked:
                return tokenB.tvl - tokenA.tvl;
            case SortByEnum.MyHoldings:
                return tokenB.myHoldings - tokenA.myHoldings;
            default:
                return 0;
        }
    };

    const filteredTokens = tokens.filter(marketFilter).filter(searchFilter);
    const sortedFilteredTokens = filteredTokens.sort(sorter);

    const handleMintBurn = (pool: string, side: SideEnum, commitAction: CommitActionEnum) => {
        console.debug(`
            ${commitAction === CommitActionEnum.mint ? 'Buying/minting ' : 'Burning/selling '}
            ${side === SideEnum.long ? 'long' : 'short'} token from pool ${pool}
        `);
        swapDispatch({ type: 'setSelectedPool', value: pool });
        swapDispatch({ type: 'setSide', value: side });
        swapDispatch({ type: 'setCommitAction', value: commitAction });
        dispatch({ type: 'setMintBurnModalOpen', open: true });
        // router.push({
        //     pathname: '/',
        //     query: {
        //         pool: pool,
        //         type: CommitActionEnum.mint,
        //         side: side,
        //     },
        // });
    };

    const handleModalClose = () => {
        dispatch({
            type: 'setMintBurnModalOpen',
            open: false,
        });
    };

    return (
        <>
            <div className="container mt-0 md:mt-20">
                <div className="p-4 md:pt-16 md:pb-12 md:px-8 lg:px-16 mb-4 shadow-xl rounded sm:rounded-2xl md:rounded-3xl bg-theme-background">
                    <section className="">
                        <h1 className="font-bold text-3xl mb-2 text-theme-text">Pool Tokens</h1>
                        <p className="mb-1 text-gray-500">Browse the available Tracer Pool Tokens.</p>
                        <FilterBar state={state} dispatch={dispatch} />
                    </section>
                    <PoolsTable
                        rows={sortedFilteredTokens}
                        onClickMintBurn={handleMintBurn}
                        showNextRebalance={state.rebalanceFocus === RebalanceEnum.next}
                    />
                </div>
            </div>
            <FilterModal state={state} dispatch={dispatch} />
            <MintBurnModal open={state.mintBurnModalOpen} onClose={handleModalClose} />
        </>
    );
};