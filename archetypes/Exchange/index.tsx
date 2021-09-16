import React, { useContext } from 'react';
import BigNumber from 'bignumber.js';
import { SwapContext } from '@context/SwapContext';
import { CommitActionEnum } from '@libs/constants';
import styled from 'styled-components';
import Gas from './Gas';
import Buy from './Buy';
import Sell from './Sell';
import Divider from '@components/General/Divider';
import TWButtonGroup from '@components/General/TWButtonGroup';

const TRADE_OPTIONS = [
    {
        key: CommitActionEnum.mint,
        text: 'Buy',
    },
    {
        key: CommitActionEnum.burn,
        text: 'Sell',
    },
];

export default (() => {
    const { swapState, swapDispatch } = useContext(SwapContext);

    return (
        <div className="w-full justify-center ">
            <TradeModal>
                <div className="flex">
                    <TWButtonGroup
                        value={swapState?.commitAction ?? CommitActionEnum.mint}
                        size={'xl'}
                        onClick={(val) => {
                            if (swapDispatch) {
                                swapDispatch({ type: 'setAmount', value: new BigNumber(0) });
                                swapDispatch({ type: 'setLeverage', value: 1 });
                                swapDispatch({ type: 'setCommitAction', value: val as CommitActionEnum });
                            }
                        }}
                        options={TRADE_OPTIONS}
                    />
                    <Gas />
                </div>

                <Divider className="my-8" />

                {/** Inputs */}
                {swapState?.commitAction === CommitActionEnum.burn ? <Sell /> : <Buy />}
            </TradeModal>
        </div>
    );
}) as React.FC;

const TradeModal = styled.div`
    background: var(--color-background);
    width: 611px;
    box-shadow: 4px 4px 50px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    padding: 2rem 3rem;
    margin: 5vh auto;

    @media (max-width: 611px) {
        width: 100%;
        border-radius: 0;
        box-shadow: 0;
        margin: 0;
        padding: 2rem 1rem;
    }
`;
