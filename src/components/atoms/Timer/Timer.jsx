import "./Timer.css";

export default function Timer({ time }) {
  return (
    <div className="timer">
      <span>{time}s</span>
    </div>
  );
}
