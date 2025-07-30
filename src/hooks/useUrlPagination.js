import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// Note: Fast Refresh warning is safe to ignore here because this file exports both hooks and components intentionally for shared pagination logic.

//** Custom hook for 2-way binding pagination with URL */
export function useUrlPagination(defaultPage = 1, defaultSize = 10) {
  const navigate = useNavigate();
  const location = useLocation();

  const [page, setPage] = useState(defaultPage);
  const [size, setSize] = useState(defaultSize);

  // Update URL when page changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    params.set("page", parseInt(page));
    params.set("size", parseInt(size));
    navigate({ search: params.toString() }, { replace: true });
    // eslint-disable-next-line
  }, [page, size]);

  // Update state if URL changes (browser navigation)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get("page")) || defaultPage;
    const size = parseInt(params.get("size")) || defaultSize;
    setPage(page);
    setSize(size);
    // eslint-disable-next-line
  }, [location.search]);

  return [page, setPage, size, setSize];
}
