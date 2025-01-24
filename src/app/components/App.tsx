import { ChangeEvent, useState } from "react"
import { CancelMessage, GeneratePetnamesMessage } from "../../typings/types"
import "../styles/ui.scss"
import canonicalLogo from "./canonical.svg"

export default function App() {
    const [words, setWords] = useState<number>(2)
    const [separator, setSeparator] = useState<string>("-")
    const [letters, setLetters] = useState<number | undefined>(undefined)
    const [startingLetter, setStartingLetter] = useState<string>("ubuntu")

    // Event handlers
    const handleWordsChange = (e: ChangeEvent<HTMLSelectElement>): void => {
        setWords(Number(e.target.value))
    }

    const handleSeparatorChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setSeparator(e.target.value)
    }

    const handleLettersChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value ? Number(e.target.value) : undefined
        setLetters(value)
    }

    const handleStartingLetterChange = (
        e: ChangeEvent<HTMLInputElement>
    ): void => {
        setStartingLetter(e.target.value)
    }

    // Plugin message handlers
    const handleGenerate = (): void => {
        const message: GeneratePetnamesMessage = {
            type: "generate-petnames",
            words,
            separator,
            letters,
            ubuntu: startingLetter === "ubuntu", // Convert to boolean based on selection
        }
        parent.postMessage({ pluginMessage: message }, "*")
    }

    const handleCancel = (): void => {
        const message: CancelMessage = { type: "cancel" }
        parent.postMessage({ pluginMessage: message }, "*")
    }

    return (
        <div className="petname-generator__container">
            <header className="petname-generator__header">
                <img
                    src={canonicalLogo}
                    alt="Canonical Logo"
                    className="petname-generator__logo"
                />
                <h2 className="petname-generator__title">Petname generator</h2>
            </header>

            <p>
                Select text nodes, configure the settings below and click
                generate.
            </p>

            <div className="petname-generator__form-section">
                <div>
                    <h4>Amount of words</h4>
                    <select
                        name="words"
                        id="words"
                        defaultValue="2"
                        onChange={handleWordsChange}
                    >
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </div>

                <div>
                    <h4>Separator</h4>
                    <input
                        type="text"
                        id="separator"
                        name="separator"
                        onChange={handleSeparatorChange}
                        minLength={0}
                        maxLength={1}
                        placeholder="-"
                    />
                </div>

                <div>
                    <h4>Word length</h4>
                    <input
                        type="number"
                        id="letters"
                        name="letters"
                        onChange={handleLettersChange}
                    />
                </div>

                <div>
                    <h4>Starting letter</h4>
                    <label className="p-radio">
                        <input
                            type="radio"
                            className="p-radio__input"
                            name="startingLetter"
                            value="ubuntu"
                            defaultChecked
                            onChange={handleStartingLetterChange}
                            aria-labelledby="ubuntuStyleLabel"
                        />
                        <span className="p-radio__label" id="ubuntuStyleLabel">
                            Ubuntu style (same starting letter)
                        </span>
                    </label>

                    <label className="p-radio">
                        <input
                            type="radio"
                            className="p-radio__input"
                            name="startingLetter"
                            value="random"
                            onChange={handleStartingLetterChange}
                            aria-labelledby="randomLabel"
                        />
                        <span className="p-radio__label" id="randomLabel">
                            Random
                        </span>
                    </label>
                </div>
            </div>

            <footer className="petname-generator__footer">
                <div>
                    <button onClick={handleCancel}>Cancel</button>
                    <button
                        className="p-button--positive"
                        id="generate"
                        onClick={handleGenerate}
                    >
                        Generate
                    </button>
                </div>
            </footer>
        </div>
    )
}
