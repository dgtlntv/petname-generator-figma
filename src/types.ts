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
  type: MessageType;
}

export interface PetNameOptions {
  wordCount: number;
  wordSeparator: string;
  maxWordLength?: number;
  startingLetterStyle?: StartingLetterStyle;
}

export interface GeneratePetNamesMessage extends BaseMessage, PetNameOptions {
  type: MessageType.GENERATE_PETNAMES;
}

export interface GenerateAndCloseMessage extends BaseMessage, PetNameOptions {
  type: MessageType.GENERATE_AND_CLOSE;
}

export interface CloseMessage extends BaseMessage {
  type: MessageType.CLOSE;
}

export type PluginMessage =
  | GeneratePetNamesMessage
  | GenerateAndCloseMessage
  | CloseMessage;
