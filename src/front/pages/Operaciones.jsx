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

            <div className="d-flex gap-4 justify-content-center mb-5 flex-wrap ">
                <button
                    className={`btn ${filtro === 'todas' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFiltro('todas')}
                >
                    <i className="bi bi-list-ul"></i> Todas
                </button>
                <button
                    className={`btn ${filtro === 'compra' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFiltro('compra')}
                >
                    <i className="bi bi-cart-plus"></i>  Compras
                </button>
                <button
                    className={`btn ${filtro === 'venta' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFiltro('venta')}
                >
                    <i className="bi bi-cash-stack"></i>   Ventas
                </button>
            </div>

            {operacionesFiltradas.length === 0 ? (
                <div className="alert alert-info text-center bg-secondary text-white w-25 mx-auto">
                    <i className="bi bi-info-circle me-2"></i>No hay operaciones</div>
            ) : (
                <div className="table-responsive w-100 my-3 border-top border-bottom border-secondary">
                    <table className="table table-striped table-hover w-100 m-0 text-center">
                        <thead className="encabezado-estilo border-bottom border-secondary">
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
                                    <tr className="table-secondary" key={op.id}>
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