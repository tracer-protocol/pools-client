import React from 'react';
import Button from '~/components/General/Button';
import Divider from '~/components/General/Divider';
import { TWModal } from '~/components/General/TWModal';
import ProgressIndicator from '~/components/OnboardModal/ProgressIndicator';
import * as Styled from './styles';
import { OnboardModalProps } from './types';

const OnboardStakeModal: React.FC<OnboardModalProps> = ({
    onboardStep,
    setOnboardStep,
    showOnboardModal,
    setShowOnboardModal,
}) => {
    const OnboardContent = () => {
        switch (onboardStep) {
            case 1:
                return (
                    <>
                        <div className="my-5 text-center text-2xl">Stake Pool tokens</div>
                        <Divider className="mb-8" />
                        <div className="mb-8 text-sm">
                            When you receive pool tokens, stake them to earn TCR. <br />
                            <br />
                            Guide:{' '}
                            <a href="https://tracer.finance/radar/staking" target="_blank" rel="noreferrer">
                                Staking
                            </a>
                        </div>
                        <div className="my-8 text-center text-sm font-bold">Want to learn more?</div>
                        <ProgressIndicator totalSteps={2} currentStep={1} />
                        <div className="flex flex-col-reverse sm:flex-row">
                            <Button
                                variant="primary-light"
                                className="mr-5 mt-3 sm:mt-0"
                                onClick={() => setShowOnboardModal()}
                            >
                                {`No thanks, I'd like to get started`}
                            </Button>
                            <Button variant="primary" onClick={() => setOnboardStep(onboardStep + 1)}>
                                Sure, show me around!
                            </Button>
                        </div>
                    </>
                );
            case 2:
                return (
                    <>
                        <div className="my-5 text-center text-2xl">Explore the wider landscape</div>
                        <Divider className="mb-8" />
                        <div className="mb-8 text-sm">
                            Staking for Balancer Pool Tokens (BPT) is now available. Provide token liquidity on Balancer
                            to earn more TCR.
                            {` We're excited by what's possible with Perpetual Pool tokens. If you are too, join the `}
                            <a href="https://discord.com/invite/kddBUqDVVb" target="_blank" rel="noreferrer">
                                discord
                            </a>
                            .
                        </div>
                        <ProgressIndicator totalSteps={2} currentStep={2} />
                        <div className="flex">
                            <Button
                                variant="primary-light"
                                className="mr-5"
                                onClick={() => setOnboardStep(onboardStep - 1)}
                            >
                                Previous
                            </Button>
                            <Button variant="primary" onClick={() => setShowOnboardModal()}>
                                Done
                            </Button>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <TWModal open={showOnboardModal} onClose={() => setShowOnboardModal()}>
            <Styled.Close onClick={() => setShowOnboardModal()} />
            <Styled.OnboardContent className="onboard">{OnboardContent()}</Styled.OnboardContent>
        </TWModal>
    );
};

export default OnboardStakeModal;
