import React, { useCallback, useEffect, useState } from 'react';
import { KnownNetwork } from '@tracer-protocol/pools-js';
import Button from '~/components/General/Button';
import { HiddenExpand } from '~/components/General/Dropdown';
import { TWModal } from '~/components/General/TWModal';
import { useStore } from '~/store/main';
import { selectImportPool, selectImportedPools } from '~/store/PoolsSlice';
import { selectNetwork } from '~/store/Web3Slice';
import { isAddress } from '~/utils/rpcMethods';
import { messages as pool } from './messages';
import * as Styles from './styles';
import { BrowseTableRowData } from '../state';

export default (({ open, onClose, sortedFilteredTokens }) => {
    const importPool = useStore(selectImportPool);
    const getImported = useStore(selectImportedPools);
    const network = useStore(selectNetwork);

    const [userInput, setUserInput] = useState<string>('');
    const [importMsg, setImportMsg] = useState<string>('');
    const [isValidAddress, setIsValidAddress] = useState<boolean>(false);

    const handleCloseModal = useCallback(() => {
        onClose();
        setUserInput('');
        setImportMsg('');
    }, [onClose]);

    const handleOnChange = useCallback((v: string) => {
        setUserInput(v);
        setIsValidAddress(isAddress(v));
    }, []);

    const handleImport = useCallback(() => {
        const isDuplicatePool = sortedFilteredTokens.some((v: BrowseTableRowData) => v.address === userInput);
        const isDuplicateImport = getImported.some((v) => v.address === userInput);

        if (isDuplicatePool || isDuplicateImport) {
            setImportMsg(pool.exists);
        } else if (isValidAddress) {
            importPool(network as KnownNetwork, userInput);
            handleCloseModal();
        } else {
            setImportMsg(pool.notValid);
        }
    }, [userInput, isValidAddress]);

    useEffect(() => {
        if (isValidAddress) {
            setImportMsg(pool.warning);
        } else {
            setImportMsg('');
        }
    }, [isValidAddress]);

    return (
        <TWModal
            open={open}
            onClose={onClose}
            className="mx-5 px-7 pt-9 pb-9 sm:px-16 sm:pb-20 sm:pt-7 md:max-w-[500px]"
        >
            <Styles.Close onClick={handleCloseModal} className="close" />
            <Styles.Title>
                Add an alternative Pool
                <br />
                to the dashboard display
            </Styles.Title>
            <Styles.Label>Pool Address</Styles.Label>

            <Styles.Input placeholder="0x..." onChange={handleOnChange} value={userInput} />

            <HiddenExpand defaultHeight={0} open={!!importMsg}>
                <Styles.Message>{importMsg}</Styles.Message>
            </HiddenExpand>

            <Button onClick={handleImport} variant="primary" size="lg">
                Import
            </Button>
        </TWModal>
    );
}) as React.FC<{
    open: boolean;
    onClose: () => void;
    sortedFilteredTokens: BrowseTableRowData[];
}>;
