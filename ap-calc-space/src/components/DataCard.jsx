export default function DataCard({
  title,
  value,
  description
}) {
  return (
    <div className="data-card">

      <h2>{title}</h2>

      <div className="data-value">
        {value}
      </div>

      <p>{description}</p>

    </div>
  );
}