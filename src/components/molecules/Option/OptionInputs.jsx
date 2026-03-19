import Input from "../../atoms/Input/Input";
import "./OptionInputs.css";

export default function OptionInputs({ options, setOptions }) {
  return (
    <div className="opt-container">
      {options.map((opt, i) => (
        <Input
          key={i}
          placeholder={`Opción ${i + 1}`}
          value={opt}
          onChange={(e) =>
            setOptions(
              options.map((o, idx) => (idx === i ? e.target.value : o))
            )
          }
        />
      ))}
    </div>
  );
}
