function removeEmptyFields<T extends { [key: string]: unknown }>(
  obj: T
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v != null && v !== "")
  ) as Partial<T>;
}

export { removeEmptyFields };
