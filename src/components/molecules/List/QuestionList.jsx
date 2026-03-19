import "./QuestionList.css";

export default function QuestionList({ questions, selectedQuestions, onToggle }) {
  return (
    <ul className="ql-list">
      {questions.map((q) => (
        <li key={q.id} className="ql-item">
          <label>
            <input
              type="checkbox"
              checked={selectedQuestions.includes(q.id)}
              onChange={() => onToggle(q.id)}
            />
            {q.text}
          </label>
        </li>
      ))}
    </ul>
  );
}
