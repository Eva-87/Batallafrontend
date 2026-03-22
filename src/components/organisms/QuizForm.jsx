import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { uploadImage } from "../../services/imageService";
import "./QuizForm.css";

import QuestionForm from "./QuestionForm";
import QuestionList from "../molecules/List/QuestionList";

export default function QuizForm() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(!!quizId);

  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("GENERAL");
  const [imageUrl, setImageUrl] = useState(null);
  const [topicImage, setTopicImage] = useState(null);

  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  const [customTopics, setCustomTopics] = useState([]);
  const [newTopicName, setNewTopicName] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  // -----------------------------
  // CARGAR CUSTOM TOPICS
  // -----------------------------
  useEffect(() => {
    fetch("http://localhost:8080/api/custom-topics")
      .then((res) => res.json())
      .then((data) => setCustomTopics(data))
      .catch((err) => console.error("Error cargando custom topics:", err));
  }, []);

  // -----------------------------
  // CARGAR QUIZ SI ESTAMOS EDITANDO
  // -----------------------------
  useEffect(() => {
    if (!quizId) return; // ⭐ Si NO estamos editando → no cargar nada

    fetch(`http://localhost:8080/api/quizzes/${quizId}`)
      .then((res) => res.json())
      .then((quiz) => {
        setTitle(quiz.title);
        setTopic(quiz.topic);
        setImageUrl(quiz.imageUrl);

        // ⭐ Cargar SOLO las preguntas del quiz
        if (quiz.questions) {
          setQuestions(quiz.questions); // preguntas completas
          setSelectedQuestions(quiz.questions.map((q) => q.id)); // IDs seleccionados
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando quiz:", err);
        setLoading(false);
      });
  }, [quizId]);

  // -----------------------------
  // CREAR NUEVO TOPIC PERSONALIZADO
  // -----------------------------
  const handleCreateTopic = async () => {
    if (!newTopicName.trim()) {
      return alert("El nombre del tópico no puede estar vacío");
    }

    const res = await fetch(
      `http://localhost:8080/api/custom-topics/create/${user.id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTopicName),
      }
    );

    if (!res.ok) {
      const error = await res.text();
      return alert("Error creando tópico: " + error);
    }

    const created = await res.json();

    setCustomTopics((prev) => [...prev, created]);
    setTopic(created.name);
    setNewTopicName("");

    alert("Tópico creado correctamente");
  };

  // -----------------------------
  // SELECCIONAR / DESELECCIONAR PREGUNTA
  // -----------------------------
  const toggleQuestion = (id) => {
    setSelectedQuestions((prev) =>
      prev.includes(id)
        ? prev.filter((q) => q !== id)
        : [...prev, id]
    );
  };

  // -----------------------------
  // GUARDAR QUIZ
  // -----------------------------
  const handleSubmit = async () => {
    if (!title.trim()) return alert("El título no puede estar vacío");
    if (selectedQuestions.length === 0)
      return alert("Selecciona al menos una pregunta");

    let finalImage = imageUrl;

    if (topicImage) {
      finalImage = await uploadImage(topicImage);
    }

    if (quizId) {
      const body = {
        title,
        topic,
        questionIds: selectedQuestions,
        imageUrl: finalImage,
      };

      const res = await fetch(
        `http://localhost:8080/api/quizzes/update/${quizId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        const error = await res.text();
        return alert("Error actualizando quiz: " + error);
      }

      alert("Quiz actualizado correctamente");
    } else {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("topic", topic);
      formData.append("userId", user.id);
      formData.append(
        "isCustomTopic",
        topic !== "GENERAL" &&
          topic !== "MATEMATICAS" &&
          topic !== "HISTORIA" &&
          topic !== "CIENCIA" &&
          topic !== "DEPORTES" &&
          topic !== "OTROS"
      );
      formData.append("questionIds", JSON.stringify(selectedQuestions));
      formData.append("imageUrl", finalImage);

      const res = await fetch("http://localhost:8080/api/quizzes/create", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.text();
        return alert("Error creando quiz: " + error);
      }

      alert("Quiz creado correctamente");
    }

    navigate("/homepage/profile");
  };

  if (loading) {
    return (
      <div className="quiz-card">
        <h2>Cargando quiz...</h2>
      </div>
    );
  }

  return (
    <div className="quiz-card">
      <h2>{quizId ? "Editar Quiz" : "Crear Quiz"}</h2>

      <input
        className="input"
        placeholder="Título del quiz"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <select
        className="select"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      >
        <option value="GENERAL">GENERAL</option>
        <option value="MATEMATICAS">MATEMÁTICAS</option>
        <option value="HISTORIA">HISTORIA</option>
        <option value="CIENCIA">CIENCIA</option>
        <option value="DEPORTES">DEPORTES</option>
        <option value="OTROS">OTROS</option>

        {customTopics.map((t) => (
          <option key={t.id} value={t.name}>
            {t.name}
          </option>
        ))}
      </select>

      {topic === "OTROS" && (
        <div className="custom-topic-box">
          <input
            className="input"
            placeholder="Nuevo tópico..."
            value={newTopicName}
            onChange={(e) => setNewTopicName(e.target.value)}
          />
          <button onClick={handleCreateTopic}>Crear tópico</button>
        </div>
      )}

      {imageUrl && (
        <img src={imageUrl} alt="Quiz" className="quiz-image-preview" />
      )}

      <input type="file" onChange={(e) => setTopicImage(e.target.files[0])} />

      <h3>Preguntas disponibles</h3>

      <QuestionList
        questions={questions}
        selectedQuestions={selectedQuestions}
        onToggle={toggleQuestion}
      />

      <h3>Crear nueva pregunta</h3>

      <QuestionForm
        userId={user.id}
        onQuestionCreated={(newQuestion) => {
          setQuestions((prev) => [...prev, newQuestion]);
        }}
      />

      <button onClick={handleSubmit}>
        {quizId ? "Guardar cambios" : "Crear quiz"}
      </button>
    </div>
  );
}
