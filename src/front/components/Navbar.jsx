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
        <div className="container-fluid bg-success">
            <nav className="navbar navbar-expand-lg">
                <div className="container-fluid">
                    <Link className="navbar-brand text-info text-gradient" to="/"><strong className="fs-2">IKHAMI</strong></Link>

                    {store.token ? (
                        <>
                            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/market"><strong className="fs-4">Lista de activos</strong></Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/cartera"><strong className="fs-4">Cartera</strong></Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/operaciones"><strong className="fs-4">Operaciones</strong></Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/user/perfil"><strong className="fs-4">Perfil</strong></Link>
                                    </li>
                                </ul>

                                <button className="btn btn-danger text-dark fs-4" onClick={handleLogout}>
                                    Logout
                                </button>
                            </div>
                        </>

                    ) : (
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/market"><strong className="fs-4">Monedas</strong></Link>
                                </li>
                            </ul>
                            <div className="ms-auto d-flex gap-4">

                                <button className="btn btn-dark fs-4"
                                    data-bs-toggle="modal"
                                    data-bs-target="#loginModal"
                                    onClick={() => dispatch({ type: "SET_MESSAGE", payload: null })}
                                >
                                    Login
                                </button>
                                <button className="btn btn-warning text-dark fs-4"
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
        </div>
    );
};
