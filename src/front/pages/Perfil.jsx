import React, { useEffect } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";



export const Perfil = () => {

    const { store, dispatch } = useGlobalReducer()

    // Datos de ejemplo - luego los cargarás desde tu backend
    const user = {
        name: "Juan Pérez",
        email: "juan.perez@example.com",
        avatar: "https://placehold.co/400",
        portfolioValue: "$10,500.00",
        totalStocks: 12
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-4 text-center mb-4 mb-md-0">
                                    <img
                                        src={user.avatar}
                                        alt="Profile"
                                        className="rounded-circle img-fluid mb-3"
                                        width="150"
                                        height="150"
                                    />
                                    <h4 className="mb-1">{user.name}</h4>
                                    <p className="text-muted">{user.email}</p>
                                </div>
                                <div className="col-md-8">
                                    <h5 className="mb-4">Información del Perfil</h5>
                                    <div className="mb-3">
                                        <label className="text-muted small">Nombre</label>
                                        <p className="mb-2">{user.name}</p>
                                    </div>
                                    <div className="mb-3">
                                        <label className="text-muted small">Email</label>
                                        <p className="mb-2">{user.email}</p>
                                    </div>

                                    <hr />

                                    {/* <div className="row mt-4">
                                        <div className="col-6">
                                            <div className="text-center p-3 bg-light rounded">
                                                <h5 className="text-primary mb-0">{user.portfolioValue}</h5>
                                                <small className="text-muted">Valor Portfolio</small>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="text-center p-3 bg-light rounded">
                                                <h5 className="text-success mb-0">{user.totalStocks}</h5>
                                                <small className="text-muted">Criptomonedas</small>
                                            </div>
                                        </div>
                                    </div> */}

                                    <div className="mt-4">
                                        <a href="/edit-profile" className="btn btn-primary me-2 mb-2">
                                            <i className="bi bi-pencil"></i> Editar Perfil
                                        </a>
                                        <a href="/change-password" className="btn btn-primary me-2 mb-2">
											<i className="bi bi-key"></i> Cambiar Contraseña
										</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};