import generatePetname from "../petname/petname"
import { MessageType, PetnameOptions, PluginMessage } from "../types"
import {
    NOTIFICATION_MESSAGES,
    TEXT_STYLES,
    UI_DIMENSIONS,
} from "./figma.config"

/**
 * Initialize and open the plugin window with specified configuration
 */
figma.showUI(__html__, {
    width: UI_DIMENSIONS.WIDTH,
    height: UI_DIMENSIONS.HEIGHT,
})

/**
 * Creates a new text node centered in the viewport with default text styles
 * @async
 * @returns {Promise<TextNode>} A promise that resolves to the created text node
 */
async function createCenteredTextNode() {
    const center = figma.viewport.center
    const textNode = figma.createText()

    textNode.x = center.x
    textNode.y = center.y

    await figma.loadFontAsync({
        family: TEXT_STYLES.FONT_FAMILY,
        style: TEXT_STYLES.FONT_STYLE,
    })
    textNode.fontName = {
        family: TEXT_STYLES.FONT_FAMILY,
        style: TEXT_STYLES.FONT_STYLE,
    }
    textNode.fontSize = TEXT_STYLES.FONT_SIZE
    textNode.lineHeight = {
        value: TEXT_STYLES.LINE_HEIGHT,
        unit: TEXT_STYLES.LINE_HEIGHT_UNIT,
    }

    return textNode
}

/**
 * Handles the generation of pet names for selected text nodes or creates a new text node
 * @async
 * @param {PetnameOptions} config - Configuration options for pet name generation
 * @returns {Promise<void>}
 */
async function handlePetnameGeneration(config: PetnameOptions) {
    const selection = figma.currentPage.selection
    let modifiedCount = 0
    let workingNodes: readonly SceneNode[] = []
    let isNewNode = false

    const textNodes = selection.filter((node) => node.type === "TEXT")

    if (textNodes.length === 0) {
        const newNode = await createCenteredTextNode()
        workingNodes = [newNode]
        isNewNode = true
    } else {
        workingNodes = selection
    }

    for (const node of workingNodes) {
        if (node.type === "TEXT") {
            await figma.loadFontAsync(node.fontName as FontName)
            node.characters = generatePetname(config)
            modifiedCount++
        }
    }

    if (isNewNode) {
        figma.notify(NOTIFICATION_MESSAGES.NEW_NODE)
    } else if (modifiedCount > 0) {
        figma.notify(
            modifiedCount === 1
                ? NOTIFICATION_MESSAGES.RENAMED_SINGLE
                : NOTIFICATION_MESSAGES.RENAMED_MULTIPLE(modifiedCount)
        )
    }
}

/**
 * Message handler for UI events
 * @async
 * @param {unknown} msg - The message received from the UI
 * @returns {Promise<void>}
 */
figma.ui.onmessage = async (msg: unknown) => {
    const message = msg as PluginMessage

    switch (message.type) {
        case MessageType.GENERATE_PETNAMES:
            await handlePetnameGeneration(message)
            break
        case MessageType.GENERATE_AND_CLOSE:
            await handlePetnameGeneration(message)
            figma.closePlugin()
            break
        case MessageType.CLOSE:
            figma.closePlugin()
            break
    }
}
