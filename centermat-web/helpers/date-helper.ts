export const getDateString = (selectedDate: Date): string => {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const day = selectedDate.getDate();

  return Temporal.PlainDate.from({
    year,
    month: month + 1, // JS months are 0-11, Temporal is 1-12
    day
  }).toString();
};
