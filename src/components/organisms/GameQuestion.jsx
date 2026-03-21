import Timer from "../atoms/Timer/Timer";
import QuestionDisplay from "../molecules/QuestionDisplay/QuestionDisplay";
import AnswerOptions from "../molecules/AnswerOptions/AnswerOptions";
import "./GameQuestion.css";

export default function GameQuestion({
  question,
  timeLeft,
  selectedIndex,
  hasAnswered,
  onAnswer
}) {
  const isCorrect = hasAnswered && selectedIndex === question.correctIndex;

  return (
    <div className={`gr-panel ${hasAnswered ? (isCorrect ? "correct" : "incorrect") : ""}`}>
      
      <Timer time={timeLeft} />
      <QuestionDisplay question={question} />

      <AnswerOptions
        options={question.options}
        selected={selectedIndex}
        onSelect={onAnswer}
        disabled={hasAnswered}
      />

      {hasAnswered && (
        <div className="feedback-box">
          {isCorrect ? "✔ ¡Correcto!" : "✘ Incorrecto"}
        </div>
      )}
    </div>
  );
}
