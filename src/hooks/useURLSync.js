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
    throw new Error(
      `useURLSync: initialValue must be a string when type is "string"`
    );
  }
  if (type === "number" && typeof initialValue !== "number") {
    throw new Error(
      `useURLSync: initialValue must be a number when type is "number"`
    );
  }

  // Read current search parameter value(s)
  const param = type === "array" ? searchParams.getAll(paramName) : searchParams.get(paramName);

  // Memoize the current parameter value
  const parameter = useMemo(() => {
    if (type === "array") {
      return param.length > 0 ? param : initialValue;
    }
    return param !== null ? param : initialValue;
  }, [param, initialValue, type]);

  // Memoized callback to update search parameter
  const setParameter = useCallback(
    (newParamValue) => {
      setSearchParams(
        (prevParams) => {
          const newParams = new URLSearchParams(prevParams);
          // Clear existing values for paramName
          newParams.delete(paramName);
          if (type === "array") {
            // Append each value in the array
            if (Array.isArray(newParamValue) && newParamValue.length > 0) {
              newParamValue.forEach((value) => {
                newParams.append(paramName, value);
              });
            }
          } else {
            // Set single value for string type
            if (newParamValue) {
              newParams.set(paramName, newParamValue);
            }
          }
          return newParams;
        },
        { replace: false }
      );
    },
    [setSearchParams, paramName, type]
  );

  // Seed initial value if parameter is not present in URL
  useEffect(() => {
    const currentParam = type === "array" ? searchParams.getAll(paramName) : searchParams.get(paramName);
    if (
      (type === "array" && currentParam.length === 0 && initialValue.length > 0) ||
      (type === "string" && currentParam === null && initialValue)
    ) {
      setParameter(initialValue);
    }
  }, [searchParams, setSearchParams, paramName, initialValue, type, setParameter]);

  return [parameter, setParameter];
}