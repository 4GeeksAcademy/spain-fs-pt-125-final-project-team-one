import React, { useState, useContext } from "react"; // Añadimos useContext
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Login = () => {

    const { store, dispatch } = useGlobalReducer()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {

        if (email.trim() === "" || password.trim() === "") {
            alert("⚠️ Por favor, introduce tu correo y contraseña para continuar.");
            return; // Detenemos la ejecución aquí mismo
        }
        try {
            const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });
            // CASO 401: Credenciales incorrectas
            if (resp.status === 401) {
                alert("❌ Error 401: El email o la contraseña son incorrectos.");
                return; // Cortamos la ejecución aquí
            }
            if (!resp.ok) {
                const errorData = await resp.json();
                alert(`⚠️ Error: ${errorData.msg || "No se pudo iniciar sesión"}`);
                return;
            }
            // LOGIN EXITOSO (Status 200)
            const data = await resp.json();
            // 1. Guardar token en disco duro
            localStorage.setItem("jwt-token", data.token);
            // 2. Avisar al Store Global (para que el Navbar se entere)
            dispatch({ type: "LOGIN", payload: data.token });

            alert("✅ ¡Sesión iniciada con éxito!");

        } catch (error) {
            console.error("Error en la petición:", error);
            alert("🚀 Error de conexión: Comprueba tu internet o vuelve a intentarlo más tarde.");
        }
    };

    return (
        <div className="container my-5 w-25">
            <h2>Login</h2>
            <input
                className="form-control mb-2"
                type="email"
                placeholder="Email"
                maxLength="50"
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className="form-control mb-2"
                type="password"
                placeholder="Contraseña"
                maxLength="20"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn btn-success" onClick={handleLogin}>
                Entrar
            </button>
        </div>
    );
};