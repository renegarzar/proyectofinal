import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import styled from "styled-components";

const Container = styled.div`
  max-width: 900px;
  margin: auto;
  text-align: left;
  background-color: #1a1a1a;
  color: #00ffcc;
  padding: 20px;
  border-radius: 10px;
  font-family: "Orbitron", sans-serif;
  box-shadow: 0px 0px 10px #00ffcc;
`;

const Title = styled.h2`
  font-size: 28px;
  text-transform: uppercase;
  text-align: center;
  color: #ffcc00;
`;

const Description = styled.p`
  font-size: 18px;
  line-height: 1.6;
  text-align: justify;
  background-color: #262626;
  padding: 15px;
  border-radius: 8px;
  box-shadow: inset 0px 0px 10px #00ffcc;
`;

const TaskSection = styled.div`
  background-color: #333;
  padding: 15px;
  border-radius: 5px;
  margin-top: 20px;
  box-shadow: 0px 0px 10px #00ffcc;
`;

const FileInput = styled.input`
  margin-top: 10px;
`;

const UploadButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #0056b3;
  }
`;

const topicsData = {
  "pc-gamer": {
    title: "¿Qué es una PC Gamer y por qué?",
    content: "La PC Gamer es básicamente una computadora la cual fue armada con el propósito de jugar videojuegos. Estas usualmente tienen procesadores y memoria RAM similares a las PC de oficina normales, sin embargo, las piezas suelen cambiar para ser más robustas y aguantar más el estrés de procesamiento intenso. Al término que se le asocia el jugar en PC Gamer se llama PC Gaming, el cual ha existido desde los años 60, cuando los videojuegos eran muy distintos y consistían en realizar comandos de texto.",
    task: "Hacer un resumen sobre la historia del PC gaming a través de los años."
  },
  "componentes": {
    title: "Componentes",
    content: "La PC Gamer cuenta con varios componentes esenciales:\n\n- **Procesador**: El cerebro de la computadora, responsable de manejar todos los procesos.\n- **Tarjeta Madre**: El esqueleto de la PC, conecta todos los componentes.\n- **Memoria RAM**: Permite al sistema almacenar datos en procesamiento.\n- **Tarjeta Gráfica**: El componente clave para renderizar videojuegos.\n- **Discos de Almacenamiento**: Puede ser un HDD o un SSD.\n- **Fuente de Poder**: Suministra energía a todos los componentes.\n- **Gabinete**: Protege los componentes y facilita el mantenimiento.",
    task: "Realiza un póster con imágenes y explicaciones sobre todas las partes de una PC Gamer."
  },
  "tarjeta-grafica": {
    title: "La Tarjeta Gráfica",
    content: "Existen muchas tarjetas gráficas en el mercado, pero los dos principales fabricantes son **Nvidia y AMD**. Nvidia es conocida por su estabilidad en controladores y su tecnología de vanguardia, mientras que AMD ofrece opciones más económicas sin sacrificar demasiado rendimiento. A lo largo de los años, ambas compañías han desarrollado tecnologías innovadoras, y la elección entre ellas depende del presupuesto y la preferencia del usuario.",
    task: "Ensayo sobre la rivalidad entre AMD y Nvidia, incluyendo tecnologías y competidores."
  },
  "procesador": {
    title: "El Procesador",
    content: "El procesador tiene menor impacto en el rendimiento de una PC Gamer en comparación con la tarjeta gráfica, pero sigue siendo vital. Una GPU de alta gama necesita un procesador potente para evitar cuellos de botella y garantizar una experiencia fluida. **Intel y AMD** dominan el mercado, y aunque Intel sigue siendo la opción más popular, AMD ha ganado terreno con sus procesadores Ryzen, ofreciendo una excelente relación calidad-precio.",
    task: "Ensayo sobre la competencia entre AMD e Intel, con argumentos de elección."
  },
  "sistema-operativo": {
    title: "Sistema Operativo",
    content: "El sistema operativo más utilizado por los gamers es **Windows 10**, seguido por **Windows 11**. Estos sistemas ofrecen una excelente compatibilidad con juegos y optimización de recursos. Sin embargo, hay una comunidad de usuarios que juega en **Linux**, disfrutando de una experiencia más personalizable y segura.",
    task: "Crea un video explicando funciones de Windows 11 favorables para gamers."
  }
};

function Topic() {
  const { topicId } = useParams();
  const { user } = useContext(AuthContext);
  const topic = topicsData[topicId];
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [filename, setFilename] = useState("");

  useEffect(() => {
    if (user) {
      axios.get(`http://127.0.0.1:5000/check-submission?email=${user}&topic=${topicId}`)
        .then(response => {
          setSubmitted(response.data.submitted);
          if (response.data.submitted) {
            setFilename(response.data.filename);
          }
        })
        .catch(error => console.error("Error al verificar entrega:", error));
    }
  }, [user, topicId]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Selecciona un archivo antes de subirlo.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", user);
    formData.append("topic", topicId);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setMessage(response.data.message);
      setSubmitted(true);
      setFilename(file.name);
    } catch (error) {
      setMessage(error.response?.data?.error || "Error al subir el archivo.");
    }
  };

  return (
    <Container>
      <Title>{topic ? topic.title : "Tópico no encontrado"}</Title>
      <Description>{topic ? topic.content : "Este tópico no existe."}</Description>

      {user && topic && (
        <TaskSection>
          <h3>Tarea</h3>
          {!submitted ? (
            <>
              <p>{topic.task}</p>
              <FileInput type="file" onChange={handleFileChange} />
              <UploadButton onClick={handleUpload}>Subir Archivo</UploadButton>
            </>
          ) : (
            <p>¡Ya entregaste esta tarea! Archivo: <strong>{filename}</strong></p>
          )}
          {message && <p>{message}</p>}
        </TaskSection>
      )}
    </Container>
  );
}

export default Topic;
