export function normalizeArray<T>(value: unknown, fallback: T[] = []): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }

  if (!value || typeof value !== "object") {
    return fallback;
  }

  const record = value as Record<string, unknown>;

  const possibleKeys = [
    "data",
    "items",
    "results",
    "rows",
    "list",
    "roads",
    "riskMap",
    "complaints",
    "contractors",
    "sensors",
    "notifications",
    "flags",
    "contractorSpending"
  ];

  for (const key of possibleKeys) {
    const possibleValue = record[key];

    if (Array.isArray(possibleValue)) {
      return possibleValue as T[];
    }

    if (possibleValue && typeof possibleValue === "object") {
      const nestedArray = normalizeArray<T>(possibleValue, []);

      if (nestedArray.length > 0) {
        return nestedArray;
      }
    }
  }

  return fallback;
}

export function normalizeObject<T extends Record<string, unknown>>(
  value: unknown,
  fallback: T
): T {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const record = value as Record<string, unknown>;

    if (record.data && typeof record.data === "object" && !Array.isArray(record.data)) {
      return record.data as T;
    }

    return record as T;
  }

  return fallback;
}