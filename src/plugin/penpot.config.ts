export const UI_DIMENSIONS = {
  WIDTH: 450,
  HEIGHT: 770,
} as const;

export const TEXT_STYLES = {
  FONT_FAMILY: "Ubuntu Sans",
} as const;

export const WINDOW_CONFIG = {
  TITLE: "Canonical pet name generator",
  THEME_PARAM: (theme: string) => `?theme=${theme}`,
} as const;

export const NOTIFICATION_MESSAGES = {
  NEW_NODE: () => "Created new text node with pet name",
  RENAMED_SINGLE: () => "Renamed 1 node with pet names",
  RENAMED_MULTIPLE: (count: number) => `Renamed ${count} nodes with pet names`,
} as const;
