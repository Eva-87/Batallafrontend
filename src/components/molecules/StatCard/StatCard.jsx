import "./StatCard.css";

export default function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <h3>{label}</h3>
      <p className="stat-number">{value}</p>
    </div>
  );
}
