import { type ChangeEvent, useCallback, useState } from "react";
import {
  MessageType,
  type PluginMessage,
  StartingLetterStyle,
} from "../../types";
import "../styles/index.scss";
import canonicalLogo from "./canonical.svg";

/**
 * Main application component for the PetName Generator.
 * This component allows users to generate pet names with configurable settings
 * such as word count, separator, maximum word length, and starting letter style.
 *
 * @returns {JSX.Element} The rendered PetName Generator interface
 */
export default function App() {
  const [wordCount, setWordCount] = useState<number>(2);
  const [wordSeparator, setWordSeparator] = useState<string>("-");
  const [maxWordLength, setMaxWordLength] = useState<number | undefined>(
    undefined,
  );
  const [startingLetterStyle, setStartingLetterStyle] =
    useState<StartingLetterStyle>(StartingLetterStyle.UBUNTU);

  /**
   * Handles changes to the word count input.
   * Ensures the value stays between 1 and 5.
   *
   * @param {ChangeEvent<HTMLInputElement>} e - The input change event
   */
  const handleWordCountChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      const value = Math.min(Math.max(1, Number(e.target.value)), 5);
      setWordCount(value);
    },
    [],
  );

  /**
   * Handles changes to the word separator input.
   *
   * @param {ChangeEvent<HTMLInputElement>} e - The input change event
   */
  const handleWordSeparatorChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      setWordSeparator(e.target.value);
    },
    [],
  );

  /**
   * Handles changes to the maximum word length input.
   * Ensures the value doesn't exceed 12 characters.
   *
   * @param {ChangeEvent<HTMLInputElement>} e - The input change event
   */
  const handleMaxWordLengthChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      const value = e.target.value
        ? Math.min(Number(e.target.value), 12)
        : undefined;
      setMaxWordLength(value);
    },
    [],
  );

  /**
   * Handles changes to the starting letter style radio buttons.
   *
   * @param {ChangeEvent<HTMLInputElement>} e - The input change event
   */
  const handleStartingLetterStyleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      setStartingLetterStyle(e.target.value as StartingLetterStyle);
    },
    [],
  );

  /**
   * Sends a message to generate pet names with the current settings.
   */
  const handleGenerate = useCallback((): void => {
    const message: PluginMessage = {
      type: MessageType.GENERATE_PETNAMES,
      wordCount,
      wordSeparator,
      maxWordLength,
      startingLetterStyle,
    };
    parent.postMessage({ pluginMessage: message }, "*");
  }, [wordCount, wordSeparator, maxWordLength, startingLetterStyle]);

  /**
   * Sends a message to close the plugin interface.
   */
  const handleClose = useCallback((): void => {
    const message: PluginMessage = {
      type: MessageType.CLOSE,
    };
    parent.postMessage({ pluginMessage: message }, "*");
  }, []);

  /**
   * Sends a message to generate pet names and close the plugin interface.
   */
  const handleGenerateAndClose = useCallback((): void => {
    const message: PluginMessage = {
      type: MessageType.GENERATE_AND_CLOSE,
      wordCount,
      wordSeparator,
      maxWordLength,
      startingLetterStyle,
    };
    parent.postMessage({ pluginMessage: message }, "*");
  }, [wordCount, wordSeparator, maxWordLength, startingLetterStyle]);

  return (
    <div className="petname-generator__container">
      <header className="petname-generator__header">
        <img
          src={canonicalLogo}
          alt="Canonical Logo"
          className="petname-generator__logo"
        />
        <h2 className="petname-generator__title">Pet name generator</h2>
      </header>

      <p>Select text nodes, configure the settings below and click generate.</p>

      <div className="petname-generator__form-section">
        <div>
          <label htmlFor="words">Amount of words</label>
          <input
            type="number"
            name="words"
            id="words"
            value={wordCount}
            onChange={handleWordCountChange}
            min={1}
            max={5}
          />
          <p className="p-form-help-text">Maximum amount of words is 5.</p>
        </div>

        <div>
          <label htmlFor="separator">Separator</label>
          <input
            type="text"
            id="separator"
            name="separator"
            onChange={handleWordSeparatorChange}
            minLength={0}
            maxLength={1}
            value={wordSeparator}
          />
          <p className="p-form-help-text">
            A separator like -, _, : etc. Can only be one character.
          </p>
        </div>

        <div>
          <label htmlFor="letters">Max. word length</label>
          <input
            type="number"
            id="letters"
            name="letters"
            onChange={handleMaxWordLengthChange}
            min={1}
            max={12}
            value={maxWordLength || ""}
          />
          <p className="p-form-help-text">Leave empty to allow any length.</p>
        </div>

        <div role="radiogroup" aria-labelledby="startingLetterLabel">
          <span id="startingLetterLabel">Starting letter per word</span>
          <label className="p-radio">
            <input
              type="radio"
              className="p-radio__input"
              name="startingLetter"
              value={StartingLetterStyle.UBUNTU}
              defaultChecked
              onChange={handleStartingLetterStyleChange}
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
              value={StartingLetterStyle.RANDOM}
              onChange={handleStartingLetterStyleChange}
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
          <button
            type="button"
            className="p-button--base"
            onClick={handleClose}
          >
            Close
          </button>
          <button
            className="p-button"
            id="generate-and-close"
            onClick={handleGenerateAndClose}
            type="button"
          >
            Generate & Close
          </button>
          <button
            className="p-button--positive"
            id="generate"
            onClick={handleGenerate}
            type="button"
          >
            Generate
          </button>
        </div>
      </footer>
    </div>
  );
}
