import {
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  Pagination,
  PaginationContent,
  PaginationPrevious,
  PaginationNext
} from "@/components/ui/pagination"

/**
 * Generate pagination items for a given page range
 * @param {number} totalPages - Total number of pages
 * @param {number} currentPage - Current active page (0-based)
 * @param {function} handlePageChange - Function to handle page changes
 * @param {number} maxVisiblePages - Maximum number of visible page buttons
 * @returns {Array} Array of pagination item components
 */
export const generatePaginationItems = (totalPages, currentPage, handlePageChange, maxVisiblePages = 5) => {
  const items = []

  if (totalPages <= maxVisiblePages) {
    // Show all pages if total is small
    for (let i = 0; i < totalPages; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      )
    }
  } else {
    // Show first page
    items.push(
      <PaginationItem key={0}>
        <PaginationLink
          onClick={() => handlePageChange(0)}
          isActive={currentPage === 0}
        >
          1
        </PaginationLink>
      </PaginationItem>
    )

    // Show ellipsis if needed
    if (currentPage > 2) {
      items.push(
        <PaginationItem key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>
      )
    }

    // Show current page and neighbors
    const start = Math.max(1, currentPage - 1)
    const end = Math.min(totalPages - 2, currentPage + 1)

    for (let i = start; i <= end; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      )
    }

    // Show ellipsis if needed
    if (currentPage < totalPages - 3) {
      items.push(
        <PaginationItem key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>
      )
    }

    // Show last page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages - 1}>
          <PaginationLink
            onClick={() => handlePageChange(totalPages - 1)}
            isActive={currentPage === totalPages - 1}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      )
    }
  }

  return items
}

/**
 * Calculate pagination info
 * @param {Object} pageable - Pageable object from API response
 * @param {number} totalPages - Total number of pages
 * @param {number} totalElements - Total number of elements
 * @returns {Object} Pagination information
 */
export const getPaginationInfo = (pageable, totalPages, totalElements) => {
  return {
    currentPage: pageable?.pageNumber || 0,
    pageSize: pageable?.pageSize || 10,
    totalPages: totalPages || 0,
    totalElements: totalElements || 0,
    hasNext: !pageable?.last,
    hasPrevious: !pageable?.first
  }
}

export const PaginationBar = ({ totalPages, currentPage, handlePageChange }) => {
  return (
    <>
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                  className={currentPage === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {generatePaginationItems(totalPages, currentPage, handlePageChange)}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
                  className={currentPage === totalPages - 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>

  )
}