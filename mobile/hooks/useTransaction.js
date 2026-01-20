import { useCallback, useState } from 'react'
import {Alert} from 'react-native';

const API_URL = 'https://localhost:3001/api'
export const useTransaction = (userId) => {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({
        balance: 0,
        income: 0,
        expenses: 0,
    });

const [isloading, setIsLoading] = useState(true);

//useCallback is used to for performance reasons, it memorizes the function so that it is not recreated on every render
const fetchTransactions = useCallback(async () => {
    try {
        const response = await fetch(`${API_URL}/transactions/${userId}`);
        const data = await response.json();
        setTransactions(data);
    } catch (error) {
        console.error("Error fetching transactions:", error);
    } 
    }, [userId])

    const fetchSummary = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
            const data = await response.json();
            setSummary(data);
        } catch (error) {
            console.error("Error fetching summary:", error);
        }
    }, [userId]);

    const loadData = useCallback(async () => {
        if (!userId) return;

        setIsLoading(true);
        try{
            // can be run in parallel
        await Promise.all([fetchTransactions(), fetchSummary()]);
        } catch (error) {  
            console.error("Error loading data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [userId, fetchTransactions, fetchSummary]);

    const deleteTransaction = async (transactionId) => {
        try {
            const response = await fetch(`${API_URL}/transactions/${transactionId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete transaction');
            
            // Refresh data after deletion
            loadData();
            Alert.alert("Transaction deleted successfully");
        } catch (error) {
            console.error("Error deleting transaction:", error);
            Alert.alert("Error", error.message);
        }

        return { transactions, summary, isloading, loadData, deleteTransaction}; 
    };
    }