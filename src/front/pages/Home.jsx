import React, { useEffect } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";


export const Home = () => {

	const { store, dispatch } = useGlobalReducer()

	const loadMessage = async () => {
		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL

			if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

			const response = await fetch(backendUrl + "/api/hello")
			const data = await response.json()

			if (response.ok) dispatch({ type: "set_hello", payload: data.message })

			return data

		} catch (error) {
			if (error.message) throw new Error(
				`Could not fetch the message from the backend.
				Please check if the backend is running and the backend port is public.`
			);
		}

	}

	useEffect(() => {
		loadMessage()
	}, [])

	return (
		<div>
			<div className="bg-primary text-white py-5 text-center">
				<div className="container">
					<h1 className="display-4 fw-bold mb-3">
						Nombre App
					</h1>
					<p className="lead mb-4">
						Gestiona y analiza tus inversiones en el mercado de criptomonedas
					</p>
					<a className="btn btn-light btn-lg me-2">
						Registrate!
					</a>
					<a className="btn btn-outline-light btn-lg">
						Entrar
					</a>
				</div>
			</div>
			<div className="container py-5">
				<div className="row mb-5">
					<div className="col-lg-12 text-center">
						<h2 className="mb-3">Sobre Nosotros</h2>
						<p className="lead text-muted">
							Una herramienta simple y poderosa para gestionar tus inversiones.
						</p>
						{store.message && (
							<div className="alert alert-info mt-3">
								<span>{store.message}</span>
							</div>
						)}
					</div>
				</div>
				<div className="row mb-4">
					<div className="col-lg-12 text-center mb-4">
						<h2>¿Qué puedes hacer con Nombre APP?</h2>
						<p className="text-muted">Descubre todas las funcionalidades que tenemos para ti</p>
					</div>
				</div>
				<div className="row g-4">
					<div className="col-md-6 col-lg-4">
						<div className="card h-100 shadow-sm">
							<div className="card-body text-center">
								<div className="mb-3">
									<i className="bi bi-wallet2 text-primary" style={{ fontSize: '3rem' }}></i>
								</div>
								<h5 className="card-title">Gestiona tu cartera</h5>
								<p className="card-text">
									Añade, elimina y organiza tus acciones. Registra todas tus transacciones
									de compra y venta con facilidad.
								</p>
							</div>
						</div>
					</div>
					<div className="col-md-6 col-lg-4">
						<div className="card h-100 shadow-sm">
							<div className="card-body text-center">
								<div className="mb-3">
									<i className="bi bi-graph-up text-success" style={{ fontSize: '3rem' }}></i>
								</div>
								<h5 className="card-title">Seguimiento en Tiempo Real</h5>
								<p className="card-text">
									Consulta los precios actuales de tus acciones y visualiza cómo evoluciona
									el valor de tu portfolio minuto a minuto.
								</p>
							</div>
						</div>
					</div>
					<div className="col-md-6 col-lg-4">
						<div className="card h-100 shadow-sm">
							<div className="card-body text-center">
								<div className="mb-3">
									<i className="bi bi-cash-coin text-warning" style={{ fontSize: '3rem' }}></i>
								</div>
								<h5 className="card-title">Ganancias y Pérdidas</h5>
								<p className="card-text">
									Visualiza de forma clara tus ganancias y pérdidas totales, tanto en
									porcentaje como en valores absolutos.
								</p>
							</div>
						</div>
					</div>
					<div className="col-md-6 col-lg-4">
						<div className="card h-100 shadow-sm">
							<div className="card-body text-center">
								<div className="mb-3">
									<i className="bi bi-clock-history text-danger" style={{ fontSize: '3rem' }}></i>
								</div>
								<h5 className="card-title">Historial Completo</h5>
								<p className="card-text">
									Accede al historial completo de todas tus transacciones y revisa
									el rendimiento histórico de tus inversiones.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
