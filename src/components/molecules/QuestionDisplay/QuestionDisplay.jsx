import "./QuestionDisplay.css";

export default function QuestionDisplay({ question }) {
  return (
    <div className="question-display">
      <h2>{question.text}</h2>
    </div>
  );
}
