import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import styled from "styled-components";

const Container = styled.div`
  max-width: 400px;
  margin: auto;
  text-align: center;
  padding: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  background-color: #28a745;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  width: 100%;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, { email, password });

        console.log("Respuesta del backend:", response.data);  // Depurar la respuesta

        if (response.data.user) {
            login(response.data.user);  // Guardar sesión correctamente
            navigate("/");  // Redirigir a pantalla principal
        } else {
            setMensaje("Error en la autenticación");
        }
    } catch (error) {
        console.error("Error en el registro:", error);
        setMensaje(error.response?.data?.error || "Error en el servidor");
    }
};


  return (
    <Container>
      <h2>Iniciar Sesión</h2>
      {mensaje && <p>{mensaje}</p>}
      <form onSubmit={handleSubmit}>
        <Input type="email" placeholder="Correo Electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit">Iniciar Sesión</Button>
      </form>
    </Container>
  );
}

export default Login;
