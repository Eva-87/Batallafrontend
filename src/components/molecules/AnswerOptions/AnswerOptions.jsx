import "./AnswerOptions.css";

export default function AnswerOptions({ options, selected, onSelect, disabled }) {
  return (
    <div className="answer-options">
      {Array.isArray(options) && options.map((opt, i) => (

        <button
          key={i}
          className={`answer-option ${selected === i ? "selected" : ""}`}
          onClick={() => onSelect(i)}
          disabled={disabled}
        >
          <span className="option-label">{["A", "B", "C", "D"][i]}</span>
          {opt}
        </button>
      ))}
    </div>
  );
}



