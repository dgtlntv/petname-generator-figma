export enum MessageType {
    GENERATE_PETNAMES = "generate-petnames",
    GENERATE_AND_CLOSE = "generate-and-close",
    CLOSE = "close",
}

export enum StartingLetterStyle {
    UBUNTU = "ubuntu",
    RANDOM = "random",
}

interface BaseMessage {
    type: MessageType
}

export interface PetnameOptions {
    wordCount: number
    wordSeparator: string
    maxWordLength?: number
    startingLetterStyle?: StartingLetterStyle
}

export interface GeneratePetnamesMessage extends BaseMessage, PetnameOptions {
    type: MessageType.GENERATE_PETNAMES
}

export interface GenerateAndCloseMessage extends BaseMessage, PetnameOptions {
    type: MessageType.GENERATE_AND_CLOSE
}

export interface CloseMessage extends BaseMessage {
    type: MessageType.CLOSE
}

export type PluginMessage =
    | GeneratePetnamesMessage
    | GenerateAndCloseMessage
    | CloseMessage
