import { useParams, useLocation } from "react-router-dom";
import QuizForm from "../../components/organisms/QuizForm";
import "./CreateQuizPage.css";

export default function CreateQuizPage() {
  const { quizId } = useParams();
  const location = useLocation();

  // Si vienes desde "Editar", aquí llegan los datos del quiz
  const quizData = location.state?.quiz || null;

  return (
    <div className="create-quiz-page">
      <QuizForm quizId={quizId} quizData={quizData} />
    </div>
  );
}
