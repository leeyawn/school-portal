import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(timeStr: string): string {
  if (!timeStr) return "";
  const [start, end] = timeStr.split("-");
  const formatHour = (t: string) => {
    if (t.includes(":")) {
      const [h, m] = t.split(":");
      const hour = parseInt(h);
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      return `${displayHour}:${m} ${period}`;
    } else if (t.length === 4) {
      const h = Number(t.slice(0, 2));
      const m = t.slice(2, 4);
      const period = h >= 12 ? "PM" : "AM";
      const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
      return `${hour}:${m} ${period}`;
    }
    return t;
  };
  return `${formatHour(start)}-${formatHour(end)}`;
}

export function formatDays(daysStr: string): string {
  // Normalize to uppercase and trim whitespace
  daysStr = daysStr.toUpperCase().replace(/\s+/g, "");
  // Example: "MWF" => "Mon, Wed, Fri"
  const map: Record<string, string> = { M: "Mon", T: "Tue", W: "Wed", R: "Thu", F: "Fri" };
  return daysStr.split("").map(d => map[d]).filter(Boolean).join(", ");
}

export function parseDays(daysStr: string): string[] {
  // Normalize to uppercase and trim whitespace
  daysStr = daysStr.toUpperCase().replace(/\s+/g, "");
  // Example: "MWF" => ["Mon", "Wed", "Fri"]
  const map: Record<string, string> = { M: "Mon", T: "Tue", W: "Wed", R: "Thu", F: "Fri" };
  return daysStr.split("").map(d => map[d]).filter(Boolean);
}

export function formatBuilding(building: string): string {
  const buildingMap: Record<string, string> = {
    "DONOVN": "Donovan Hall",
    "KUNSHL": "Kunsela Hall",
    // Add more building mappings as needed
  };
  return buildingMap[building] || building;
}

export function parseTime(timeStr: string): [number, number] {
  const START_HOUR = 8;
  // Accepts "14:00-15:50" or "1400-1550"
  if (!timeStr) return [START_HOUR, START_HOUR + 1];
  const [start, end] = timeStr.split("-");
  const toHour = (t: string) => {
    if (t.includes(":")) {
      const [h, m] = t.split(":").map(Number);
      return h + (m ? m / 60 : 0);
    } else if (t.length === 4) {
      // e.g., "1400"
      const h = Number(t.slice(0, 2));
      const m = Number(t.slice(2, 4));
      return h + (m ? m / 60 : 0);
    }
    return Number(t) || START_HOUR;
  };
  return [toHour(start), toHour(end)];
}
