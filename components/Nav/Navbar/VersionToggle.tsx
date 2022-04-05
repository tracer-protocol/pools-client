import React from 'react';
import styled from 'styled-components';

export default (({ hideOnDesktop, pushContentRight }) => (
    <VersionToggle hideOnDesktop={hideOnDesktop} pushContentRight={pushContentRight}>
        <V1>V1</V1>
        <V2 href="https://v2beta.tracer.finance">
            V2 <New>BETA</New>
        </V2>
    </VersionToggle>
)) as React.FC<{
    hideOnDesktop?: boolean;
    pushContentRight: boolean;
}>;

const VersionToggle = styled.span<{ hideOnDesktop?: boolean; pushContentRight: boolean }>`
    border: 1px solid #fff;
    border-radius: 7px;
    background-color: rgba(255, 255, 255, 0.25);
    color: #fff;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    margin: ${({ pushContentRight }) => `10px 0 10px ${pushContentRight ? '10px' : 'auto'}`};
    width: 149px;
    justify-content: space-between;
    font-weight: 600;
    letter-spacing: 0.115em;
    @media (min-width: 1280px) {
        display: ${({ hideOnDesktop }) => (hideOnDesktop ? 'none' : 'grid')};
        margin: 10px 0 10px 10px;
    }
    margin-right: 12px;
`;

const V1 = styled.span`
    background-color: #fff;
    color: #3535dc;
    border-radius: 5px;
    height: 100%;
    justify-content: center;
    display: flex;
    align-items: center;
    white-space: nowrap;
`;

const V2 = styled.a`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding: 0 10px;
    &:hover {
        color: #fff;
    }
`;

const New = styled.span`
    background-color: #3535dc;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    border-radius: 3px;
    padding: 0 4px;
    margin-left: 3px;
    height: 13px;
    display: flex;
    align-items: center;
    margin-bottom: -1px;
    letter-spacing: 0;
`;
