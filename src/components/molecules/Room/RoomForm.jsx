import Input from "../../atoms/Input/Input";
import Button from "../../atoms/Button/Button";
import "./RoomForm.css";

export default function RoomForm({ title, fields, onSubmit }) {
  return (
    <div className="room-container">
      <h2>{title}</h2>

      {fields.map((f, i) => (
        <Input
          key={i}
          placeholder={f.placeholder}
          value={f.value}
          onChange={(e) => f.onChange(e.target.value)}
        />
      ))}

      <Button onClick={onSubmit}>Continuar</Button>
    </div>
  );
}
