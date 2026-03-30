import type { TimeInputParts } from "../types";

export function parseTimeToSeconds(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const parts = trimmed.split(":").map((part) => Number(part));

  if (parts.some((part) => Number.isNaN(part))) {
    return null;
  }

  if (parts.length === 2) {
    const [minutes, seconds] = parts;

    if (seconds < 0 || seconds >= 60) {
      return null;
    }

    return minutes * 60 + seconds;
  }

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;

    if (minutes < 0 || minutes >= 60 || seconds < 0 || seconds >= 60) {
      return null;
    }

    return hours * 3600 + minutes * 60 + seconds;
  }

  return null;
}

export function splitTimeInputValue(value: string): TimeInputParts {
  const normalized = value.trim();

  if (!normalized) {
    return {
      hours: "",
      minutes: "",
      seconds: "",
    };
  }

  const parts = normalized.split(":").map((part) => part.replace(/[^\d]/g, "").slice(0, 2));

  if (parts.length === 3) {
    return {
      hours: parts[0] ?? "",
      minutes: parts[1] ?? "",
      seconds: parts[2] ?? "",
    };
  }

  if (parts.length === 2) {
    return {
      hours: "",
      minutes: parts[0] ?? "",
      seconds: parts[1] ?? "",
    };
  }

  return {
    hours: "",
    minutes: parts[0] ?? "",
    seconds: "",
  };
}

export function buildTimeInputValue(parts: TimeInputParts) {
  const hours = parts.hours.replace(/[^\d]/g, "").slice(0, 2);
  const minutes = parts.minutes.replace(/[^\d]/g, "").slice(0, 2);
  const seconds = parts.seconds.replace(/[^\d]/g, "").slice(0, 2);

  if (!hours && !minutes && !seconds) {
    return "";
  }

  if (hours) {
    return `${hours}:${minutes || "0"}:${seconds || "0"}`;
  }

  return `${minutes || "0"}:${seconds || "0"}`;
}