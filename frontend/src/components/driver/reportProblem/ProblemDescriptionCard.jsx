export default function ProblemDescriptionCard({
  value,
  onChange,
}) {
  return (
    <div className="problem-description-section">
      <h3 className="problem-section-title">Describe the problem</h3>
      <textarea
        className="problem-description-textarea"
        rows={4}
        placeholder="The outlet manager refused the delivery because the receiving area was closed. Please advise whether to wait or proceed to the next stop."
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
      />
    </div>
  )
}
