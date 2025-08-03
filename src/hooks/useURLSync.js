import { useEffect, useMemo, useCallback } from "react";

export function useURLSync(
  searchParams,
  setSearchParams,
  paramName,
  type = "string",
  initialValue = ""
) {
  // Type validation
  if (type === "array" && !Array.isArray(initialValue)) {
    throw new Error(
      `useURLSync: initialValue must be an array when type is "array"`
    );
  }

  if (type === "string" && typeof initialValue !== "string") {
    throw new Error(`
        useURLSync: initialValue must be a string when type is "string"`);
  }

  // Read the current search parameter value
  const param = searchParams.get(paramName);

  // Memoize the current URLSearchParams parameter value
  const parameter = useMemo(() => {
    if (param !== null) {
      return type === "array" ? param.split(",") : param;
    }
    return initialValue;
  }, [initialValue, param, type]);

  // Memoized callback handler to update the URLSearchParams parameter
  const setParameter = useCallback((newParamValue) => {
    setSearchParams(
      (searchParams) => {
        searchParams.set(paramName, newParamValue);
        return searchParams;
      },
      { replace: true }
    );
  }, []);

  // Effect to "seed" URLSearchParams if not defined yet
  useEffect(() => {
    if (param === null && initialValue) {
      setSearchParams(
        (searchParams) => {
          searchParams.set(paramName, initialValue);
          return searchParams;
        },
        { replace: true }
      );
    }
  }, [initialValue, param]);

  // return stable array reference with return values
  return useMemo(() => [parameter, setParameter], [parameter, setParameter]);
}