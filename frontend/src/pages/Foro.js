import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import styled from "styled-components";

const Container = styled.div`
  max-width: 800px;
  margin: auto;
  text-align: center;
  position: relative;
`;

const LogoutButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: #dc3545;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #c82333;
  }
`;

const Anuncio = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
`;

const TopicList = styled.ul`
  list-style: none;
  padding: 0;
`;

const TopicItem = styled.li`
  background-color: #007bff;
  color: white;
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
  font-size: 18px;

  &:hover {
    background-color: #0056b3;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
`;

const Button = styled(Link)`
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
  font-size: 16px;

  &:hover {
    background-color: #218838;
  }
`;

function Foro() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Container>
      {user && <LogoutButton onClick={logout}>Cerrar Sesión</LogoutButton>}

      <Anuncio>
        <h2>¡Bienvenido al foro de ensamblaje de PC!</h2>
        <p>Aquí aprenderás todo lo necesario sobre el armado de computadoras.</p>
        {user && <p>Bienvenido, {user.nombre}</p>}
      </Anuncio>

      {!user ? (
        <ButtonContainer>
          <Button to="/register">Registrarse</Button>
          <Button to="/login">Iniciar Sesión</Button>
        </ButtonContainer>
      ) : null}

      <h3>Temas de discusión:</h3>
      <TopicList>
        <TopicItem><Link to="/topic/pc-gamer" style={{ color: 'white', textDecoration: 'none' }}>¿Qué es una PC Gamer? y por qué?</Link></TopicItem>
        <TopicItem><Link to="/topic/componentes" style={{ color: 'white', textDecoration: 'none' }}>Componentes</Link></TopicItem>
        <TopicItem><Link to="/topic/tarjeta-grafica" style={{ color: 'white', textDecoration: 'none' }}>La tarjeta gráfica</Link></TopicItem>
        <TopicItem><Link to="/topic/procesador" style={{ color: 'white', textDecoration: 'none' }}>El Procesador</Link></TopicItem>
        <TopicItem><Link to="/topic/sistema-operativo" style={{ color: 'white', textDecoration: 'none' }}>Sistema operativo</Link></TopicItem>
      </TopicList>
    </Container>
  );
}

export default Foro;

