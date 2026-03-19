import { useState } from "react";

export default function QuestionForm({ onQuestionCreated }) {
  const [text, setText] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctIndex, setCorrectIndex] = useState(0);

  const handleSubmit = async () => {
    if (!text.trim()) return alert("La pregunta no puede estar vacía");

    const body = {
      text,
      optionA,
      optionB,
      optionC,
      optionD,
      correctIndex,
    };

    const res = await fetch("http://localhost:8080/api/questions/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.text();
      return alert("Error creando pregunta: " + error);
    }

    const newQuestion = await res.json();

    // ⭐ IMPORTANTE: esto NO causa bucles
    onQuestionCreated(newQuestion);

    // limpiar formulario
    setText("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setCorrectIndex(0);
  };

  return (
    <div className="question-form">
      <input
        className="input"
        placeholder="Pregunta"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <input className="input" placeholder="Opción A" value={optionA} onChange={(e) => setOptionA(e.target.value)} />
      <input className="input" placeholder="Opción B" value={optionB} onChange={(e) => setOptionB(e.target.value)} />
      <input className="input" placeholder="Opción C" value={optionC} onChange={(e) => setOptionC(e.target.value)} />
      <input className="input" placeholder="Opción D" value={optionD} onChange={(e) => setOptionD(e.target.value)} />

      <select
        className="select"
        value={correctIndex}
        onChange={(e) => setCorrectIndex(Number(e.target.value))}
      >
        <option value={0}>A</option>
        <option value={1}>B</option>
        <option value={2}>C</option>
        <option value={3}>D</option>
      </select>

      <button onClick={handleSubmit}>Crear pregunta</button>
    </div>
  );
}
