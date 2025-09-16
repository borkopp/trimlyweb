import dayjs from "dayjs";

export const formatDateTime = (date: string, time: string) => {
  return dayjs(`${date} ${time}`).format("MMM D, h:mm A");
};

export const formatDate = (date: string) => {
  return dayjs(date).format("MMM D, YYYY");
};

export const formatDateShort = (date: string) => {
  return dayjs(date).format("MMM D");
};

export const formatTime = (time: string) => {
  return dayjs(`2000-01-01 ${time}`).format("HH:mm");
};