export default function Garland() {
  return (
    <div className="garland" aria-hidden="true">
      <div className="garland-string" />
      <div className="garland-lights">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="garland-light" />
        ))}
      </div>
    </div>
  )
}
