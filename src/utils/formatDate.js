export const formatDate = (date) => {
  const dateTimeOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  return new Date(date).toLocaleString("en-US", dateTimeOptions);
};
