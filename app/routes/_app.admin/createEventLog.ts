import { dateAndTimeToJSDate } from "~/dateUtils";
import { createEventLog as create } from "~/models/eventLog.server";
import { z } from "zod";

const createEventLogSchema = z.object({
  data: z.string().trim().min(1, { message: "Bericht is verplicht" }),
  date: z.string().min(1, { message: "Publicatie datum is verplicht." }),
  time: z.string().min(1, { message: "Publicatie tijdstip is verplicht." }),
});

export async function createEventLog(formData: any) {
  const zodResult = createEventLogSchema.safeParse(formData);
  if (!zodResult.success) {
    return { errors: zodResult.error.format(), formData };
  }
  const { data, date, time } = zodResult.data;
  const newEventLog = {
    data,
    publishAt: dateAndTimeToJSDate(date, time),
    type: "ANNOUNCEMENT",
  };
  await create(newEventLog);
  return { errors: null, formData: null };
}
