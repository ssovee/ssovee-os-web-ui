export const getFormattedDate = (dateInput: string): string => {
  const timestamp = Number(dateInput);
  if (isNaN(timestamp)) return "Invalid date";

  const date = new Date(timestamp);
  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return formatter.format(date);
};
