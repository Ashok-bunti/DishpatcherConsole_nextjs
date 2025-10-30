import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './index';
import { fetchTimeDataForAccount } from '../slices/driverLocationSlice';

export const useTimeData = () => {
    const dispatch = useAppDispatch();
    const { selectedAccount, accountData, timeData } = useAppSelector((state) => state.driverLocation);

    useEffect(() => {
        if (selectedAccount && accountData.length > 0) {
            dispatch(fetchTimeDataForAccount(selectedAccount, accountData));
        }
    }, [selectedAccount, accountData, dispatch]);

    useEffect(() => {
        if (selectedAccount && accountData.length > 0) {
            const interval = setInterval(() => {
                dispatch(fetchTimeDataForAccount(selectedAccount, accountData));
            }, 60000);
            return () => clearInterval(interval);
        }
    }, [selectedAccount, accountData, dispatch]);

    return timeData;
};