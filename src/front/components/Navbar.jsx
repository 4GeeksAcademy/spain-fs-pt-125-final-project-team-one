import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Login } from "./Login";
import { Register } from "./Register";
import { toast } from 'react-toastify';

export const Navbar = () => {

    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const handleLogout = () => {

        localStorage.removeItem("jwt-token");

        dispatch({ type: "LOGOUT" });

        toast.info('Sesión cerrada');

        setTimeout(() => {
            dispatch({ type: "SET_MESSAGE", payload: null });
        }, 1000);

        navigate("/");
    };


    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">Nombre APP</Link>

                    {store.token ? (
                        <>
                            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/market">Lista de activos</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/cartera">Cartera</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/operaciones">Operaciones</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/user/perfil">Perfil</Link>
                                    </li>
                                </ul>

                                <button className="btn btn-danger" onClick={handleLogout}>
                                    Logout
                                </button>
                            </div>
                        </>

                    ) : (
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/market">Lista de activos</Link>
                                </li>
                            </ul>
                            <div className="ms-auto d-flex gap-2">

                                <button className="btn btn-outline-primary"
                                    data-bs-toggle="modal"
                                    data-bs-target="#loginModal"
                                    onClick={() => dispatch({ type: "SET_MESSAGE", payload: null })}
                                >
                                    Login
                                </button>
                                <button className="btn btn-primary"
                                    data-bs-toggle="modal"
                                    data-bs-target="#registerModal"
                                    onClick={() => dispatch({ type: "SET_MESSAGE", payload: null })}
                                >
                                    Registrarse
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>
            <Login id="loginModal" />
            <Register id="registerModal" />
        </>
    );
};
