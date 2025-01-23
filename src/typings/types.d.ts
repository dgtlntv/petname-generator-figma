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
 * Message for canceling the operation
 */
export interface CancelMessage {
    type: "cancel"
}

/**
 * Union type of all possible plugin messages
 */
export type PluginMessage = GeneratePetnamesMessage | CancelMessage

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

declare module "*.svg" {
    const content: any
    export default content
}
