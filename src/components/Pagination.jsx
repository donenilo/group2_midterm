import React from 'react';

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        className="pagination__btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ← Prev
      </button>

      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i + 1}
          className={`pagination__btn ${currentPage === i + 1 ? 'pagination__btn--active' : ''}`}
          onClick={() => onPageChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}

      <button
        className="pagination__btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next →
      </button>
    </div>
  );
}

export default Pagination;