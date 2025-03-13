import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Foro from "./pages/Foro";
import Topic from "./pages/Topic";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import styled from "styled-components";

const Container = styled.div`
  text-align: center;
  padding: 20px;
`;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <h1>Plataforma Educativa - Foro</h1>
          <Routes>
            <Route path="/" element={<Foro />} />
            <Route path="/topic/:topicId" element={<Topic />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
