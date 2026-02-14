import React, { useState } from "react";

export const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [last_name, setLast_name] = useState("");

    const handleRegister = async () => {
        if (!email || !password || !name || !last_name) {
            alert("Por favor, rellena todos los campos.");
            return;
        }
        try {
            const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, name, last_name })
            });
            if (resp.status === 409) {
                alert("El usuario ya existe, intenta hacer Login.");
                return;
            }
            if (resp.ok) {
                alert("¡Usuario creado con éxito!");
            }
        } catch (error) {
            console.error("Error en la petición:", error);
            alert("🚀 Error de conexión: Comprueba tu internet o vuelve a intentarlo más tarde.");
        }
    };

    return (
        <div className="container my-5 w-25">
            <h2>Registro</h2>
            <input
                className="form-control mb-2"
                type="text"
                placeholder="Nombre"
                maxLength="50"
                onChange={(e) => setName(e.target.value)}
            />
            <input
                className="form-control mb-2"
                type="text"
                placeholder="Apellido"
                maxLength="50"
                onChange={(e) => setLast_name(e.target.value)}
            />
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
            <button className="btn btn-primary" onClick={handleRegister}>
                Registrarse
            </button>
        </div>
    );
};
