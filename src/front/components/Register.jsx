import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Register = ({ id }) => {
    const { store, dispatch } = useGlobalReducer();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [last_name, setLast_name] = useState("");

    const handleRegister = async () => {
        if (!email.trim() || !password.trim() || !name.trim() || !last_name.trim()) {
            dispatch({
                type: "SET_MESSAGE",
                payload: { text: "⚠️ Rellena todos los campos.", status: 400 }
            });
            return;
        }
        if (password.length < 6) {
            dispatch({
                type: "SET_MESSAGE",
                payload: { text: "⚠️ La contraseña debe tener al menos 6 caracteres", status: 400 }
            });
            return;
        }
        try {
            const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, name, last_name })
            });

            if (resp.status === 409) {
                dispatch({
                    type: "SET_MESSAGE",
                    payload: { text: "📧 El usuario ya existe.", status: 409 }
                });
                return;
            }

            if (resp.ok) {
                dispatch({
                    type: "SET_MESSAGE",
                    payload: { text: "✅ ¡Usuario creado con éxito!", status: 201 }
                });
                setName(""); setLast_name(""); setEmail(""); setPassword("");

                setTimeout(() => {
                    const closeBtn = document.getElementById("finalizar-registro");
                    if (closeBtn) closeBtn.click();
                    dispatch({ type: "SET_MESSAGE", payload: null });
                }, 2000);
            }
        } catch (error) {
            dispatch({
                type: "SET_MESSAGE",
                payload: { text: "🚀 Error de conexión.", status: 500 }
            });
        }
    };

    return (
        <div className="modal fade" id="registerModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2 className="modal-title fs-5">Registro</h2>
                        <button
                            type="button"
                            id="finalizar-registro"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={() => {
                                dispatch({ type: "SET_MESSAGE", payload: null });
                                setName("");
                                setLast_name("");
                                setEmail("");
                                setPassword("");
                            }}
                        ></button>
                    </div>
                    <div className="modal-body text-start">
                        {store.message ? (
                            <div className={`alert ${store.message.status >= 200 && store.message.status < 300 ? 'alert-success':'alert-danger'} p-2`}>
                                {store.message.text || store.message}
                            </div>
                        ) : null }
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
