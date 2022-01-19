import React, { useEffect, useReducer } from 'react';
import FilterBar from './FilterSelects/Bar';
import PoolsTable from './PoolsTable';
import {
    browseReducer,
    BrowseState,
    BrowseTableRowData,
    DeltaEnum,
    LeverageEnum,
    MarketFilterEnum,
    RebalanceEnum,
    SortByEnum,
} from './state';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import useBrowsePools from '@libs/hooks/useBrowsePools';
import { CommitActionEnum, MarketToOracleMap, SideEnum } from '@libs/constants';
import { noDispatch, useSwapContext } from '@context/SwapContext';
import MintBurnModal from './MintBurnModal';
import Loading from '@components/General/Loading';
import { Logo, LogoTicker } from '@components/General';
import { toApproxCurrency } from '@libs/utils/converters';

export const Browse: React.FC = () => {
    const { account } = useWeb3();
    const { swapDispatch = noDispatch } = useSwapContext();

    const [state, dispatch] = useReducer(browseReducer, {
        search: '',
        marketFilter: MarketFilterEnum.All,
        leverageFilter: LeverageEnum.All,
        rebalanceFocus: RebalanceEnum.next,
        sortBy: account ? SortByEnum.MyHoldings : SortByEnum.Name,
        filtersOpen: false,
        mintBurnModalOpen: false,
        deltaDenotion: DeltaEnum.Percentile,
    } as BrowseState);

    useEffect(() => {
        if (account && state.sortBy === SortByEnum.Name) {
            dispatch({ type: 'setSortBy', sortBy: SortByEnum.MyHoldings });
        }
    }, [account]);

    // parse the pools rows
    const { rows: tokens } = useBrowsePools();

    const marketFilter = (pool: BrowseTableRowData): boolean => {
        switch (state.marketFilter) {
            case MarketFilterEnum.All:
                return true;
            case MarketFilterEnum.EUR:
                return pool.name.replace(/.\-/g, '').split('/')[0] === 'EUR';
            case MarketFilterEnum.TOKE:
                return pool.name.replace(/.\-/g, '').split('/')[0] === 'TOKE';
            case MarketFilterEnum.LINK:
                return pool.name.replace(/.\-/g, '').split('/')[0] === 'LINK';
            case MarketFilterEnum.ETH:
                return pool.name.replace(/.\-/g, '').split('/')[0] === 'ETH';
            case MarketFilterEnum.BTC:
                return pool.name.replace(/.\-/g, '').split('/')[0] === 'BTC';
            default:
                return false;
        }
    };

    const leverageFilter = (pool: BrowseTableRowData): boolean => {
        switch (state.leverageFilter) {
            case LeverageEnum.All:
                return true;
            case LeverageEnum.One:
                return pool.name.split('-')[0] === '1';
            case LeverageEnum.Three:
                return pool.name.split('-')[0] === '3';
            default:
                return false;
        }
    };

    const searchFilter = (pool: BrowseTableRowData): boolean => {
        const searchString = state.search.toLowerCase();
        return Boolean(
            pool.name.toLowerCase().match(searchString) ||
                pool.shortToken.symbol.toLowerCase().match(searchString) ||
                pool.longToken.symbol.toLowerCase().match(searchString) ||
                pool.market.toLowerCase().match(searchString),
        );
    };

    const sorter = (poolA: BrowseTableRowData, poolB: BrowseTableRowData): number => {
        switch (state.sortBy) {
            case SortByEnum.TotalValueLocked:
                return poolB.tvl - poolA.tvl;
            case SortByEnum.MyHoldings:
                return poolB.myHoldings - poolA.myHoldings;
            default:
                return 0;
        }
    };

    const filteredTokens = tokens.filter(marketFilter).filter(leverageFilter).filter(searchFilter);
    const sortedFilteredTokens = filteredTokens.sort(sorter);

    const groupedSortedFilteredTokens = sortedFilteredTokens.reduce((groups, item) => {
        // @ts-ignore
        const group = groups[item.name.split('-')[1]] || [];
        group.push(item);
        // @ts-ignore
        groups[item.name.split('-')[1]] = group;
        return groups;
    }, []);

    const handleMintBurn = (pool: string, side: SideEnum, commitAction: CommitActionEnum) => {
        console.debug(`
            ${commitAction === CommitActionEnum.mint ? 'Buying/minting ' : 'Burning/selling '}
            ${side === SideEnum.long ? 'long' : 'short'} token from pool ${pool}
        `);
        swapDispatch({ type: 'setSelectedPool', value: pool });
        swapDispatch({ type: 'setSide', value: side });
        swapDispatch({ type: 'setCommitAction', value: commitAction });
        dispatch({ type: 'setMintBurnModalOpen', open: true });
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
                <section className="mb-8">
                    <h1 className="font-bold text-3xl mb-2 text-theme-text">Pools</h1>
                    <FilterBar state={state} dispatch={dispatch} />
                </section>
                {!sortedFilteredTokens.length ? <Loading className="w-10 mx-auto mt-10" /> : null}
                {Object.keys(groupedSortedFilteredTokens).map((key, index) => {
                    const dataRows = groupedSortedFilteredTokens[key as any] as BrowseTableRowData[];
                    return (
                        <div
                            key={index}
                            className="p-4 md:p-8 lg:px-16 mb-4 shadow-xl rounded sm:rounded-2xl md:rounded-3xl bg-theme-background"
                        >
                            <div className="w-full h-20 my-5 p-4 flex justify-between divide-x-4 divide-cool-gray-200 dark:divide-cool-gray-900 overflow-x-auto whitespace-nowrap rounded-xl bg-cool-gray-50 dark:bg-theme-background-secondary">
                                <div className="flex pr-10">
                                    <Logo
                                        className="inline mr-3 my-auto"
                                        size="lg"
                                        ticker={key.split('/')[0] as LogoTicker}
                                    />
                                    <div className="my-auto">
                                        <div className="font-bold text-lg">{key}</div>
                                    </div>
                                </div>
                                <div className="px-10">
                                    <div className="text-cool-gray-500 dark:text-cool-gray-400 font-semibold">
                                        SPOT PRICE
                                    </div>
                                    <div className="font-bold">{toApproxCurrency(dataRows[0].oraclePrice)}</div>
                                </div>
                                <div className="px-10">
                                    <div className="text-cool-gray-500 dark:text-cool-gray-400 font-semibold">
                                        ORACLE
                                    </div>
                                    <a
                                        href={`https://reputation.link/contracts/${MarketToOracleMap(key)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center"
                                    >
                                        <img className="mr-2" src={'/img/general/chainlink.svg'} alt="Chainlink" />
                                        <div className="mr-2 font-bold">Chainlink</div>
                                        <img src={'/img/general/link.svg'} alt="Link" />
                                    </a>
                                </div>
                                <div className="px-10 text-cool-gray-500 dark:text-cool-gray-400 font-semibold">
                                    24H VOLUME
                                </div>
                                <div className="px-10">
                                    <div className="text-cool-gray-500 dark:text-cool-gray-400 font-semibold">
                                        NUMBER OF POOLS
                                    </div>
                                    <div className="font-bold">{dataRows.length}</div>
                                </div>
                            </div>
                            <PoolsTable
                                rows={dataRows}
                                deltaDenotion={state.deltaDenotion}
                                onClickMintBurn={handleMintBurn}
                                showNextRebalance={state.rebalanceFocus === RebalanceEnum.next}
                            />
                        </div>
                    );
                })}
            </div>
            <MintBurnModal open={state.mintBurnModalOpen} onClose={handleModalClose} />
        </>
    );
};
