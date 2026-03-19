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
  return (
    <div className="gr-panel">
      <Timer time={timeLeft} />
      <QuestionDisplay question={question} />
      <AnswerOptions
        options={question.options}
        selected={selectedIndex}
        onSelect={onAnswer}
        disabled={hasAnswered}
      />
    </div>
  );
}
