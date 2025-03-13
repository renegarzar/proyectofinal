import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  max-width: 400px;
  margin: auto;
  text-align: center;
  padding: 20px;
`;

const InputContainer = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding-right: 40px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  width: 100%;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
`;

function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Función para validar correo electrónico
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setMensaje("El correo electrónico no es válido. Usa un formato correcto como usuario@dominio.com.");
      return;
    }

    if (password !== confirmPassword) {
      setMensaje("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5000/register", {
        nombre,
        email,
        password
      });
      setMensaje(response.data.message);
      setTimeout(() => navigate("/login"), 2000); // Redirige a login después de 2s
    } catch (error) {
      setMensaje(error.response.data.error);
    }
  };

  return (
    <Container>
      <h2>Registro</h2>
      {mensaje && <ErrorMessage>{mensaje}</ErrorMessage>}
      <form onSubmit={handleSubmit}>
        <Input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />

        <Input
          type="email"
          placeholder="Correo Electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <InputContainer>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <ToggleButton type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "🙈" : "👁"}
          </ToggleButton>
        </InputContainer>

        <InputContainer>
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirmar Contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <ToggleButton type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? "🙈" : "👁"}
          </ToggleButton>
        </InputContainer>

        <Button type="submit">Registrarse</Button>
      </form>
    </Container>
  );
}

export default Register;
