import names from "./data/names"
import adverbs from "./data/adverbs"
import adjectives from "./data/adjectives"

function getPart(parts) {
    Math.random()
    const numberOfValues = parts.length
    const index = Math.floor(Math.random() * numberOfValues)
    return parts[index]
}

export default function generatePetname(words, separator, letters, ubuntu) {
    let petnameParts = []
    let nam = names
    let adv = adverbs
    let adj = adjectives

    if (letters !== undefined) {
        adj = adj.filter((v) => v.length <= letters)
        adv = adv.filter((v) => v.length <= letters)
        nam = nam.filter((v) => v.length <= letters)
    }

    if (ubuntu === true) {
        const startingLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26))
        adj = adj.filter((v) => v.startsWith(startingLetter))
        adv = adv.filter((v) => v.startsWith(startingLetter))
        nam = nam.filter((v) => v.startsWith(startingLetter))
    }

    if (words <= 0) {
        words = 2
    }
    if (words === 1) {
        petnameParts = [getPart(nam)]
    }
    if (words === 2) {
        petnameParts = [getPart(adj), getPart(nam)]
    }
    if (words >= 3) {
        const numberOfAdverbs = words - 2
        const adverbParts = Array(numberOfAdverbs)
            .fill("")
            .map(() => getPart(adv))
        petnameParts = [...adverbParts, getPart(adj), getPart(nam)]
    }

    const petname = petnameParts.join(separator)
    return petname
}
