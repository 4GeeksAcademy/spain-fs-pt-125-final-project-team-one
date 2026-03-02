import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { toast } from 'react-toastify';

export const Register = ({ id }) => {

    const { store, dispatch } = useGlobalReducer();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [last_name, setLast_name] = useState("");

    const handleRegister = async () => {
        const tieneLetra = /[a-zA-Z]/.test(password);
        const tieneNumero = /[0-9]/.test(password);


        if (!email.trim() || !password.trim() || !name.trim() || !last_name.trim()) {
            dispatch({
                type: "SET_MESSAGE",
                payload: { msg: "⚠️ Rellena todos los campos.", status: 400 }
            });
            toast.info('Rellena todos los campos.');
            return;
        }
        if (password.length < 8) {
            dispatch({
                type: "SET_MESSAGE",
                payload: { msg: "⚠️ La contraseña debe tener al menos 8 caracteres", status: 400 }
            });
            toast.info('La contraseña debe tener al menos 8 caracteres');
            return;
        }
        if (!tieneLetra || !tieneNumero) {
            dispatch({
                type: "SET_MESSAGE",
                payload: { msg: "⚠️ La contraseña debe contener al menos una letra y un número.", status: 400 }
            });
            toast.info('La contraseña debe contener al menos una letra y un número.');
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
                    payload: { msg: "📧 El usuario ya existe.", status: 409 }
                });
                toast.error('El usuario ya existe');
                return;
            }

            if (resp.ok) {
                dispatch({
                    type: "SET_MESSAGE",
                    payload: { msg: "✅ ¡Usuario creado con éxito!", status: 201 }
                });
                toast.success('¡Usuario creado con éxito!');
                setName(""); setLast_name(""); setEmail(""); setPassword("");

                setTimeout(() => {
                    const closeBtn = document.getElementById("finalizar-registro");
                    if (closeBtn) closeBtn.click();
                    dispatch({ type: "SET_MESSAGE", payload: null });
                }, 1000);
            }

        } catch (error) {
            dispatch({
                type: "SET_MESSAGE",
                payload: { msg: "🚀 Error de conexión.", status: 500 }
            });
            toast.error('Error de conexión');
        }
    };

    return (
        <div className="modal fade" id={id} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1">
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
