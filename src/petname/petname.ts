import { type PetNameOptions, StartingLetterStyle } from "../types";
import { adjectives } from "./data/adjectives";
import { adverbs } from "./data/adverbs";
import { names } from "./data/names";
import type { WordList } from "./types";

const FALLBACK_PET_NAME = "warty-warthog";

/**
 * Gets a random part from the provided word list
 * @param wordList - Array of words to choose from
 * @returns Random word from the array or null if array is empty
 */
function getRandomWord(wordList: WordList): string | null {
  if (wordList.length === 0) return null;
  const totalWords: number = wordList.length;
  const randomIndex: number = Math.floor(Math.random() * totalWords);
  return wordList[randomIndex];
}

/**
 * Gets available starting letters that exist in all required word lists
 * @param adjectives - Adjective list
 * @param adverbs - Adverb list
 * @param names - Name list
 * @param wordCount - Number of words required
 * @returns Array of valid starting letters
 */
function getAvailableLetters(
  adjectives: WordList,
  adverbs: WordList,
  names: WordList,
  wordCount: number,
): string[] {
  // Get unique first letters from each list
  const nameFirstLetters = new Set(names.map((word) => word[0]));
  const adjectiveFirstLetters = new Set(adjectives.map((word) => word[0]));
  const adverbFirstLetters = new Set(adverbs.map((word) => word[0]));

  // Start with name letters as they're always required
  let validStartingLetters = Array.from(nameFirstLetters);

  // Filter by adjective letters if needed (2+ words)
  if (wordCount >= 2) {
    validStartingLetters = validStartingLetters.filter((letter) =>
      adjectiveFirstLetters.has(letter),
    );
  }

  // Filter by adverb letters if needed (3+ words)
  if (wordCount > 2) {
    validStartingLetters = validStartingLetters.filter((letter) =>
      adverbFirstLetters.has(letter),
    );
  }

  return validStartingLetters;
}

/**
 * Generates a pet name based on the provided configuration
 * @param options - Configuration options for name generation
 * @param options.wordCount - Number of words to include in the generated name (1-5)
 * @param options.wordSeparator - Character to use between words (e.g., '-', '_')
 * @param options.maxWordLength - Maximum length allowed for each word
 * @param options.startingLetterStyle - Whether to use Ubuntu-style naming (same starting letter for all words) or random
 * @returns Generated pet name or fallback if filters result in no valid words
 */
export default function generatePetName({
  wordCount,
  wordSeparator,
  maxWordLength,
  startingLetterStyle = StartingLetterStyle.UBUNTU,
}: PetNameOptions): string {
  let petNameComponents: string[] = [];
  let availableNames: WordList = [...names];
  let availableAdverbs: WordList = [...adverbs];
  let availableAdjectives: WordList = [...adjectives];

  // Filter by letter length if specified
  if (maxWordLength !== undefined) {
    availableAdjectives = availableAdjectives.filter(
      (word: string): boolean => word.length <= maxWordLength,
    );
    availableAdverbs = availableAdverbs.filter(
      (word: string): boolean => word.length <= maxWordLength,
    );
    availableNames = availableNames.filter(
      (word: string): boolean => word.length <= maxWordLength,
    );
  }

  // Filter by starting letter for Ubuntu-style names
  if (startingLetterStyle === StartingLetterStyle.UBUNTU) {
    const availableStartingLetters = getAvailableLetters(
      availableAdjectives,
      availableAdverbs,
      availableNames,
      wordCount,
    );
    if (availableStartingLetters.length === 0) {
      return FALLBACK_PET_NAME; // No valid letters available after filtering
    }

    const selectedStartingLetter =
      availableStartingLetters[
        Math.floor(Math.random() * availableStartingLetters.length)
      ];

    availableAdjectives = availableAdjectives.filter((word: string): boolean =>
      word.startsWith(selectedStartingLetter),
    );

    availableAdverbs = availableAdverbs.filter((word: string): boolean =>
      word.startsWith(selectedStartingLetter),
    );

    availableNames = availableNames.filter((word: string): boolean =>
      word.startsWith(selectedStartingLetter),
    );
  }

  // Ensure minimum of 1 word
  if (wordCount <= 0) {
    wordCount = 1;
  }

  // Generate name parts based on requested word count
  switch (wordCount) {
    /* Case 1: Simple name
     * User wants a single name (e.g., "warthog")
     */
    case 1: {
      const selectedName = getRandomWord(availableNames);
      if (selectedName) petNameComponents = [selectedName];
      break;
    }

    /* Case 2: Adjective + name
     * User wants a descriptive name (e.g., "warty-warthog")
     */
    case 2: {
      const selectedAdjective = getRandomWord(availableAdjectives);
      const selectedName = getRandomWord(availableNames);
      if (selectedAdjective && selectedName)
        petNameComponents = [selectedAdjective, selectedName];
      break;
    }

    /* Default (3+ words): Adverbs + adjective + name
     * User wants a more elaborate name (e.g., "wholly-warty-warthog")
     */
    default: {
      const numberOfRequiredAdverbs: number = wordCount - 2;
      const selectedAdverbs: (string | null)[] = Array(numberOfRequiredAdverbs)
        .fill("")
        .map((): string | null => getRandomWord(availableAdverbs));

      const selectedAdjective = getRandomWord(availableAdjectives);
      const selectedName = getRandomWord(availableNames);

      if (
        selectedAdjective &&
        selectedName &&
        !selectedAdverbs.includes(null)
      ) {
        petNameComponents = [
          ...(selectedAdverbs as string[]),
          selectedAdjective,
          selectedName,
        ];
      }
    }
  }

  // Return fallback if we couldn't generate valid parts
  if (petNameComponents.length === 0) {
    return FALLBACK_PET_NAME;
  }

  return petNameComponents.join(wordSeparator);
}
