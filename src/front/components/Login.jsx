import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Login = ({ id }) => {
    const { store, dispatch } = useGlobalReducer();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {

        dispatch({ type: "SET_MESSAGE", payload: null });

        if (!email.trim() || !password.trim()) {
            dispatch({
                type: "SET_MESSAGE",
                payload: { text: "⚠️ Los campos están vacíos", status: 400 }
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
            const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            if (resp.status === 401) {
                dispatch({ type: "SET_MESSAGE", payload: { text: "Email o contraseña incorrectos", status: 401 } });
                return;
            }
            if (!resp.ok) {
                dispatch({ type: "SET_MESSAGE", payload: { text: "Error de servidor", status: resp.status } });
                return;
            }
            // LOGIN EXITOSO (Status 200)
            const data = await resp.json();
            localStorage.setItem("jwt-token", data.token);
            dispatch({ type: "LOGIN", payload: data.token });
            dispatch({ type: "SET_MESSAGE", payload: { text: "¡Sesión iniciada!", status: 200 } });
            // CERRAMOS EL MODAL Y LIMPIAMOS TODO
            setTimeout(() => {
                const closeBtn = document.getElementById("finalizar-login");
                if (closeBtn) closeBtn.click();

                // 1. Limpiamos el mensaje del store
                dispatch({ type: "SET_MESSAGE", payload: null });
                // 2. Limpiamos los inputs del formulario (importante)
                setEmail("");
                setPassword("");
            }, 2000);
        } catch (error) {
            dispatch({ type: "SET_MESSAGE", payload: { text: "Error de conexión", status: 500 } });
        }
    };

    return (
        <div className="modal fade" id="loginModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2 className="modal-title fs-5">Login</h2>
                        <button
                            type="button"
                            id="finalizar-login"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={() => {
                                dispatch({ type: "SET_MESSAGE", payload: null });
                                setEmail("");
                                setPassword("");
                            }}
                        ></button>
                    </div>
                    <div className="modal-body">
                        {store.message ? (
                            <div className={`alert ${store.message.status >= 200 && store.message.status < 300 ? 'alert-success' : 'alert-danger'} p-2`}>
                                {store.message.text || store.message}
                            </div>
                        ) : null}
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
