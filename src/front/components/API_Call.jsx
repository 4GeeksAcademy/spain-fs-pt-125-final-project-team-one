import React, { useEffect } from 'react';
import useGlobalReducer from '../hooks/useGlobalReducer';

const API_Call = () => {
    const { store, dispatch } = useGlobalReducer();
    const { data, loading, error } = store.api;

    useEffect(() => {
        const fetchData = async () => {
            const options = { method: 'GET', headers: { 'x-cg-demo-api-key': 'PONER API KEY PARA USAR'} };

            try {
                dispatch({ type: 'API_LOADING' });

                const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd', options);
                if (!response.ok) {
                    throw new Error('Error en la API');
                }

                const result = await response.json();
                dispatch({
                    type: 'API_SUCCESS',
                    payload: result
                });
            } catch (err) {
                dispatch({
                    type: 'API_ERROR',
                    payload: err.message
                });
            }
        };

        fetchData();
    }, [dispatch]);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;
};

export default API_Call;