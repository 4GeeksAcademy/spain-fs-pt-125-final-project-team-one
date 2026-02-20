import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useRef, memo } from 'react';
import useGlobalReducer from '../hooks/useGlobalReducer';

export const Details = () => {
    const { index } = useParams();
    const navigate = useNavigate();
    const { store } = useGlobalReducer();
    const products = store?.api?.data || [];
    const productIndex = parseInt(index, 10);
    const product = products[productIndex];
    const [coin, setCoin] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [savingFavorite, setSavingFavorite] = useState(false);
    const tvContainerId = `tv-widget-${product?.id ?? productIndex}`;
    const tvScriptRef = useRef(null);
    const [addingPortfolio, setAddingPortfolio] = useState(false);
    const [quantity, setQuantity] = useState(1);
    // Validar que el índice existe
    if (isNaN(productIndex) || productIndex < 0 || productIndex >= products.length) {
        return (
            <div className="details-container error">
                <h2>Producto no encontrado</h2>
                <p>El índice solicitado no existe en nuestro catálogo.</p>
                <button onClick={() => navigate('/')}>Volver al catálogo</button>
            </div>
        );
    }

    const handleAddPortfolioClick = async () => {
        const token = store.token || localStorage.getItem('jwt-token');

        if (!token ) {
            alert('Por favor inicia sesión para agregar al portfolio');
            return;
        }

        setAddingPortfolio(true);
        const total_price_spent = quantity * (product.current_price ?? 0);
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
            const response = await fetch(`${backendUrl}/api/user/portfolio`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ product_id: product.id, amount: quantity, total_price_spent: total_price_spent }),
            });

            if (!response.ok) {
                throw new Error('Error al agregar al portfolio');
            }

            const data = await response.json();
            alert('Moneda agregada al portfolio correctamente');
        } catch (err) {
            console.error('Error:', err);
            alert('Error al agregar al portfolio: ' + err.message);
        } finally {
            setAddingPortfolio(false);
        }
    };

    const handleFavoriteClick = async () => {
        const token = store.token || localStorage.getItem('jwt-token');
        

        if (!token) {
            alert('Por favor inicia sesión para agregar favoritos');
            return;
        }

        setIsFavorite(!isFavorite);
        setSavingFavorite(true);

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
            const response = await fetch(`${backendUrl}/api/user/favorites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ product_id: product.id}),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.msg || 'Error al guardar favorito');
            }

            const data = await response.json();
            setIsFavorite(data.is_favorite);
        } catch (err) {
            console.error('Error:', err);
            setIsFavorite(!isFavorite);
            alert('Error al guardar favorito: ' + err.message);
        } finally {
            setSavingFavorite(false);
        }
    };


    useEffect(() => {
        if (!product || !product.id) return;
        setLoading(true);
        setError(null);
        const options = { method: 'GET', headers: { 'x-cg-demo-api-key': 'CG-zEzVoDknRQgmq3QKL5wFqXh3' } };
        fetch(`https://api.coingecko.com/api/v3/coins/${product.id}`, options)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data) => setCoin(data))
            .catch((err) => setError(err.message || 'Error al obtener datos'))
            .finally(() => setLoading(false));
    }, [product]);

    useEffect(() => {
        if (!coin || !coin.symbol) return;

        const containerId = tvContainerId;

        const initWidget = () => {
            try {
                if (!window.TradingView) return;
                const el = document.getElementById(containerId);
                if (el) el.innerHTML = '';

                new window.TradingView.widget({
                    container_id: containerId,
                    hide_side_toolbar: false,
                    details: false,
                    width: '100%',
                    height: 420,
                    symbol: `BINANCE:${String(coin.symbol).toUpperCase()}USDT`,
                    interval: 'D',
                    timezone: 'Etc/UTC',
                    theme: 'light',
                    style: '1',
                    locale: 'es',
                    toolbar_bg: '#f1f3f6',
                    enable_publishing: false,
                    allow_symbol_change: true,
                    details: true,
                });
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error('TradingView init error', e);
            }
        };

        if (window.TradingView) {
            initWidget();
            return;
        }

        if (!tvScriptRef.current) {
            const script = document.createElement('script');
            script.src = 'https://s3.tradingview.com/tv.js';
            script.async = true;
            script.onload = initWidget;
            document.head.appendChild(script);
            tvScriptRef.current = script;
        } else {
            tvScriptRef.current.onload = initWidget;
        }

        return () => {
            const el = document.getElementById(containerId);
            if (el) el.innerHTML = '';
        };
    }, [coin, tvContainerId]);


    return (
        <div className="container py-4">
            <div className="mb-3">
                <button className="btn btn-link p-0" onClick={() => navigate('/market')}>← Volver al mercado</button>
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="row g-4">
                        <div className="col-md-4 text-center">
                            <img
                                src={(coin && coin.image?.large) || product.image}
                                alt={product.name}
                                className="img-fluid rounded"
                                style={{ maxHeight: 320, objectFit: 'contain' }}
                            />
                            <div className="mt-3">
                                <ul className="list-group list-group-flush text-start">
                                    <li className="list-group-item d-flex justify-content-between align-items-center py-2">
                                        <span className="fw-bold">Precio</span>
                                        <span className="text-end">{coin?.market_data?.current_price?.usd ?? product.price ?? 'N/A'} $</span>
                                    </li>

                                    <li className="list-group-item d-flex justify-content-between align-items-center py-2">
                                        <span className="fw-bold">Market Cap</span>
                                        <span className="text-end">{coin?.market_data?.market_cap?.usd ?? 'N/A'} $</span>
                                    </li>

                                    <li className="list-group-item d-flex justify-content-between align-items-center py-2">
                                        <span className="fw-bold">Volumen (24h)</span>
                                        <span className="text-end">{coin?.market_data?.total_volume?.usd ?? 'N/A'} $</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-md-8">
                            <h2 className="mb-1">
                                {product.name}{' '}
                                <small className="text-muted">{product.symbol ? `(${product.symbol.toUpperCase()})` : ''}</small>
                                <button
                                    onClick={handleFavoriteClick}
                                    disabled={savingFavorite}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: savingFavorite ? 'not-allowed' : 'pointer',
                                        marginLeft: '10px',
                                        fontSize: '1.3rem',
                                        padding: 0,
                                        color: isFavorite ? '#FFD700' : '#D3D3D3',
                                        transition: 'color 0.2s ease',
                                        opacity: savingFavorite ? 0.6 : 1,
                                    }}
                                    title={isFavorite ? 'Remover de favoritos' : 'Agregar a favoritos'}
                                >
                                    ☆
                                </button>
                            </h2>

                            {loading ? (
                                <div className="d-flex align-items-center">
                                    <div className="spinner-border text-primary me-3" role="status" aria-hidden="true"></div>
                                    <div>Cargando detalles...</div>
                                </div>
                            ) : error ? (
                                <div className="alert alert-danger">Error: {error}</div>
                            ) : (
                                <>

                                    <div className="mb-2">
                                        <span className="badge bg-secondary me-2">Rank: {coin?.market_cap_rank ?? 'N/A'}</span>

                                    </div>

                                    <p className="text-muted">
                                        {coin?.description?.en
                                            ? String(coin.description.en).replace(/<[^>]+>/g, '').slice(0, 400)
                                            : product.description ?? ''}
                                    </p>

                                    <div id={tvContainerId} className="mt-3" />

                                    {coin?.links?.homepage?.[0] ? (
                                        <p className="mt-3">
                                            <a href={coin.links.homepage[0]} target="_blank" rel="noreferrer" className="btn btn-link">
                                                Página oficial de la moneda
                                            </a>
                                        </p>
                                    ) : null}

                                    <p className="text-muted small">Última actualización: {coin?.last_updated ?? 'N/A'}</p>

                                    <div className="mt-3">
                                        <div className="mb-3">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <div className='d-flex align-items-center gap-2'>
                                                <label htmlFor="quantitySlider" className="form-label">
                                                    Cantidad a agregar:
                                                </label>
                                                
                                                    <input
                                                        type="number"
                                                        className="form-control form-control-sm"
                                                        style={{ width: "100px" }}
                                                        min="0.01"
                                                        max="1000"
                                                        step="0.01"
                                                        value={quantity}
                                                        onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                                                    /></div>
                                                    <strong>{(quantity * (product.current_price ?? 0)).toFixed(2)} $</strong>
                                                
                                            </div>
                                            <input
                                                type="range"
                                                className="form-range"
                                                id="quantitySlider"
                                                min="0.01"
                                                max="1000"
                                                step="0.01"
                                                value={quantity}
                                                onChange={(e) => setQuantity(parseFloat(e.target.value))}
                                            />

                                        </div>
                                        <button
                                            className="btn btn-primary me-2"
                                            onClick={handleAddPortfolioClick}
                                            disabled={addingPortfolio}
                                        >
                                            Agregar al portfolio
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Details;




