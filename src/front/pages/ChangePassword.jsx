import React, { useState, } from "react"
import { Link } from "react-router-dom";
import React, { useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

export const ChangePassword = () => {
	const { store, dispatch } = useGlobalReducer()
	const [formData, setFormData] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: ""
	})
	const Navigate = useNavigate()
	const [error, setError] = useState("")
	const [success, setSuccess] = useState("")
	const [loading, setLoading] = useState(false)

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		})
		setError("")
		setSuccess("")
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError("")
		setSuccess("")

		// Validaciones
		if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
			setError("Todos los campos son obligatorios")
			return
		}

		if (formData.newPassword !== formData.confirmPassword) {
			setError("Las contraseñas nuevas no coinciden")
			return
		}

		if (formData.newPassword.length < 6) {
			setError("La nueva contraseña debe tener al menos 6 caracteres")
			return
		}

		if (formData.currentPassword === formData.newPassword) {
			setError("La nueva contraseña debe ser diferente a la actual")
			return
		}

		setLoading(true)

		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL
			const token = localStorage.getItem("jwt-token")

			const response = await fetch(`${backendUrl}/api/user/change-password`, {
				method: 'PUT',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					current_password: formData.currentPassword,
					new_password: formData.newPassword
				})
			})

			const data = await response.json()

			if (response.ok) {
				setSuccess(data.msg || "Contraseña cambiada con éxito")
				toast.success(data.msg || "Contraseña cambiada con éxito")
				setFormData({
					currentPassword: "",
					newPassword: "",
					confirmPassword: ""
				})
			} else {
				setError(data.msg || "Error al cambiar la contraseña")
				toast.error(data.msg || "Error al cambiar la contraseña")
			}
		} catch (error) {
			console.error('Error:', error)
			setError("Error de conexión con el servidor")
			toast.error("Error de conexión con el servidor")
		} finally {
			setLoading(false)
		}
		Navigate("/user/perfil")
	}

	return (
		<div className="container py-5">
			<div className="row justify-content-center">
				<div className="col-lg-6">
					<div className="card shadow-sm">
						<div className="card-body">
							<h3 className="card-title mb-4">
								<i className="bi bi-key text-warning me-2"></i>
								Cambiar Contraseña
							</h3>

							{error && (
								<div className="alert alert-danger" role="alert">
									{error}
								</div>
							)}

							{success && (
								<div className="alert alert-success" role="alert">
									{success}
								</div>
							)}

							<form onSubmit={handleSubmit}>
								<div className="mb-3">
									<label htmlFor="currentPassword" className="form-label">
										Contraseña Actual
									</label>
									<input
										type="password"
										className="form-control"
										id="currentPassword"
										name="currentPassword"
										value={formData.currentPassword}
										onChange={handleChange}
										placeholder="Ingresa tu contraseña actual"
										required
									/>
								</div>

								<div className="mb-3">
									<label htmlFor="newPassword" className="form-label">
										Nueva Contraseña
									</label>
									<input
										type="password"
										className="form-control"
										id="newPassword"
										name="newPassword"
										value={formData.newPassword}
										onChange={handleChange}
										placeholder="Mínimo 8 caracteres"
										required
									/>
									<small className="text-muted">
										Debe tener al menos 8 caracteres
									</small>
								</div>

								<div className="mb-4">
									<label htmlFor="confirmPassword" className="form-label">
										Confirmar Nueva Contraseña
									</label>
									<input
										type="password"
										className="form-control"
										id="confirmPassword"
										name="confirmPassword"
										value={formData.confirmPassword}
										onChange={handleChange}
										placeholder="Repite la nueva contraseña"
										required
									/>
								</div>

								<div className="d-flex gap-2">
									<button
										type="submit"
										className="btn btn-warning"
										disabled={loading}
									>
										{loading ? (
											<>
												<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
												Cambiando...
											</>
										) : (
											<>
												<i className="bi bi-check-circle me-2"></i>
												Cambiar Contraseña
											</>
										)}
									</button>
									<Link to="/perfil" className="btn btn-outline-secondary">
										Cancelar
									</Link>
								</div>
							</form>
						</div>
					</div>

					<div className="card shadow-sm mt-4">
						<div className="card-body">
							<h6 className="card-title">
								<i className="bi bi-shield-check text-success me-2"></i>
								Consejos de Seguridad
							</h6>
							<ul className="small text-muted mb-0">
								<li>Usa una contraseña única que no uses en otros sitios</li>
								<li>Combina letras mayúsculas, minúsculas, números y símbolos</li>
								<li>Evita información personal fácil de adivinar</li>
								<li>Cambia tu contraseña periódicamente</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};