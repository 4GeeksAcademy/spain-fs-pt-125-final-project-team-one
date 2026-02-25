// Import necessary hooks and functions from React.
import { useContext, useReducer, createContext, useEffect } from "react";
import storeReducer, { initialStore } from "../store"  // Import the reducer and the initial state.
// Import the logout function to handle unauthorized access.
// Create a context to hold the global state of the application
// We will call this global state the "store" to avoid confusion while using local states
const StoreContext = createContext()

// Define a provider component that encapsulates the store and warps it in a context provider to 
// broadcast the information throught all the app pages and components.
export function StoreProvider({ children }) {
    // Initialize reducer with the initial state.
    const [store, dispatch] = useReducer(storeReducer, initialStore())

    const handleLogout = () => {
        localStorage.removeItem("jwt-token");

        dispatch({ type: "LOGOUT" });

        setTimeout(() => {
            dispatch({ type: "SET_MESSAGE", payload: null });
        }, 1000);


    };


    useEffect(() => {

        const fetchData = async () => {
            if (store.token) {
                try {
                    const userresponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('jwt-token')}`
                        }
                    });
                    if (userresponse.status === 401) {
                        handleLogout();
                        console.log('Token inválido o expirado. Cerrando sesión.');

                    }
                } catch (error) {
                    console.error('Error al obtener perfil del usuario:', error);
                }
            }
            const options = { method: 'GET', headers: { 'x-cg-demo-api-key': 'CG-zEzVoDknRQgmq3QKL5wFqXh3' } };

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
    if (store.api.loading) return <p>Cargando...</p>;
    if (store.api.error) return <p>Error: {store.api.error}</p>;

    // Provide the store and dispatch method to all child components.
    return <StoreContext.Provider value={{ store, dispatch }}>
        {children}
    </StoreContext.Provider>
}

// Custom hook to access the global state and dispatch function.
export default function useGlobalReducer() {
    const context = useContext(StoreContext)
    if (!context) {
        throw new Error('useGlobalReducer must be used within StoreProvider');
    }
    const { dispatch, store } = context
    return { dispatch, store };
}

