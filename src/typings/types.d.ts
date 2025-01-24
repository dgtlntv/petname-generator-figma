/**
 * Message for generating pet names
 */
export interface GeneratePetnamesMessage {
    type: "generate-petnames"
    words: number
    separator: string
    letters?: number
    ubuntu: boolean
}

/**
 * Message for generating pet names and closing
 */
export interface GenerateAndCloseMessage {
    type: "generate-and-close"
    words: number
    separator: string
    letters?: number
    ubuntu: boolean
}

/**
 * Message for closing the plugin
 */
export interface CloseMessage {
    type: "close"
}

/**
 * Union type of all possible plugin messages
 */
export type PluginMessage =
    | GeneratePetnamesMessage
    | GenerateAndCloseMessage
    | CloseMessage

/**
 * Configuration options for pet name generation
 */
export interface PetNameOptions {
    words: number
    separator: string
    letters?: number
    ubuntu?: boolean
}

/**
 * Type for plugin message payload
 */
export interface PluginMessagePayload {
    pluginMessage: PluginMessage
}

export type WordList = string[]
