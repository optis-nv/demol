import { DateTime } from "luxon";

export const dateAndTimeToJSDate = (date: string, time: string) => {
  const dateTime = DateTime.fromFormat(`${date} ${time}`, "yyyy-MM-dd HH:mm", {
    zone: "Europe/Brussels",
  });
  if (!dateTime.isValid) {
    throw new Error("invalid date or time provided");
  }
  return dateTime.toJSDate();
};
