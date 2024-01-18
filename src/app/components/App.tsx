import React from "react"
import "../styles/ui.scss"

function App() {
    const [words, setWords] = React.useState(2)
    const [separator, setSeparator] = React.useState("-")
    const [letters, setLetters] = React.useState(undefined)
    const [ubuntu, setUbuntu] = React.useState(true)

    const onGenerate = () => {
        parent.postMessage({ pluginMessage: { type: "generate-petnames", words, separator, letters, ubuntu } }, "*")
    }

    const onCancel = () => {
        parent.postMessage({ pluginMessage: { type: "cancel" } }, "*")
    }

    return (
        <div
            style={{
                paddingLeft: "24px",
                paddingRight: "24px",
                paddingBottom: "24px",
            }}
        >
            <header
                style={{
                    display: "flex",
                    alignItems: "flex-end",
                }}
            >
                <img
                    src={require("./canonical.svg")}
                    alt="Canonical Logo"
                    style={{
                        maxWidth: "32px",
                        marginRight: "8px",
                    }}
                />

                <h2
                    style={{
                        margin: "0",
                        verticalAlign: "bottom",
                    }}
                >
                    Petname generator
                </h2>
            </header>

            <div
                style={{
                    margin: "24px 0",
                }}
            >
                <div>
                    <h4>Amount of words</h4>
                    <select name="words" id="words" defaultValue="2" onChange={(e) => setWords(Number(e.target.value))}>
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
                        onChange={(e) => setSeparator(e.target.value)}
                        minLength={0}
                        maxLength={1}
                        placeholder="-"
                    />
                </div>

                <div>
                    <h4>Word length</h4>
                    <input type="number" id="letters" name="letters" onChange={(e) => setLetters(e.target.value)} />
                </div>

                <div>
                    <h4>Ubuntu style?</h4>
                    <input
                        type="checkbox"
                        id="ubuntu"
                        name="ubuntu"
                        defaultChecked
                        onChange={(e) => setUbuntu(e.target.checked)}
                    />
                </div>
            </div>

            <footer
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                }}
            >
                <div>
                    <button onClick={onCancel}>Cancel</button>
                    <button className="p-button--positive" id="generate" onClick={onGenerate}>
                        Generate
                    </button>
                </div>
            </footer>
        </div>
    )
}

export default App
