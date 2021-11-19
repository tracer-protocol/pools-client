import React from 'react';
import { useWeb3, useWeb3Actions } from '@context/Web3Context/Web3Context';
import { swapDefaults, useBigNumber, useSwapContext } from '@context/SwapContext';
import { usePool, usePoolActions } from '@context/PoolContext';
import { CommitActionEnum } from '@libs/constants';
import Button from '@components/General/Button';
import { CommitEnum, SideEnum } from '@tracer-protocol/pools-js/types/enums';

const ExchangeButton: React.FC<{ actionType: CommitActionEnum }> = ({ actionType }) => {
    const { account } = useWeb3();
    const { handleConnect } = useWeb3Actions();
    const { swapState = swapDefaults, swapDispatch } = useSwapContext();
    const { selectedPool, side, amount, invalidAmount, commitAction } = swapState;

    const amountBN = useBigNumber(amount);

    const pool = usePool(selectedPool);

    const { commit, approve } = usePoolActions();

    const ButtonContent = () => {
        if (!account) {
            return (
                <Button
                    size="lg"
                    variant="primary"
                    onClick={(_e) => {
                        handleConnect();
                    }}
                >
                    Connect Wallet
                </Button>
            );
        }
        if (
            (!pool.userBalances.quoteToken.approvedAmount?.gte(pool.userBalances.quoteToken.balance) ||
                pool.userBalances.quoteToken.approvedAmount.eq(0)) &&
            commitAction !== CommitActionEnum.burn
        ) {
            return (
                <>
                    <Button
                        size="lg"
                        variant="primary"
                        disabled={!selectedPool}
                        onClick={(_e) => {
                            if (!approve) {
                                return;
                            }
                            approve(selectedPool ?? '');
                        }}
                    >
                        Unlock USDC
                    </Button>
                    <p className="mt-2 text-theme-text text-sm text-center opacity-70">
                        Unlock USDC to start investing with Tracer. This is a one-time transaction for each pool.
                    </p>
                </>
            );
        } else {
            return (
                <Button
                    size="lg"
                    variant="primary"
                    disabled={!selectedPool || amountBN.eq(0) || invalidAmount.isInvalid}
                    onClick={(_e) => {
                        let commitType;
                        if (!commit) {
                            return;
                        }
                        if (actionType === CommitActionEnum.mint) {
                            commitType = side === SideEnum.long ? CommitEnum.longMint : CommitEnum.shortMint;
                        } else {
                            // actionType === CommitActionEnum.burn
                            commitType = side === SideEnum.long ? CommitEnum.longBurn : CommitEnum.shortBurn;
                        }
                        commit(selectedPool ?? '', commitType, amountBN, {
                            onSuccess: () => {
                                swapDispatch?.({ type: 'setAmount', value: '' });
                            },
                        });
                    }}
                >
                    Ok, let&apos;s {actionType === CommitActionEnum.mint ? 'mint' : 'burn'}
                </Button>
            );
        }
    };

    return <>{ButtonContent()}</>;
};

export default ExchangeButton;
