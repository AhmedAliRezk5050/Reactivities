export const stringToDate = (string: string): Date => {
  const timestamp = Date.parse(string);

  return isNaN(timestamp) ? new Date() : new Date(timestamp);
};
