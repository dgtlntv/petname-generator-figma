import { PetNameOptions, WordList } from "../typings/types"
import { adjectives } from "./data/adjectives"
import { adverbs } from "./data/adverbs"
import { names } from "./data/names"

/**
 * Gets a random part from the provided word list
 * @param parts - Array of words to choose from
 * @returns Random word from the array
 */
function getPart(parts: WordList): string {
    const numberOfValues: number = parts.length
    const index: number = Math.floor(Math.random() * numberOfValues)
    return parts[index]
}

/**
 * Generates a pet name based on the provided configuration
 * @param options - Configuration options for name generation
 * @returns Generated pet name
 */
export default function generatePetname({
    words,
    separator,
    letters,
    ubuntu = false,
}: PetNameOptions): string {
    let petnameParts: string[] = []
    let nam: WordList = names
    let adv: WordList = adverbs
    let adj: WordList = adjectives

    // Filter by letter length if specified
    if (letters !== undefined) {
        adj = adj.filter((v: string): boolean => v.length <= letters)
        adv = adv.filter((v: string): boolean => v.length <= letters)
        nam = nam.filter((v: string): boolean => v.length <= letters)
    }

    // Filter by starting letter for Ubuntu-style names
    if (ubuntu) {
        const startingLetter: string = String.fromCharCode(
            97 + Math.floor(Math.random() * 26)
        )
        adj = adj.filter((v: string): boolean => v.startsWith(startingLetter))
        adv = adv.filter((v: string): boolean => v.startsWith(startingLetter))
        nam = nam.filter((v: string): boolean => v.startsWith(startingLetter))
    }

    // Ensure minimum of 2 words
    if (words <= 0) {
        words = 2
    }

    // Generate name parts based on requested word count
    if (words === 1) {
        petnameParts = [getPart(nam)]
    } else if (words === 2) {
        petnameParts = [getPart(adj), getPart(nam)]
    } else {
        const numberOfAdverbs: number = words - 2
        const adverbParts: string[] = Array(numberOfAdverbs)
            .fill("")
            .map((): string => getPart(adv))
        petnameParts = [...adverbParts, getPart(adj), getPart(nam)]
    }

    const petname: string = petnameParts.join(separator)
    return petname
}
