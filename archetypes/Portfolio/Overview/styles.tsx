import styled from 'styled-components';
import { Container as GeneralContainer } from '~/components/General/Container';
import { device } from '~/store/ThemeSlice/themes';

export const Container = styled(GeneralContainer)`
    margin-top: 20px;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-gap: 30px;
`;

export const Wrapper = styled.div<{ isFullWidth?: boolean }>`
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-gap: 30px;

    @media ${device.xl} {
        display: grid;
        grid-template-columns: ${({ isFullWidth }) =>
            isFullWidth ? 'minmax(0, 1fr)' : 'minmax(0, 2fr) minmax(0, 1fr)'};
    }
`;

export const Banner = styled.div`
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 30px;
    @media ${device.md} {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
`;
