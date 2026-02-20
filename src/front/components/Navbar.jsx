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

        setTimeout(() => {
            dispatch({ type: "SET_MESSAGE", payload: null });
        }, 3000);

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
                                        <Link className="nav-link active" to="/">Home</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/market">Lista de activos</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/cartera">Cartera</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/operaciones">Operaciones</Link>
                                    </li>
                                    <li className="nav-item dropdown">
                                        <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            Perfil
                                        </a>
                                        <ul className="dropdown-menu">
                                            <li><Link className="dropdown-item" to="/perfil">Mi Perfil</Link></li>
                                            <li><hr className="dropdown-divider" /></li>
                                            <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
                                        </ul>
                                    </li>
                                </ul>
                                <form className="d-flex me-3" role="search">
                                    <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                                    <button className="btn btn-outline-success" type="submit">Buscar</button>
                                </form>
                                <button className="btn btn-danger" onClick={handleLogout}>
                                    Logout
                                </button>
                            </div>
                        </>

                    ) : (

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
                    )}
                </div>
            </nav>

            <div className="container mt-2">
                {store.message ? (
                    <div className={`alert ${store.message.status >= 200 && store.message.status < 300 ? 'alert-success' : 'alert-danger'} p-2 text-center`}>
                        {store.message.msg || store.message}
                    </div>
                ) : null}
            </div>
            <Login id="loginModal" />
            <Register id="registerModal" />
        </>
    );
};
