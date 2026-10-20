"use client";

import { notifications } from "@mantine/notifications";
import { FloorForm } from "@/global/components/floor/floor-form";
import type { FloorFormValues } from "@/global/lib/schemas/floor";
import { updateFloor } from "../actions";

/** The shared FloorForm in edit mode, with a confirmation once saved. */
export function FloorEditor({ initialValues }: { initialValues: FloorFormValues }) {
  return (
    <FloorForm
      header={<h2 className="font-display text-2xl font-bold">Your monthly costs</h2>}
      initialValues={initialValues}
      action={updateFloor}
      submitLabel="Save changes"
      onSuccess={() => notifications.show({ title: "Saved", message: "Your floor is updated.", color: "green" })}
    />
  );
}
