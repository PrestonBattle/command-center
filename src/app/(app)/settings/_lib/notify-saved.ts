import { notifications } from "@mantine/notifications";

/** The "Saved" notice both Settings forms show, worded for what was saved. */
export function notifySaved(message: string) {
  notifications.show({ title: "Saved", message, color: "green" });
}
