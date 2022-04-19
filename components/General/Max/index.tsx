import styled from 'styled-components';
import { Theme } from '~/store/ThemeSlice/themes';
import { fontSize } from '~/store/ThemeSlice/themes';

const Max = styled.div`
    cursor: pointer;
    text-transform: uppercase;
    font-weight: bold;
    font-size: ${fontSize.md};
    line-height: 150%;
    color: ${({ theme }) => (theme.theme === Theme.Light ? '#2A2AC7' : '#fff')};
    &:hover {
        text-decoration: underline;
    }
`;

export default Max;
