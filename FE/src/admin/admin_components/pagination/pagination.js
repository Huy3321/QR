import React from "react";
import "./pagination.css"; // Assuming you have styles for pagination

// Define the onPageChange callback prop in your Pagination component
const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  // Handle page change
  const handlePageChange = (page) => {
    // Call the onPageChange callback with the new page number
    if (onPageChange) {
      onPageChange(page);
    }
  };

  return (
    <div className="pagination">
      <button
        className="pagination-button"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
      >
        &laquo; {/* Double left arrow for first page */}
      </button>
      <button
        className="pagination-button"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lsaquo; {/* Single left arrow for previous page */}
      </button>
      {[...Array(totalPages)].map((_, index) => {
        const page = index + 1;
        if (
          page === currentPage - 1 ||
          page === currentPage ||
          page === currentPage + 1 ||
          page === 1 ||
          page === totalPages
        ) {
          return (
            <button
              key={index}
              className={`pagination-button ${
                currentPage === page ? "active" : ""
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          );
        } else if (
          (page === currentPage - 2 && currentPage > 3) ||
          (page === currentPage + 2 && currentPage < totalPages - 2)
        ) {
          return (
            <span key={index} className="pagination-ellipsis">
              ...
            </span>
          );
        }
        return null;
      })}
      <button
        className="pagination-button"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &rsaquo; {/* Single right arrow for next page */}
      </button>
      <button
        className="pagination-button"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        &raquo; {/* Double right arrow for last page */}
      </button>
    </div>
  );
};

export default Pagination;
