export function formatTickerTime(dateStr: string) {
  const date = new Date(dateStr + "Z");
  return date.toLocaleTimeString("de-CH", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Zurich",
  });
}

export function formatTickerDate(dateStr: string) {
  const date = new Date(dateStr + "Z");
  return date.toLocaleDateString("de-CH", {
    day: "numeric",
    month: "long",
    timeZone: "Europe/Zurich",
  });
}
