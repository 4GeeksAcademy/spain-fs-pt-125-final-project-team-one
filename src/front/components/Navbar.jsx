import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Login } from "./Login";
import { Register } from "./Register";

export const Navbar = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("jwt-token");
        dispatch({ type: "LOGOUT" });

        // Enviamos el objeto con status para que sea compatible con tu lógica de alertas
        dispatch({
            type: "SET_MESSAGE",
            payload: { text: "👋 ¡Sesión cerrada con éxito!", status: 200 }
        });

        setTimeout(() => {
            dispatch({ type: "SET_MESSAGE", payload: null });
        }, 3000);

        navigate("/");
    };


    return (
        <>
            <nav className="navbar navbar-light bg-light mb-3 shadow-sm">
                <div className="container">
                    <div className="ml-auto d-flex gap-2">
                        {/* 2. Renderizado condicional según si hay token */}
                        {!store.token ? (
                            <>
                                <button className="btn btn-outline-primary"
                                    data-bs-toggle="modal"
                                    data-bs-target="#loginModal"
                                    // LIMPIEZA TOTAL AL ABRIR:
                                    onClick={() => dispatch({ type: "SET_MESSAGE", payload: null })}
                                >
                                    Login
                                </button>
                                <button className="btn btn-primary"
                                    data-bs-toggle="modal"
                                    data-bs-target="#registerModal"
                                    // LIMPIEZA TOTAL AL ABRIR:
                                    onClick={() => dispatch({ type: "SET_MESSAGE", payload: null })}
                                >
                                    Registrarse
                                </button>
                            </>
                        ) : (
                            <button className="btn btn-danger" onClick={handleLogout}>
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            </nav>
            <div className="container">
                {store.message && !store.token ? (
                    <div className={`alert ${store.message.status >= 200 && store.message.status < 300 ? 'alert-success' : 'alert-danger'} p-2 text-center`}>
                        {store.message.text || store.message}
                    </div>
                ) : null}
            </div>

            {/* 3. Inyectamos los modales en el DOM */}
            {/* Los IDs deben coincidir exactamente con el data-bs-target de arriba */}
            <Login id="loginModal" />
            <Register id="registerModal" />
        </>
    );
};
