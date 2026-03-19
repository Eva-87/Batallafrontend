import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QuestionDisplay from "../../components/molecules/QuestionDisplay/QuestionDisplay";
import AnswerOptions from "../../components/molecules/AnswerOptions/AnswerOptions";
import "./QuizPage.css";

export default function QuizPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/quizzes/${id}`)
      .then(res => res.json())
      .then(data => setQuiz(data));
  }, [id]);

  if (!quiz) return <p>Cargando...</p>;

  const question = quiz.questions[current];

  const handleSelect = (index) => {
    setSelected(index);
  };

  const next = () => {
    setSelected(null);
    setCurrent(prev => prev + 1);
  };

  return (
    <div className="play-quiz-page">
      <h1>{quiz.title}</h1>
      <p>Tema: {quiz.topic}</p>

      <QuestionDisplay question={question} />

      <AnswerOptions
        options={question.options}
        selected={selected}
        onSelect={handleSelect}
        disabled={false}
      />

      {selected !== null && current < quiz.questions.length - 1 && (
        <button className="next-btn" onClick={next}>Siguiente</button>
      )}

      {selected !== null && current === quiz.questions.length - 1 && (
        <p className="end-message">🎉 ¡Has terminado el quiz!</p>
      )}
    </div>
  );
}
