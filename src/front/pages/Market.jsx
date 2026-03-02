import React from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Market = () => {
    const { store } = useGlobalReducer();

    if (store.api.loading) {
        return <div className="text-center py-5">Cargando productos...</div>;
    }

    if (store.api.error) {
        return <div className="text-center py-5">Error: {store.api.error}</div>;
    }

    return (
        <div data-bs-theme="dark" className="bg-dark min-vh-100">
            <div className="container py-4 bg-dark text-white ">
                <h1 className="mb-4 text-start display-6 text-white ">Lista de Activos</h1>

                {store.api.data && store.api.data.length > 0 ? (
                    <div className="table-responsive" >
                        <table className="table table-hover">
                            <thead className="table-active ">
                                 <tr> 
                                    <th className="text-center text-warning">#</th>
                                    <th className="text-warning">Icono</th>
                                    <th className=" text-warning">Nombre</th>
                                    <th className="text-end text-warning">Precio</th>
                                    <th className="text-end text-warning">24h %</th>
                                    <th className="text-end text-warning">Volumen</th>
                                    <th className="text-end text-warning">Market Cap</th>
                                    <th className="text-end text-warning">24h Market Cap %</th>
                                </tr>
                            </thead>
                            <tbody>
                                {store.api.data.map((product, index) => (
                                    <tr key={product.id}>
                                        <td className="text-center fw-bold">{index + 1}</td>
                                        <td>
                                            {product.image && (
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    style={{ width: '24px', height: '24px' }}
                                                />
                                            )}
                                        </td>
                                        <td>
                                            <span className="fw-bold"><Link to={`/market/${index}`}>{product.name}</Link></span> <small className="text-muted">{product.symbol.toUpperCase()}</small>
                                        </td>
                                        <td className="text-end fw-bold">${product.current_price.toFixed(2)}</td>
                                        <td className="text-end">
                                            <span className={product.price_change_percentage_24h > 0 ? 'text-success' : 'text-danger'}>
                                                {product.price_change_percentage_24h > 0 ? '↑' : '↓'} {Math.abs(product.price_change_percentage_24h).toFixed(2)}%
                                            </span>
                                        </td>

                                        <td className="text-end">${product.total_volume.toLocaleString()}</td>
                                        <td className="text-end">${product.market_cap.toLocaleString()}</td>
                                        <td className="text-end">
                                            <span className={product.market_cap_change_percentage_24h > 0 ? 'text-success' : 'text-danger'}>
                                                {product.market_cap_change_percentage_24h > 0 ? '↑' : '↓'} {Math.abs(product.market_cap_change_percentage_24h).toFixed(2)}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="alert alert-info text-center">No hay productos disponibles</div>
                )}
            </div>
        </div>

    );
};