exports.isEmpty = (value) => {
  if (
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim().length === 0) ||
    (typeof value === "object" && Object.keys(value).length === 0)
  ) {
    return true;
  } else {
    return false;
  }
};
