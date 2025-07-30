import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// Note: Fast Refresh warning is safe to ignore here because this file exports both hooks and components intentionally for shared pagination logic.

//** Custom hook for 2-way binding pagination with URL */
export function useUrlPagination(
  defaultPage = 1,
  defaultSize = 10,
  defaultType
) {
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = useState(defaultPage);
  const [size, setSize] = useState(defaultSize);
  const [type, setType] = useState(defaultType);

  // Update URL when page changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    params.set("page", page);
    params.set("size", size);
    if (type) {
      params.set("type", type);
    }
    navigate({ search: params.toString() }, { replace: true });
  }, [size, type, page, navigate, location.search]);

  // Update state if URL changes (browser navigation)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    console.log(params.get("page"));
    const page = params.get("page") || defaultPage;
    const size = params.get("size") || defaultSize;
    const type = params.get("type");
    setPage(page);
    setSize(size);
    if (type) {
      setType(type);
    }
  }, [defaultPage, defaultSize, location.search]);

  return [page, setPage, size, setSize, type, setType];
}
