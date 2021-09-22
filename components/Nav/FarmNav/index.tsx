import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const STAKE = 0;
const BPT = 1;

// const InvestNav
export default (({ left, right }) => {
    const router = useRouter();

    useEffect(() => {
        router.prefetch('/stake');
        router.prefetch('/bpt');
    }, []);

    const handleRoute = (route: number) => {
        switch (route) {
            case STAKE:
                router.push({
                    pathname: '/stake',
                });
                break;
            case BPT:
                router.push({
                    pathname: '/bpt',
                });
                break;
            default:
                // nada
                break;
        }
    };

    return (
        <StakeNav>
            <div className="absolute left-0 top-0 bottom-0 flex items-center">{left}</div>
            <div className="flex flex-grow justify-center">
                <Item onClick={(_e) => handleRoute(STAKE)} selected={router.pathname === '/stake'}>
                    Stake Pool
                </Item>
                <Item onClick={(_e) => handleRoute(BPT)} selected={router.pathname === '/bpt'}>
                    Stake BPT
                </Item>
            </div>
            <div className="absolute right-0 top-0 bottom-0 flex items-center">{right}</div>
        </StakeNav>
    );
}) as React.FC<{
    left?: JSX.Element;
    right?: JSX.Element;
}>;

const StakeNav = styled.div`
    position: relative;
    background: #eeeef6;
    width: 100%;
    min-height: 60px;
    height: 60px;
    text-align: center;
    display: flex;
    // justify-content: space-between;
`;

const Item = styled.div<{ selected: boolean }>`
    width: 120px;
    height: 44px;
    line-height: 44px;
    display: inline;
    border-radius: 10px;
    margin: auto 0;
    cursor: pointer;
    background: ${(props) => (props.selected ? '#fff' : 'none')};
    transition: 0.3s;

    color: #374151;
    &:hover {
        opacity: 0.8;
    }
`;
