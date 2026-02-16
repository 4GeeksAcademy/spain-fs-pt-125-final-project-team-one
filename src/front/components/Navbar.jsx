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
        dispatch({ type: "SET_MESSAGE", payload: "👋 ¡Sesión cerrada!" });
        navigate("/");
    };

    return (
        <>
            <nav className="navbar navbar-light bg-light mb-3 shadow-sm">
                <div className="container">
                    <Link to="/" className="text-decoration-none">
                        <span className="navbar-brand mb-0 h1 text-primary">React App</span>
                    </Link>

                    <div className="ml-auto d-flex gap-2">

                        {/* 2. Renderizado condicional según si hay token */}
                        {!store.token ? (
                            <>
                                <button
                                    className="btn btn-outline-primary"
                                    data-bs-toggle="modal"
                                    data-bs-target="#loginModal"
                                >
                                    Login
                                </button>
                                <button
                                    className="btn btn-primary"
                                    data-bs-toggle="modal"
                                    data-bs-target="#registerModal"
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

            {/* 3. Inyectamos los modales en el DOM */}
            {/* Los IDs deben coincidir exactamente con el data-bs-target de arriba */}
            <Login id="loginModal" />
            <Register id="registerModal" />
        </>
    );
};
