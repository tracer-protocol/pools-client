import React from 'react';
import styled from 'styled-components';
import { QueuedCommit } from '@libs/types/General';
import usePendingCommits from '@libs/hooks/useQueuedCommits';
import { toApproxCurrency } from '@libs/utils/converters';
import TimeLeft from '@components/TimeLeft';
import { useCommitActions, useCommits } from '@context/UsersCommitContext';
import { Logo } from '@components/General';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import { ethers } from 'ethers';
import Modal, { ModalInner } from '@components/General/Modal';
import { CommitsFocusEnum, CommitEnum } from '@libs/constants';
import { Table, TableHeader, TableRow } from '@components/General/TWTable';
import { tokenSymbolToLogoTicker } from '@components/General';
import Actions from '@components/TokenActions';
import Close from '/public/img/general/close-black.svg';
import { ArbiscanEnum } from '@libs/utils/rpcMethods';

export default (() => {
    const { provider } = useWeb3();
    const { showCommits = false, focus = CommitsFocusEnum.mints } = useCommits();
    const { commitDispatch = () => console.error('Dispatch undefined') } = useCommitActions();
    const commits = usePendingCommits(focus);

    const mintCommits = commits.filter(
        (commit) => commit.type === CommitEnum.long_mint || commit.type === CommitEnum.short_mint,
    );

    const burnCommits = commits.filter(
        (commit) => commit.type === CommitEnum.long_burn || commit.type === CommitEnum.short_burn,
    );

    return (
        <PendingCommitsModal show={showCommits} onClose={() => commitDispatch({ type: 'hide' })}>
            <div className="flex justify-between">
                <h1 className="text-bold font-size[30px] text-cool-gray-900">
                    {`Queued ${focus === CommitsFocusEnum.mints ? 'Mints' : 'Burns'}`}
                </h1>
                <div className="w-3 h-3 cursor-pointer" onClick={() => commitDispatch({ type: 'hide' })}>
                    <Close />
                </div>
            </div>
            <Table>
                {focus === CommitsFocusEnum.mints ? (
                    <>
                        <TableHeader>
                            <span>Token</span>
                            <span>Spend (USDC)</span>
                            <span>Token Price (USDC)</span>
                            <span>Amount (Tokens)</span>
                            <span>Receive in</span>
                            <span>{/* Empty header for buttons column */}</span>
                        </TableHeader>
                        {mintCommits.map((commit, index) => (
                            <BuyRow key={`pcr-${index}`} index={index} provider={provider ?? null} {...commit} />
                        ))}
                    </>
                ) : (
                    <>
                        <TableHeader>
                            <span>Token</span>
                            <span>Sold (USDC)</span>
                            <span>Price* (Token)</span>
                            <span>Return (USDC)</span>
                            <span>Burn in</span>
                            <span>{/* Empty header for buttons column */}</span>
                        </TableHeader>
                        {burnCommits.map((commit, index) => (
                            <SellRow key={`pcr-${index}`} index={index} provider={provider ?? null} {...commit} />
                        ))}
                    </>
                )}
            </Table>
        </PendingCommitsModal>
    );
}) as React.FC;

const PendingCommitsModal = styled(Modal)`
    ${ModalInner} {
        max-width: 1010px;
        height: 700px;
    }
`;

const BuyRow: React.FC<
    QueuedCommit & {
        provider: ethers.providers.JsonRpcProvider | null;
        index: number;
    }
> = ({
    token,
    txnHash,
    tokenPrice,
    amount,
    nextRebalance,
    provider,
    index,
    frontRunningInterval,
    updateInterval,
    created,
}) => {
    return (
        <TableRow key={txnHash} rowNumber={index}>
            <span>
                <Logo ticker={tokenSymbolToLogoTicker(token.symbol)} className="inline w-[20px] mr-2" />
                {token.name}
            </span>
            <span>{toApproxCurrency(amount)}</span>
            <span>{toApproxCurrency(tokenPrice)}</span>
            <span>{amount.div(tokenPrice).toFixed()}</span>
            <span>
                {nextRebalance.toNumber() - created < frontRunningInterval.toNumber() ? (
                    <TimeLeft targetTime={nextRebalance.toNumber() + updateInterval.toNumber()} />
                ) : (
                    <TimeLeft targetTime={nextRebalance.toNumber()} />
                )}
            </span>
            <span className="flex text-right">
                <Actions
                    token={token}
                    provider={provider}
                    arbiscanTarget={{
                        type: ArbiscanEnum.txn,
                        target: txnHash,
                    }}
                />
            </span>
        </TableRow>
    );
};

const SellRow: React.FC<
    QueuedCommit & {
        provider: ethers.providers.JsonRpcProvider | null;
        index: number;
    }
> = ({
    token,
    txnHash,
    tokenPrice,
    amount,
    nextRebalance,
    provider,
    index,
    frontRunningInterval,
    updateInterval,
    created,
}) => {
    return (
        <TableRow key={txnHash} rowNumber={index}>
            <span>
                <Logo ticker={tokenSymbolToLogoTicker(token.symbol)} className="inline w-[20px] mr-2" />
                {token.name}
            </span>
            <span>{amount.toFixed(2)}</span>
            <span>{toApproxCurrency(tokenPrice)}</span>
            <span>{toApproxCurrency(amount.times(tokenPrice))}</span>
            <span>
                {nextRebalance.toNumber() - created < frontRunningInterval.toNumber() ? (
                    <TimeLeft targetTime={nextRebalance.toNumber() + updateInterval.toNumber()} />
                ) : (
                    <TimeLeft targetTime={nextRebalance.toNumber()} />
                )}
            </span>
            <span className="flex text-right">
                <Actions
                    token={token}
                    provider={provider}
                    arbiscanTarget={{
                        type: ArbiscanEnum.txn,
                        target: txnHash,
                    }}
                />
            </span>
        </TableRow>
    );
};
