export default function HistoryPagination({
  start = 1,
  end = 8,
  total = 128,
  currentPage = 1,
  totalPages = 16,
  onPrev,
  onNext,
}) {
  return (
    <div className="history-pagination-row">
      <span className="pagination-count-label">
        Showing {start}–{end} of {total} records
      </span>

      <div className="pagination-buttons">
        <button
          type="button"
          className="btn-pagination-nav"
          disabled={currentPage <= 1}
          onClick={onPrev}
        >
          Previous
        </button>
        <button
          type="button"
          className="btn-pagination-nav"
          disabled={currentPage >= totalPages}
          onClick={onNext}
        >
          Next
        </button>
      </div>
    </div>
  )
}
