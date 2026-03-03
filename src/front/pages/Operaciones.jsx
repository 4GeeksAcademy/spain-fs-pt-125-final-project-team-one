import React, { useState, useEffect } from 'react';

export const Operaciones = () => {
    const [operaciones, setOperaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtro, setFiltro] = useState('todas');

    useEffect(() => {
        cargarOperaciones();
    }, []);

    const cargarOperaciones = async () => {
        try {
            setLoading(true);
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const token = localStorage.getItem("jwt-token");

            if (!token) {
                setError("No hay sesión activa");
                setLoading(false);
                return;
            }

            const response = await fetch(`${backendUrl}/api/operaciones`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Error al cargar operaciones');

            const data = await response.json();
            setOperaciones(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const operacionesFiltradas = filtro === 'todas'
        ? operaciones
        : operaciones.filter(op => {
            const isCompra = op.tipo === 'compra' || op.bought === true;
            if (filtro === 'compra') return isCompra;
            return !isCompra;
        });

    if (loading) return <div className="text-center p-5"><div className="spinner-border" role="status"><span className="visually-hidden">Cargando...</span></div></div>;
    if (error) return <div className="alert alert-danger m-4">Error: {error}</div>;

    return (
        <div className="container-fluid bg-dark py-5 px-0 ">
            <h1 className="mb-5 px-3 text-center text-warning">
                <i className="bi bi-currency-exchange me-2"></i>  Mis Operaciones</h1>

            {operacionesFiltradas.length === 0 ? (
                <div className="alert alert-info text-center bg-secondary text-white w-25 mx-auto">
                    <i className="bi bi-info-circle me-2"></i>No hay operaciones</div>
            ) : (
                <div className="table-responsive my-3 border-top border-bottom border-dark mx-5">
                    <table className="table table-striped table-hover text-center">
                        <thead className="table-warning text-dark border-bottom border-dark">
                            <tr>
                                <th><i className="bi bi-calendar3 me-2"></i>Fecha</th>
                                <th><i className="bi bi-arrow-left-right me-2"></i>Operación</th>
                                <th><i className="bi bi-box-seam me-2"></i>Producto</th>
                                <th><i className="bi bi-hash me-2"></i>Cantidad</th>
                                <th><i className="bi bi-tag me-2"></i>Precio</th>
                                <th><i className="bi bi-calculator me-2"></i>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {operacionesFiltradas.map(op => {
                                const isCompra = op.tipo === 'compra' || op.bought === true;
                                const displayTipo = isCompra ? 'compra' : 'venta';
                                return (
                                    <tr className="table-warning table-opacity-25" key={op.id}>
                                        <td>{new Date(op.fecha).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`badge ${isCompra ? 'bg-info' : 'bg-success'}`}>
                                                <i className={`bi ${isCompra ? 'bi-download' : 'bi-upload'} me-1`}></i>
                                                {displayTipo}
                                            </span>
                                        </td>
                                        <td>{op.producto}</td>
                                        <td>{op.cantidad}</td>
                                        <td>${op.precio.toFixed(2)}</td>
                                        <td>${op.total.toFixed(2)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};