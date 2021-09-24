import React, { createContext, useContext, useState } from 'react';
import { AppearanceTypes, useToasts } from 'react-toast-notifications';
import { Children, Result } from '@libs/types/General';
import { ContractReceipt, ContractTransaction } from 'ethers';
import { networkConfig } from '@context/Web3Context/Web3Context.Config';

type Content = {
    title?: React.ReactNode;
    body?: React.ReactNode;
};

export type Options = {
    onSuccess?: (receipt?: ContractReceipt | Result) => any; // eslint-disable-line
    onError?: (error?: Error | Result) => any;
    afterConfirmation?: (hash: string) => any;
    network?: number; // network number;
    statusMessages?: {
        waiting?: Content; // transaction message for when we are waiting for the user to confirm
        error?: Content; // transaction message for when the transaction fails
        success?: Content; // transaction message for when the transaction succeeds
    };
};
type HandleTransactionType =
    | ((
          callMethod: (...args: any) => Promise<ContractTransaction>,
          params: any[], // eslint-disable-line
          options?: Options,
      ) => void)
    | undefined;

interface TransactionActionsContextProps {
    handleTransaction: HandleTransactionType;
}
interface TransactionContextProps {
    pendingCount: number;
}

export const TransactionContext = createContext<Partial<TransactionContextProps>>({});
export const TransactionActionsContext = createContext<Partial<TransactionActionsContextProps>>({});

// type Status = 'INITIALIZED' | 'PROCESSING' | 'ERROR' | 'SUCCESS'

/**
 * TransactionStore which makes creating and updating Toasters easier when calling transactions.
 * Call handleTransaction with the required params to automatically update the toaster as the transaction
 *  moves through the various stages of its lifestile.
 * TODO store a list of transactions with a transaction state so the user can view all pending transactions
 * TODO populate the current pending transactions when the user visits the page
 */
export const TransactionStore: React.FC = ({ children }: Children) => {
    const { addToast, updateToast } = useToasts();
    const [pendingCount, setPendingCount] = useState(0);

    /** Specifically handles transactions */
    const handleTransaction: HandleTransactionType = async (callMethod, params, options) => {
        const { onError, onSuccess, afterConfirmation, network = 0, statusMessages } = options ?? {};

        const toastId: unknown = addToast(
            [statusMessages?.waiting?.title ?? 'Pending Transaction', statusMessages?.waiting?.body ?? ''],
            {
                appearance: 'loading' as AppearanceTypes,
                autoDismiss: false,
            },
        );

        setPendingCount(pendingCount + 1);
        const res = callMethod(...params);

        res.then(async (contractTransaction) => {
            afterConfirmation ? afterConfirmation(contractTransaction.hash) : null;

            const contractReceipt = await contractTransaction.wait();

            updateToast(toastId as unknown as string, {
                content: [
                    statusMessages?.success?.title ?? 'Transaction Successful',
                    statusMessages?.success?.body ?? (
                        <a
                            key={contractReceipt.transactionHash}
                            href={`${networkConfig[network ?? '0'].previewUrl}/${contractReceipt.transactionHash}`}
                            className="text-tracer-400 underline"
                            target="_blank"
                            rel="noreferrer"
                        >
                            View transaction
                        </a>
                    ),
                ],
                appearance: 'success',
                autoDismiss: true,
            });

            setPendingCount(pendingCount - 1);
            onSuccess ? onSuccess(contractReceipt) : null;
        }).catch((error) => {
            console.error('Failed transaction', error, error.code);
            if (error?.code === 4001) {
                // user denied txn
                updateToast(toastId as unknown as string, {
                    content: ['Transaction Dismissed'],
                    appearance: 'warning',
                    autoDismiss: true,
                });
            } else {
                updateToast(toastId as unknown as string, {
                    content: [
                        statusMessages?.error?.title ?? 'Transaction failed',
                        statusMessages?.error?.body ?? error.message,
                    ],
                    appearance: 'error',
                    autoDismiss: true,
                });
            }
            setPendingCount(pendingCount - 1);
            onError ? onError(error) : null;
        });
    };

    return (
        <TransactionActionsContext.Provider
            value={{
                handleTransaction,
            }}
        >
            <TransactionContext.Provider
                value={{
                    pendingCount,
                }}
            >
                {children}
            </TransactionContext.Provider>
        </TransactionActionsContext.Provider>
    );
};

export const useTransactionContext: () => Partial<TransactionActionsContextProps> = () => {
    const context = useContext(TransactionActionsContext);
    if (context === undefined) {
        throw new Error(`useTransactionContext must be called within TransactionContext`);
    }
    return context;
};

export const useTransactionState: () => Partial<TransactionContextProps> = () => {
    const context = useContext(TransactionContext);
    if (context === undefined) {
        throw new Error(`useTransactionContext must be called within TransactionContext`);
    }
    return context;
};