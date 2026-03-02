import React, { useEffect, useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';

export const Portfolio = () => {
	const { store, dispatch } = useGlobalReducer()
	const [portfolio, setPortfolio] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	// Cargar portfolio desde el backend
	const loadPortfolio = async () => {
		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL
			const token = localStorage.getItem("jwt-token")

			if (!token) {
				setError("No hay sesión activa")
				setLoading(false)
				return
			}

			const response = await fetch(`${backendUrl}/api/user/portfolio-data`, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			})

			const data = await response.json()

			if (response.ok) {
				setPortfolio(data)
			} else {
				setError(data.msg || "Error al cargar portfolio")
			}
		} catch (error) {
			console.error('Error cargando portfolio:', error)
			setError("Error de conexión con el servidor")
		} finally {
			setLoading(false)
		}
	}

	// vender una criptomoneda del portfolio (usa totalValue como precio)
	const handleSellCrypto = async (portfolioId, totalValue) => {
		const token = localStorage.getItem("jwt-token")
		if (!token) {
			toast.info('Necesitas iniciar sesión')
			return
		}

		if (!window.confirm('¿Estás seguro de que quieres vender esta cripto? Se registrará una operación de venta con el valor total mostrado.')) {
			return
		}

		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL
			// utilizamos el valor total pasado por el frontend
			const total_price_spent = totalValue
			const response = await fetch(`${backendUrl}/api/user/portfolio/${portfolioId}`, {
				method: 'DELETE',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ total_price_spent })
			})

			const data = await response.json()
			if (!response.ok) {
				throw new Error(data.msg || 'Error al vender del portfolio')
			}

			toast.success('Cripto vendida y operación registrada')
			// recargar portfolio
			loadPortfolio()
		} catch (err) {
			console.error('Error vendiendo cripto:', err)
			toast.error('No se pudo vender la cripto: ' + (err.message || err))
		}
	}

	useEffect(() => {
		loadPortfolio()
	}, [])

	if (loading) {
		return (
			<div className="container py-5 text-center">
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">Cargando...</span>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="container py-5 text-center">
				<div className="alert alert-danger">{error}</div>
				<a href="/login" className="btn btn-primary">Ir a Login</a>
			</div>
		)
	}

	if (!portfolio) {
		return (
			<div className="container py-5 text-center">
				<p>No se pudo cargar el portfolio</p>
			</div>
		)
	}

	return (
		<div className="container py-4">
			{/* Header */}
			<div className="d-flex justify-content-between align-items-center mb-4">
				<h2 className="text-white">
					<i className="bi bi-wallet2 me-2 text-white"></i>
					Lista de activos
				</h2>
			</div>

			{/* Resumen del Portfolio */}
			<div className="row mb-4">
				{/* Valor Total */}
				<div className="col-md-3 mb-3">
					<div className="card shadow-sm h-100 border-warning border-opacity-25 bg-warning bg-opacity-10">
						<div className="card-body text-center">
							<p className="text-warning mb-2 small"><strong>Valor Total</strong></p>
							<h4 className="mb-0 text-white">${portfolio.totalValue.toLocaleString()}</h4>
						</div>
					</div>
				</div>

				{/* Invertido */}
				<div className="col-md-3 mb-3">
					<div className="card shadow-sm h-100 border-warning border-opacity-25 bg-warning bg-opacity-10">
						<div className="card-body text-center">
							<p className="text-warning mb-2 small"><strong>Invertido</strong></p>
							<h4 className="mb-0 text-white">${portfolio.totalInvested.toLocaleString()}</h4>
						</div>
					</div>
				</div>

				{/* Ganancia/Pérdida */}
				<div className="col-md-3 mb-3">
					<div className="card shadow-sm h-100 border-warning border-opacity-25 bg-warning bg-opacity-10">
						<div className="card-body text-center">
							<p className="text-warning mb-2 small"><strong>Ganancia/Pérdida</strong></p>
							<h4 className={`mb-0 ${portfolio.profitLoss >= 0 ? 'text-success' : 'text-danger'}`}>
								${portfolio.profitLoss >= 0 ? '+' : ''}{portfolio.profitLoss.toLocaleString()}
							</h4>
						</div>
					</div>
				</div>

				{/* Porcentaje */}
				<div className="col-md-3 mb-3">
					<div className="card shadow-sm h-100 border-warning border-opacity-25 bg-warning bg-opacity-10">
						<div className="card-body text-center">
							<p className="text-warning mb-2 small"><strong>Rendimiento</strong></p>
							<h4 className={`mb-0 ${portfolio.profitLossPercentage >= 0 ? 'text-success' : 'text-danger'}`}>
								{portfolio.profitLossPercentage >= 0 ? '+' : ''}{portfolio.profitLossPercentage}%
							</h4>
						</div>
					</div>
				</div>
			</div>

			{/* Lista de Criptomonedas */}
			{portfolio.cryptos && portfolio.cryptos.length > 0 ? (
				<div className="card shadow-sm border-warning border-opacity-25 bg-warning bg-opacity-10">
					<div className="card-header">
						<h5 className="mb-0 text-warning">Mis Criptomonedas</h5>
					</div>
					<div className="card-body p-0">
						<div className="table-responsive">
							<table className="table table-hover mb-0 table-warning table-opacity-10">
								<thead className="table-warning table-opacity-25">
									<tr>
										<th>Cripto</th>
										<th className="text-end">Cantidad</th>
										<th className="text-end">Precio Promedio</th>
										<th className="text-end">Precio Actual</th>
										<th className="text-end">Valor Total</th>
										<th className="text-end">Ganancia/Pérdida</th>
										<th className="text-center">Acciones</th>
									</tr>
								</thead>
								<tbody>
									{portfolio.cryptos.map((crypto) => (
										<tr key={crypto.id}>
											<td>
												<div className="d-flex align-items-center">
													{crypto.image ? (
														<img
															src={crypto.image}
															alt={crypto.symbol}
															style={{ width: '40px', height: '40px' }}
															className="me-2 rounded-circle"
														/>
													) : (
														<div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
															style={{ width: '40px', height: '40px', fontSize: '14px', fontWeight: 'bold' }}>
															{crypto.symbol.substring(0, 2)}
														</div>
													)}
													<div>
														<div className="fw-bold">{crypto.symbol}</div>
														<small className="text-dark">{crypto.name}</small>
													</div>
												</div>
											</td>
											<td className="text-end align-middle">{crypto.amount}</td>
											<td className="text-end align-middle">${crypto.avgBuyPrice.toLocaleString()}</td>
											<td className="text-end align-middle">${crypto.currentPrice.toLocaleString()}</td>
											<td className="text-end align-middle fw-bold">${crypto.totalValue.toLocaleString()}</td>
											<td className="text-end align-middle">
												<div className={crypto.profitLoss >= 0 ? 'text-success' : 'text-danger'}>
													<div className="fw-bold">
														{crypto.profitLoss >= 0 ? '+' : ''}${Math.abs(crypto.profitLoss).toLocaleString()}
													</div>
													<small>
														{crypto.profitLoss >= 0 ? '+' : ''}{crypto.profitLossPercentage}%
													</small>
												</div>
											</td>
											<td className="text-center align-middle">
												<button className="btn btn-sm btn-danger" onClick={() => handleSellCrypto(crypto.id, crypto.totalValue)}>
													Vender
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			) : (
				/* Mensaje si no hay criptos */
				<div className="card shadow-sm border-warning border-opacity-25 bg-warning bg-opacity-10">
					<div className="card-body text-center py-5">
						<i className="bi bi-wallet2 text-warning" style={{ fontSize: '4rem' }}></i>
						<h5 className="mt-3 text-white">No tienes criptomonedas aún</h5>
						<p className="text-warning">Comienza agregando tu primera transacción</p>
						<button className="btn btn-warning mt-2">
							<Link className="text-dark" to="/market"> <i className="bi bi-plus-circle me-2"></i>Añadir Primera Cripto</Link>

						</button>
					</div>
				</div>
			)}

			{/* Estadísticas adicionales */}
			{portfolio.cryptos && portfolio.cryptos.length > 0 && (
				<div className="row mt-4">
					<div className="col-md-6 mb-3">
						<div className="card shadow-sm border-warning border-opacity-25 bg-warning bg-opacity-10">
							<div className="card-body">
								<h6 className="card-title mb-3 text-warning">
									<i className="bi bi-trophy text-warning me-2"></i>
									Top Performer
								</h6>
								<div className="d-flex justify-content-between align-items-center">
									<div>
										<div className="fw-bold text-white">{portfolio.cryptos[0].symbol}</div>
										<small className="text-warning">{portfolio.cryptos[0].name}</small>
									</div>
									<div className="text-success fw-bold">
										+{portfolio.cryptos[0].profitLossPercentage}%
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="col-md-6 mb-3">
						<div className="card shadow-sm border-warning border-opacity-25 bg-warning bg-opacity-10">
							<div className="card-body">
								<h6 className="card-title mb-3 text-info">
									<i className="bi bi-pie-chart text-info me-2"></i>
									Diversificación
								</h6>
								<p className="mb-0 text-white">
									<span className="fw-bold">{portfolio.cryptos.length}</span> criptomonedas diferentes
								</p>
								<div className="progress mt-2" style={{ height: '8px' }}>
									<div className="progress-bar bg-success" style={{ width: '50%' }}></div>
									<div className="progress-bar bg-primary" style={{ width: '35%' }}></div>
									<div className="progress-bar bg-warning" style={{ width: '15%' }}></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};