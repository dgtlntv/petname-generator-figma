export const UI_DIMENSIONS = {
    WIDTH: 450,
    HEIGHT: 720,
} as const

export const TEXT_STYLES = {
    FONT_FAMILY: "Ubuntu Sans",
    FONT_STYLE: "Regular",
    FONT_SIZE: 16,
    LINE_HEIGHT: 24,
    LINE_HEIGHT_UNIT: "PIXELS",
} as const

export const NOTIFICATION_MESSAGES = {
    NEW_NODE: () => "Created new text node with pet name",
    RENAMED_SINGLE: () => "Renamed 1 node with pet names",
    RENAMED_MULTIPLE: (count: number) =>
        `Renamed ${count} nodes with pet names`,
} as const
