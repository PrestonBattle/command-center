import type { Signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";

type UseToolBarOptions = {
  searchQuery: Signal<string>;
}