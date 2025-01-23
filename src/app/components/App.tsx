import { ChangeEvent, useState } from "react"
import { CancelMessage, GeneratePetnamesMessage } from "../../typings/types"
import "../styles/ui.scss"

export default function App() {
    const [words, setWords] = useState<number>(2)
    const [separator, setSeparator] = useState<string>("-")
    const [letters, setLetters] = useState<number | undefined>(undefined)
    const [ubuntu, setUbuntu] = useState<boolean>(true)

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

    const handleUbuntuChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setUbuntu(e.target.checked)
    }

    // Plugin message handlers
    const handleGenerate = (): void => {
        const message: GeneratePetnamesMessage = {
            type: "generate-petnames",
            words,
            separator,
            letters,
            ubuntu,
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
                    src={require("./canonical.svg")}
                    alt="Canonical Logo"
                    className="petname-generator__logo"
                />
                <h2 className="petname-generator__title">Petname generator</h2>
            </header>

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
                    <h4>Ubuntu style?</h4>
                    <input
                        type="checkbox"
                        id="ubuntu"
                        name="ubuntu"
                        defaultChecked
                        onChange={handleUbuntuChange}
                    />
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
