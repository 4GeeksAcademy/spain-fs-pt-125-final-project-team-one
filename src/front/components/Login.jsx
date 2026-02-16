import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

// Añadimos { id } para que el Navbar pueda abrirlo
export const Login = ({ id }) => {
    const { store, dispatch } = useGlobalReducer();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        // 1. Validación de campos vacíos
        if (!email.trim() || !password.trim()) {
            dispatch({ 
                type: "SET_MESSAGE", 
                payload: "⚠️ Los campos no pueden estar vacíos" 
            });
            return; 
        }

        try {
            const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            // 2. Manejo de error 401 (Credenciales)
            if (resp.status === 401) {
                dispatch({ 
                    type: "SET_MESSAGE", 
                    payload: "❌ El email o la contraseña son incorrectos." 
                });
                return;
            }

            // 3. Otros errores de servidor
            if (!resp.ok) {
                const errorData = await resp.json();
                dispatch({ 
                    type: "SET_MESSAGE", 
                    payload: `⚠️ Error: ${errorData.msg || "No se pudo iniciar sesión"}` 
                });
                return;
            }

            // 4. LOGIN EXITOSO
            const data = await resp.json();
            localStorage.setItem("jwt-token", data.token);
            
            // Actualizamos el estado global
            dispatch({ type: "LOGIN", payload: data.token });
            dispatch({ type: "SET_MESSAGE", payload: "✅ ¡Sesión iniciada con éxito!" });

            // CERRAMOS EL MODAL AUTOMÁTICAMENTE TRAS EL ÉXITO
            setTimeout(() => {
                const closeBtn = document.getElementById(`close-${id}`);
                if (closeBtn) closeBtn.click();
                dispatch({ type: "SET_MESSAGE", payload: null });
            }, 1500);

        } catch (error) {
            console.error("Error en la petición:", error);
            dispatch({ 
                type: "SET_MESSAGE", 
                payload: "🚀 Error de conexión: Inténtalo de nuevo más tarde." 
            });
        }
    };

    return (
        <div className="modal fade" id={id} tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2 className="modal-title fs-5">Login</h2>
                        <button 
                            type="button" 
                            id={`close-${id}`} 
                            className="btn-close" 
                            data-bs-dismiss="modal" 
                            aria-label="Close"
                            onClick={() => dispatch({ type: "SET_MESSAGE", payload: null })}
                        ></button>
                    </div>
                    <div className="modal-body">
                        {/* Tu lógica de mensajes */}
                        {store.message && (
                            <div className={`alert ${store.message.includes('✅') ? 'alert-success' : 'alert-danger'} p-2`} role="alert">
                                {store.message}
                            </div>
                        )}

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
                        <button className="btn btn-success w-100" onClick={handleLogin}>
                            Entrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
