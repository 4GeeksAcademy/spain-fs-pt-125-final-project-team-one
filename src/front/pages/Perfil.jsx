import React, { useEffect, useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Perfil = () => {
	const { store, dispatch } = useGlobalReducer()
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	
	const [editForm, setEditForm] = useState({
		name: "",
		last_name: "",
		email: ""
	})
	const [editError, setEditError] = useState("")
	const [editSuccess, setEditSuccess] = useState("")
	const [editLoading, setEditLoading] = useState(false)

	const loadUserProfile = async () => {
		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL
			const token = localStorage.getItem("jwt-token")

			if (!token) {
				setError("No hay sesión activa")
				setLoading(false)
				return
			}

			const response = await fetch(`${backendUrl}/api/user/profile`, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			})

			const data = await response.json()

			if (response.ok) {
				setUser(data)
				setEditForm({
					name: data.name,
					last_name: data.last_name,
					email: data.email
				})
			} else {
				setError(data.msg || "Error al cargar perfil")
			}
		} catch (error) {
			console.error('Error cargando perfil:', error)
			setError("Error de conexión con el servidor")
		} finally {
			setLoading(false)
		}
	}

	const handleEditChange = (e) => {
		setEditForm({
			...editForm,
			[e.target.name]: e.target.value
		})
		setEditError("")
		setEditSuccess("")
	}

	const openEditModal = () => {
		setEditForm({
			name: user.name,
			last_name: user.last_name,
			email: user.email
		})
		setEditError("")
		setEditSuccess("")
	}

	const handleEditSubmit = async (e) => {
		e.preventDefault()
		setEditError("")
		setEditSuccess("")

		if (!editForm.name || !editForm.last_name || !editForm.email) {
			setEditError("Todos los campos son obligatorios")
			return
		}

		if (!editForm.email.includes('@')) {
			setEditError("Email inválido")
			return
		}

		setEditLoading(true)

		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL
			const token = localStorage.getItem("jwt-token")

			const response = await fetch(`${backendUrl}/api/user/profile`, {
				method: 'PUT',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: editForm.name,
					last_name: editForm.last_name,
					email: editForm.email
				})
			})

			const data = await response.json()

			if (response.ok) {
				setEditSuccess("Perfil actualizado con éxito")
				setUser(data)
				setTimeout(() => {
					const modalElement = document.getElementById('editProfileModal')
					const modal = window.bootstrap.Modal.getInstance(modalElement)
					modal.hide()
					setEditSuccess("")
				}, 1500)
			} else {
				setEditError(data.msg || "Error al actualizar perfil")
			}
		} catch (error) {
			console.error('Error:', error)
			setEditError("Error de conexión con el servidor")
		} finally {
			setEditLoading(false)
		}
	}

	useEffect(() => {
		loadUserProfile()
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
				<Link to="/" className="btn btn-primary">Ir a Inicio</Link>
			</div>
		)
	}

	return (
		<div className="container py-5">
			<div className="row justify-content-center">
				<div className="col-lg-8">
					<div className="card shadow-sm">
						<div className="card-body">
							<div className="row">
								<div className="col-md-4 text-center mb-4 mb-md-0">
									<img 
										src="https://via.placeholder.com/150" 
										alt="Profile" 
										className="rounded-circle img-fluid mb-3"
										width="150"
										height="150"
									/>
									<h4 className="mb-1">{user.name} {user.last_name}</h4>
									<p className="text-muted">{user.email}</p>
									<span className={`badge ${user.is_active ? 'bg-success' : 'bg-danger'}`}>
										{user.is_active ? 'Activo' : 'Inactivo'}
									</span>
								</div>

								<div className="col-md-8">
									<h5 className="mb-4">Información del Perfil</h5>
									
									<div className="mb-3">
										<label className="text-muted small">Nombre Completo</label>
										<p className="mb-2">{user.name} {user.last_name}</p>
									</div>

									<div className="mb-3">
										<label className="text-muted small">Email</label>
										<p className="mb-2">{user.email}</p>
									</div>

									<hr />
		
									<div className="mt-4">
										<button 
											className="btn btn-primary me-2 mb-2"
											data-bs-toggle="modal" 
											data-bs-target="#editProfileModal"
											onClick={openEditModal}
										>
											<i className="bi bi-pencil"></i> Editar Perfil
										</button>
										<Link to="/change-password" className="btn btn-warning me-2 mb-2">
											<i className="bi bi-key"></i> Cambiar Contraseña
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>					
				</div>
			</div>

			<div className="modal fade" id="editProfileModal" tabIndex="-1" aria-labelledby="editProfileModalLabel" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="editProfileModalLabel">
								<i className="bi bi-pencil me-2"></i>Editar Perfil
							</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<form onSubmit={handleEditSubmit}>
							<div className="modal-body">
								{editError && (
									<div className="alert alert-danger" role="alert">
										{editError}
									</div>
								)}

								{editSuccess && (
									<div className="alert alert-success" role="alert">
										{editSuccess}
									</div>
								)}

								<div className="mb-3">
									<label htmlFor="name" className="form-label">Nombre</label>
									<input
										type="text"
										className="form-control"
										id="name"
										name="name"
										value={editForm.name}
										onChange={handleEditChange}
										required
									/>
								</div>

								<div className="mb-3">
									<label htmlFor="last_name" className="form-label">Apellido</label>
									<input
										type="text"
										className="form-control"
										id="last_name"
										name="last_name"
										value={editForm.last_name}
										onChange={handleEditChange}
										required
									/>
								</div>

								<div className="mb-3">
									<label htmlFor="email" className="form-label">Email</label>
									<input
										type="email"
										className="form-control"
										id="email"
										name="email"
										value={editForm.email}
										onChange={handleEditChange}
										required
									/>
								</div>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
									Cancelar
								</button>
								<button type="submit" className="btn btn-primary" disabled={editLoading}>
									{editLoading ? (
										<>
											<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
											Guardando...
										</>
									) : (
										<>
											<i className="bi bi-check-circle me-2"></i>
											Guardar Cambios
										</>
									)}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};