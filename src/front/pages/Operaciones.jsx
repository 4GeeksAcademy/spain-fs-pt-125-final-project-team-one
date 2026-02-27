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
        : operaciones.filter(op => op.tipo === filtro);

    if (loading) return <div className="text-center p-5"><div className="spinner-border" role="status"><span className="visually-hidden">Cargando...</span></div></div>;
    if (error) return <div className="alert alert-danger m-4">Error: {error}</div>;

    return (
        <div className="container-fluid p-4 mt-5">
            <h1 className="mb-4 text-center">Mis Operaciones</h1>

            <div className="d-flex gap-2 justify-content-center mb-4 flex-wrap">
                <button
                    className={`btn ${filtro === 'todas' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFiltro('todas')}
                >
                    Todas
                </button>
                <button
                    className={`btn ${filtro === 'compra' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFiltro('compra')}
                >
                    Compras
                </button>
                <button
                    className={`btn ${filtro === 'venta' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFiltro('venta')}
                >
                    Ventas
                </button>
            </div>

            {operacionesFiltradas.length === 0 ? (
                <div className="alert alert-info text-center">No hay operaciones</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead className="table-light">
                            <tr>
                                <th>Fecha</th>
                                <th>Tipo</th>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Precio</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {operacionesFiltradas.map(op => (
                                <tr key={op.id}>
                                    <td>{new Date(op.fecha).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`badge ${op.tipo === 'compra' ? 'bg-info' : 'bg-success'}`}>
                                            {op.tipo}
                                        </span>
                                    </td>
                                    <td>{op.producto}</td>
                                    <td>{op.cantidad}</td>
                                    <td>${op.precio.toFixed(2)}</td>
                                    <td>${op.total.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};