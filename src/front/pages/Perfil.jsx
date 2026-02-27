import React, { useEffect, useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';

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
					email: data.email,
					image: data.image
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
					email: editForm.email,
					image: editForm.image
				})
			})

			const data = await response.json()

			if (response.ok) {
				setEditSuccess("Perfil actualizado con éxito")
				toast.success("Perfil actualizado con éxito")
				setUser(data)
				setTimeout(() => {
					const modalElement = document.getElementById('editProfileModal')
					const modal = window.bootstrap.Modal.getInstance(modalElement)
					modal.hide()
					setEditSuccess("")
				}, 1500)
			} else {
				setEditError(data.msg || "Error al actualizar perfil")
				toast.error(data.msg || "Error al actualizar perfil")
			}
		} catch (error) {
			console.error('Error:', error)
			setEditError("Error de conexión con el servidor")
			toast.error("Error de conexión con el servidor")
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
		<div className="container-fluid py-5 px-lg-5">
			<div className="row">
				<div className="col-12">
					<h1 className="mb-5 fw-bold text-light">Mi Perfil</h1>
				</div>
			</div>

			<div className="row g-4 align-items-center">
				{/* Imagen a la izquierda */}
				<div className="col-lg-4 d-flex justify-content-center">
					<div className="card bg-dark border-0" style={{ maxWidth: '300px' }}>
						<div className="card-body text-center py-5">
							<img
								src={user.image || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541.placeholder.com/150"}
								alt="Profile"
								className="rounded-circle img-fluid mb-4"
								width="200"
								height="200"
								style={{ objectFit: 'cover' }}
							/>
							<h5 className="text-white mb-3">{user.name} {user.last_name}</h5>
							<span className={`badge fs-6 ${user.is_active ? 'bg-success' : 'bg-danger'}`}>
								{user.is_active ? '● Activo' : '● Inactivo'}
							</span>
						</div>
					</div>
				</div>

				{/* Información y Acciones a la derecha */}
				<div className="col-lg-8">
					<div className="card bg-dark border-0">
						<div className="card-body p-5">
							<h5 className="card-title mb-5 fw-bold fs-4 text-light">Información Personal</h5>

							<div className="row mb-4">
								<div className="col-md-6">
									<label className="text-muted small d-block mb-2">Nombre</label>
									<p className="h6 text-white mb-0"><i className="bi bi-person me-2"></i>Nombre: {user.name}</p>
								</div>
								<div className="col-md-6">
									<label className="text-muted small d-block mb-2">Apellido</label>
									<p className="h6 text-white mb-0"><i className="bi bi-person-badge me-2"></i> Apellidos: {user.last_name}</p>
								</div>
							</div>

							<div className="mb-5">
								<label className="text-muted small d-block mb-2">Correo Electrónico</label>
								<p className="h6 text-white mb-0 text-break"><i className="bi bi-envelope me-2"></i> Email: {user.email}</p>
							</div>

							<hr className="my-5" />

							<div className="d-flex gap-2">
								<button
									className="btn btn-success"
									data-bs-toggle="modal"
									data-bs-target="#editProfileModal"
									onClick={openEditModal}
								>
									<i className="bi bi-pencil me-2"></i> Editar Perfil
								</button>

								<Link to="/change-password" className="btn btn-warning">
									<i className="bi bi-key me-2"></i> Cambiar Contraseña
								</Link>
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

								<div className="mb-3">
									<label htmlFor="image" className="form-label">URL de Imagen de Perfil</label>
									<input
										type="text"
										className="form-control"
										id="image"
										name="image"
										value={editForm.image}
										onChange={handleEditChange}
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