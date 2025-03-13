export const formatJoinedDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return "Recently joined";
  }
};
