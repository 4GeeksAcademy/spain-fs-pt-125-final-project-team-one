import { useParams, useNavigate } from 'react-router-dom';
import useGlobalReducer from '../hooks/useGlobalReducer';
import '../styles/Details.css';

export const Details = () => {
    const { index } = useParams();
    const navigate = useNavigate();
    const { store } = useGlobalReducer();
    const products = store?.api?.data || [];
    const productIndex = parseInt(index, 10);

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

    const product = products[productIndex];

    return (
        <div className="details-container">
            <button className="back-btn" onClick={() => navigate('/')}>
                ← Volver
            </button>

            <div className="product-detail">
                <div className="product-image">
                    <img src={product.image} alt={product.name} />
                </div>

                <div className="product-info">
                    <h1>{product.name}</h1>
                    <p className="price">${(product.current_price ?? product.price ?? 0).toFixed(2)}</p>
                    <p className="description">{product.description ?? product.symbol ?? ''}</p>
                    <button className="add-to-cart">Agregar al carrito</button>
                </div>
            </div>
        </div>
    );
};

export default Details;