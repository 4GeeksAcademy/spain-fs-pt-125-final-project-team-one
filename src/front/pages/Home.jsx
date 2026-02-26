import React, { useEffect } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";


export const Home = () => {

	const { store, dispatch } = useGlobalReducer()

	return (
		<div data-bs-theme="dark" className="bg-dark text-body min-vh-100">

			<div className="bg-dark pt-5 text-center border-bottom border-secondary border-opacity-10">
				<div className="container">
					<h1 className="display-2 fw-bold mb-2 text-info text-gradient">
						IKHAMI<span className=" fs-6 fw-light text-white-50 my-2 tracking-wide text-capitalize">Crypto Dashboard  </span>
					</h1>
					<h2 className="fs-5 fw-light text-white-75 text-uppercase ls-lg">
						Inteligencia de Mercado en tus Manos
					</h2>
				</div>
			</div>


			<div className="container-fluid py-5">

				<div className="row mb-5">
					<div className="col-lg-12 text-center">
						<h2 className="mb-3">Sobre Nosotros</h2>
						<p className="lead text-muted mx-auto" style={{ textAlign: 'justify' }} >
							En el volátil mundo de las criptomonedas, la claridad es tu activo más valioso. IKHAMI es un Crypto Dashboard de última generación diseñado para ofrecerte una visión panorámica y precisa de tu portfolio. Nuestras potencialidades te permitirán gestionar tus movimientos y analizar tendencias con herramientas de nivel institucional, simplificadas para el inversor moderno.
							<br />Nacimos con una misión clara: eliminar el ruido del mercado. En IKHAMI, combinamos potencia analítica con una interfaz intuitiva para que gestionar tus inversiones sea, por fin, una tarea simple y estratégica.
						</p>
					</div>
				</div>

				<div className="row mb-4">
					<div className="col-lg-12 text-center mb-2">
						<h2>¿Qué puedes hacer con IKHAMI?</h2>
						<p className="text-muted">Descubre todas las funcionalidades que tenemos para ti. Domina tus activos y optimiza tus decisiones.</p>
					</div>
				</div>

				<div className="row g-4">
					<div className="col-md-6 col-lg-3">
						<div className="card h-100 border-warning border-opacity-25 bg-warning bg-opacity-10 shadow-sm ">
							<div className="card-body text-center">
								<div className="mb-3">
									<i className="bi bi-wallet2 text-primary" style={{ fontSize: '3rem' }}></i>
								</div>
								<h5 className="card-title pb-2 fs-4" >Gestiona tu cartera</h5>
								<p className="card-text text-white-75" style={{ textAlign: 'justify' }}>
									Añade, elimina y organiza tus acciones. Registra todas tus transacciones
									de compra y venta con facilidad.
								</p>
							</div>
						</div>
					</div>

					<div className="col-md-6 col-lg-3">
						<div className="card h-100 border-warning border-opacity-25 bg-warning bg-opacity-10 shadow-sm">
							<div className="card-body text-center">
								<div className="mb-3">
									<i className="bi bi-graph-up text-success" style={{ fontSize: '3rem' }}></i>
								</div>
								<h5 className="card-title pb-2 fs-4">Seguimiento en Tiempo Real</h5>
								<p className="card-text text-white-75" style={{ textAlign: 'justify' }}>
									Consulta los precios actuales de tus acciones y visualiza cómo evoluciona
									el valor de tu portfolio minuto a minuto.
								</p>
							</div>
						</div>
					</div>

					<div className="col-md-6 col-lg-3">
						<div className="card h-100 border-warning border-opacity-25 bg-warning bg-opacity-10 shadow-sm">
							<div className="card-body text-center">
								<div className="mb-3">
									<i className="bi bi-cash-coin text-warning" style={{ fontSize: '3rem' }}></i>
								</div>
								<h5 className="card-title pb-2 fs-4">Ganancias y Pérdidas</h5>
								<p className="card-text text-white-75" style={{ textAlign: 'justify' }}>
									Visualiza de forma clara tus ganancias y pérdidas totales, tanto en
									porcentaje como en valores absolutos.
								</p>
							</div>
						</div>
					</div>

					<div className="col-md-6 col-lg-3">
						<div className="card h-100 border-warning border-opacity-25 bg-warning bg-opacity-10 shadow-sm">
							<div className="card-body text-center">
								<div className="mb-3">
									<i className="bi bi-clock-history text-danger" style={{ fontSize: '3rem' }}></i>
								</div>
								<h5 className="card-title pb-2 fs-4">Historial Completo</h5>
								<p className="card-text text-white-75" style={{ textAlign: 'justify' }}>
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
