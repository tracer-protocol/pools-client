import React, { useMemo, useState } from 'react';
import { calcNotionalValue } from '@tracer-protocol/pools-js';

import * as Styles from './styles';
import { ExpectedExposure, ExpectedFees, ExpectedFlipAmounts, ReceiveToken } from './Sections';
import { FlipSummaryProps } from './types';

import ArrowDown from '@public/img/general/caret-down-white.svg';
import { getBaseAsset } from '@libs/utils/converters';

const FlipSummary: React.FC<FlipSummaryProps> = ({ pool, isLong, amount, nextTokenPrice, gasFee }) => {
    const [showTransactionDetails, setShowTransactionDetails] = useState(false);

    const flippedToken = useMemo(
        () => (isLong ? pool.shortToken : pool.longToken),
        [isLong, pool.longToken, pool.shortToken],
    );
    const nextFlipTokenPrice = useMemo(
        () => (isLong ? pool.getNextShortTokenPrice() : pool.getNextLongTokenPrice()),
        [isLong],
    );

    const baseAsset = getBaseAsset(pool.name);
    const expectedNotionalReturn = calcNotionalValue(nextTokenPrice, amount);

    const flippedEquivalentExposure: number = expectedNotionalReturn
        .div(pool.oraclePrice)
        .times(pool.leverage)
        .toNumber();
    const flippedCommitAmount: number = expectedNotionalReturn.div(pool.oraclePrice).toNumber();

    return (
        <>
            <ReceiveToken tokenSymbol={flippedToken.symbol} />
            <Styles.Divider />
            <ExpectedFlipAmounts
                showTransactionDetails={showTransactionDetails}
                nextFlipTokenPrice={nextFlipTokenPrice}
                flippedTokenSymbol={flippedToken.symbol}
                expectedNotionalReturn={expectedNotionalReturn}
                quoteTokenSymbol={pool.quoteToken.symbol}
                isLong={isLong}
            />
            <ExpectedFees amount={amount} gasFee={gasFee} showTransactionDetails={showTransactionDetails} />
            <ExpectedExposure
                label="Expected Exposure"
                expectedExposure={flippedEquivalentExposure}
                commitAmount={flippedCommitAmount}
                baseAsset={baseAsset}
                oraclePrice={pool.oraclePrice}
                poolLeverage={pool.leverage}
                showTransactionDetails={showTransactionDetails}
            />
            <Styles.ShowDetailsButton onClick={() => setShowTransactionDetails(!showTransactionDetails)}>
                <ArrowDown className={`${showTransactionDetails ? 'open' : ''}`} />
            </Styles.ShowDetailsButton>
        </>
    );
};

export default FlipSummary;
