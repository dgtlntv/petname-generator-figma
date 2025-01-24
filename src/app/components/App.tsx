import { ChangeEvent, useState } from "react"
import {
    CloseMessage,
    GenerateAndCloseMessage,
    GeneratePetnamesMessage,
} from "../../typings/types"
import "../styles/ui.scss"
import canonicalLogo from "./canonical.svg"

export default function App() {
    const [words, setWords] = useState<number>(2)
    const [separator, setSeparator] = useState<string>("-")
    const [letters, setLetters] = useState<number | undefined>(undefined)
    const [startingLetter, setStartingLetter] = useState<string>("ubuntu")

    // Event handlers
    const handleWordsChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const value = Math.min(Math.max(1, Number(e.target.value)), 5)
        setWords(value)
    }

    const handleSeparatorChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setSeparator(e.target.value)
    }

    const handleLettersChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const value = e.target.value
            ? Math.min(Number(e.target.value), 12)
            : undefined
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
            ubuntu: startingLetter === "ubuntu",
        }
        parent.postMessage({ pluginMessage: message }, "*")
    }

    const handleClose = (): void => {
        const message: CloseMessage = { type: "close" }
        parent.postMessage({ pluginMessage: message }, "*")
    }

    const handleGenerateAndClose = (): void => {
        const message: GenerateAndCloseMessage = {
            type: "generate-and-close",
            words,
            separator,
            letters,
            ubuntu: startingLetter === "ubuntu",
        }
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
                    <label htmlFor="words">Amount of words</label>
                    <input
                        type="number"
                        name="words"
                        id="words"
                        value={words}
                        onChange={handleWordsChange}
                        min={1}
                        max={5}
                    />
                    <p
                        className="p-form-help-text"
                        id="exampleInputHelpMessage"
                    >
                        Maximum amount of words is 5.
                    </p>
                </div>

                <div>
                    <label htmlFor="separator">Separator</label>
                    <input
                        type="text"
                        id="separator"
                        name="separator"
                        onChange={handleSeparatorChange}
                        minLength={0}
                        maxLength={1}
                        value={separator}
                    />
                    <p
                        className="p-form-help-text"
                        id="exampleInputHelpMessage"
                    >
                        A separator like -, _, : etc. Can only be one character.
                    </p>
                </div>

                <div>
                    <label htmlFor="separator">Max. word length</label>
                    <input
                        type="number"
                        id="letters"
                        name="letters"
                        onChange={handleLettersChange}
                        min={1}
                        max={12}
                        value={letters || ""}
                    />
                    <p
                        className="p-form-help-text"
                        id="exampleInputHelpMessage"
                    >
                        Leave empty to allow any length.
                    </p>
                </div>

                <div>
                    <label>Starting letter per word</label>
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
                    <button className="p-button--base" onClick={handleClose}>
                        Close
                    </button>
                    <button
                        className="p-button"
                        id="generate-and-close"
                        onClick={handleGenerateAndClose}
                    >
                        Generate & Close
                    </button>
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
