export const dateToString = (date: Date) => {
  debugger;
  return date.toISOString().split('T')[0];
};

export const stringToDate = (string: string): Date => {
  const timestamp = Date.parse(string);

  return isNaN(timestamp) ? new Date() : new Date(timestamp);
};
