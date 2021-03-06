import React, { useMemo, useState } from 'react';
import { calcNotionalValue } from '@tracer-protocol/pools-js';

import ArrowDown from '~/public/img/general/caret-down-white.svg';
import { getBaseAsset } from '~/utils/poolNames';
import { ExpectedExposure, ExpectedFlipFees, ExpectedFlipAmounts, LifetimeCosts, ReceiveToken } from './Sections';
import * as Styles from './styles';
import { FlipSummaryProps } from './types';

const FlipSummary: React.FC<FlipSummaryProps> = ({
    pool,
    isLong,
    amount,
    nextTokenPrice,
    gasFee,
    mintingFee,
    burningFee,
    annualFeePercent,
}) => {
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
                settlementTokenSymbol={pool.settlementToken.symbol}
                isLong={isLong}
            />
            <ExpectedFlipFees
                amount={amount}
                gasFee={gasFee}
                mintingFee={mintingFee}
                burningFee={burningFee}
                showTransactionDetails={showTransactionDetails}
            />
            <ExpectedExposure
                label="Expected Exposure"
                expectedExposure={flippedEquivalentExposure}
                commitAmount={flippedCommitAmount}
                baseAsset={baseAsset}
                oraclePrice={pool.oraclePrice}
                poolLeverage={pool.leverage}
                showTransactionDetails={showTransactionDetails}
                isLong={!isLong}
            />
            <LifetimeCosts
                amount={amount}
                annualFeePercent={annualFeePercent}
                burningFee={burningFee}
                showTransactionDetails={showTransactionDetails}
            />
            <Styles.ShowDetailsButton onClick={() => setShowTransactionDetails(!showTransactionDetails)}>
                <ArrowDown className={`${showTransactionDetails ? 'open' : ''}`} />
            </Styles.ShowDetailsButton>
        </>
    );
};

export default FlipSummary;
