import { useState, useEffect } from 'react';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { CommitEnum } from '@libs/constants/index';
import { PoolCommitter__factory, PoolCommitter } from '@tracer-protocol/perpetual-pools-contracts/types';
import { useWeb3 } from '@context/Web3Context/Web3Context';

// const useEstimatedGasFee
export default ((committerAddress: string, amount: BigNumber, commitType: CommitEnum) => {
    const { signer } = useWeb3();
    const [gasFee, setGasFee] = useState(0);

    useEffect(() => {
        if (!committerAddress) {
            console.error('Committer address undefined when trying to estimate gas price');
        } else if (!signer) {
            console.error('Provider undefined when trying to estimate gas price');
        } else if (amount.eq(0)) {
        } else {
            const committer = new ethers.Contract(
                committerAddress,
                PoolCommitter__factory.abi,
                signer,
            ) as PoolCommitter;
            committer.estimateGas
                .commit(commitType, ethers.utils.parseEther(amount ? amount.toString() : '0'))
                .then((gwei) => {
                    const gasFee = parseFloat(ethers.utils.formatUnits(gwei, 'gwei'));
                    console.debug('Fetched gas fee', gasFee);
                    setGasFee(gasFee);
                });
        }
    }, [committerAddress, commitType, amount, signer]);

    return gasFee;
}) as (committerAddress: string | undefined, amount: BigNumber, commitType: CommitEnum) => number;