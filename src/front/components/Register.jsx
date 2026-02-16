import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

// Añadimos { id } para que coincida con el disparador del Navbar
export const Register = ({ id }) => {
    const { store, dispatch } = useGlobalReducer();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [last_name, setLast_name] = useState("");

    const handleRegister = async () => {
        // Validamos usando dispatch en lugar de alert
        if (!email.trim() || !password.trim() || !name.trim() || !last_name.trim()) {
            dispatch({ 
                type: "SET_MESSAGE", 
                payload: "⚠️ Por favor, rellena todos los campos." 
            });
            return;
        }

        try {
            const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    email: email, 
                    password: password, 
                    name: name, 
                    last_name: last_name 
                })
            });

            if (resp.status === 409) {
                dispatch({ 
                    type: "SET_MESSAGE", 
                    payload: "📧 El usuario ya existe, intenta hacer Login." 
                });
                return;
            }

            if (resp.ok) {
                dispatch({ 
                    type: "SET_MESSAGE", 
                    payload: "✅ ¡Usuario creado con éxito! Ya puedes loguearte." 
                });
                // Limpiar los campos tras éxito
                setName(""); setLast_name(""); setEmail(""); setPassword("");

                // Opcional: Cerrar el modal automáticamente tras 2 segundos para que vean el mensaje de éxito
                setTimeout(() => {
                    const closeBtn = document.getElementById(`close-${id}`);
                    if (closeBtn) closeBtn.click();
                    dispatch({ type: "SET_MESSAGE", payload: null });
                }, 2000);
            }
        } catch (error) {
            console.error("Error en la petición:", error);
            dispatch({ 
                type: "SET_MESSAGE", 
                payload: "🚀 Error de conexión: Inténtalo más tarde." 
            });
        }
    };

    return (
        <div className="modal fade" id={id} tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2 className="modal-title fs-5">Registro</h2>
                        <button 
                            type="button" 
                            id={`close-${id}`} 
                            className="btn-close" 
                            data-bs-dismiss="modal" 
                            aria-label="Close"
                            onClick={() => dispatch({ type: "SET_MESSAGE", payload: null })}
                        ></button>
                    </div>
                    <div className="modal-body text-start">
                        {/* Mostramos el mensaje del store si existe */}
                        {store.message && (
                            <div className={`alert ${store.message.includes('✅') ? 'alert-success' : 'alert-info'} p-2`} role="alert">
                                {store.message}
                            </div>
                        )}

                        <input
                            className="form-control mb-2"
                            type="text"
                            placeholder="Nombre"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            className="form-control mb-2"
                            type="text"
                            placeholder="Apellido"
                            value={last_name}
                            onChange={(e) => setLast_name(e.target.value)}
                        />
                        <input
                            className="form-control mb-2"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            className="form-control mb-2"
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-primary w-100" onClick={handleRegister}>
                            Registrarse
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
