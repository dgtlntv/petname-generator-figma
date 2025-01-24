import { PetNameOptions, WordList } from "../typings/types"
import { adjectives } from "./data/adjectives"
import { adverbs } from "./data/adverbs"
import { names } from "./data/names"

/**
 * Gets a random part from the provided word list
 * @param parts - Array of words to choose from
 * @returns Random word from the array or null if array is empty
 */
function getPart(parts: WordList): string | null {
    if (parts.length === 0) return null
    const numberOfValues: number = parts.length
    const index: number = Math.floor(Math.random() * numberOfValues)
    return parts[index]
}

/**
 * Gets available starting letters that exist in all required word lists
 * @param adj - Adjective list
 * @param adv - Adverb list
 * @param nam - Name list
 * @param words - Number of words required
 * @returns Array of valid starting letters
 */
function getAvailableLetters(
    adj: WordList,
    adv: WordList,
    nam: WordList,
    words: number
): string[] {
    // Get unique first letters from each list
    const namLetters = new Set(nam.map((word) => word[0]))
    const adjLetters = new Set(adj.map((word) => word[0]))
    const advLetters = new Set(adv.map((word) => word[0]))

    // Start with name letters as they're always required
    let validLetters = Array.from(namLetters)

    // Filter by adjective letters if needed (2+ words)
    if (words >= 2) {
        validLetters = validLetters.filter((letter) => adjLetters.has(letter))
    }

    // Filter by adverb letters if needed (3+ words)
    if (words > 2) {
        validLetters = validLetters.filter((letter) => advLetters.has(letter))
    }

    return validLetters
}

/**
 * Generates a pet name based on the provided configuration
 * @param options - Configuration options for name generation
 * @returns Generated pet name or fallback if filters result in no valid words
 */
export default function generatePetname({
    words,
    separator,
    letters,
    ubuntu = false,
}: PetNameOptions): string {
    let petnameParts: string[] = []
    let nam: WordList = [...names]
    let adv: WordList = [...adverbs]
    let adj: WordList = [...adjectives]

    // Filter by letter length if specified
    if (letters !== undefined) {
        adj = adj.filter((v: string): boolean => v.length <= letters)
        adv = adv.filter((v: string): boolean => v.length <= letters)
        nam = nam.filter((v: string): boolean => v.length <= letters)
    }

    // Filter by starting letter for Ubuntu-style names
    if (ubuntu) {
        const availableLetters = getAvailableLetters(adj, adv, nam, words)
        if (availableLetters.length === 0) {
            return "fallback-name" // No valid letters available after filtering
        }

        const startingLetter =
            availableLetters[
                Math.floor(Math.random() * availableLetters.length)
            ]
        adj = adj.filter((v: string): boolean => v.startsWith(startingLetter))
        adv = adv.filter((v: string): boolean => v.startsWith(startingLetter))
        nam = nam.filter((v: string): boolean => v.startsWith(startingLetter))
    }

    // Ensure minimum of 1 word
    if (words <= 0) {
        words = 1
    }

    // Generate name parts based on requested word count
    if (words === 1) {
        const namePart = getPart(nam)
        if (namePart) petnameParts = [namePart]
    } else if (words === 2) {
        const adjPart = getPart(adj)
        const namePart = getPart(nam)
        if (adjPart && namePart) petnameParts = [adjPart, namePart]
    } else {
        const numberOfAdverbs: number = words - 2
        const adverbParts: (string | null)[] = Array(numberOfAdverbs)
            .fill("")
            .map((): string | null => getPart(adv))

        const adjPart = getPart(adj)
        const namePart = getPart(nam)

        if (adjPart && namePart && !adverbParts.includes(null)) {
            petnameParts = [...(adverbParts as string[]), adjPart, namePart]
        }
    }

    // Return fallback if we couldn't generate valid parts
    if (petnameParts.length === 0) {
        return "fallback-name"
    }

    return petnameParts.join(separator)
}
