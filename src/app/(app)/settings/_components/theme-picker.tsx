"use client";

import { Radio } from "@mantine/core";
import { THEMES, type ThemeId } from "@/global/lib/themes";
import { useThemeChoice } from "../_hooks/use-theme-choice";

/**
 * One card per theme, as a radio group: arrow keys move between themes and
 * screen readers announce "radio, 2 of 3, checked". Picking one switches
 * the whole app at once.
 */
export function ThemePicker({ initial }: { initial: ThemeId }) {
  const { theme, choose, error } = useThemeChoice(initial);

  return (
    <Radio.Group value={theme} onChange={choose} label="Color theme" description="Saved on this device.">
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {THEMES.map((t) => (
          <Radio.Card key={t.id} value={t.id} className="flex flex-col gap-3 p-4 text-left">
            <div className="flex items-center justify-between">
              {/* Preview chips use the theme's real colors, not the active
                  theme's variables: that's the point of a preview. */}
              <span aria-hidden className="flex">
                {t.swatches.map((c) => (
                  <span
                    key={c}
                    className="-mr-1.5 size-7 rounded-full border-2 border-[var(--glass-edge)]"
                    style={{ background: c }}
                  />
                ))}
              </span>
              <Radio.Indicator />
            </div>
            <span>
              <span className="block font-bold text-[var(--text)]">{t.label}</span>
              <span className="block text-sm text-[var(--text-muted)]">{t.description}</span>
            </span>
          </Radio.Card>
        ))}
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm font-semibold text-[var(--bad)]">
          {error}
        </p>
      )}
    </Radio.Group>
  );
}
