import generatePetName from "../petname/petname"
import { MessageType, PetNameOptions, PluginMessage } from "../types"
import * as CONFIG from "./figma.config"

/**
 * Initialize and open the plugin window with specified configuration
 */
figma.showUI(__html__, {
    width: CONFIG.UI_DIMENSIONS.WIDTH,
    height: CONFIG.UI_DIMENSIONS.HEIGHT,
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
        family: CONFIG.TEXT_STYLES.FONT_FAMILY,
        style: CONFIG.TEXT_STYLES.FONT_STYLE,
    })
    textNode.fontName = {
        family: CONFIG.TEXT_STYLES.FONT_FAMILY,
        style: CONFIG.TEXT_STYLES.FONT_STYLE,
    }
    textNode.fontSize = CONFIG.TEXT_STYLES.FONT_SIZE
    textNode.lineHeight = {
        value: CONFIG.TEXT_STYLES.LINE_HEIGHT,
        unit: CONFIG.TEXT_STYLES.LINE_HEIGHT_UNIT,
    }

    return textNode
}

/**
 * Handles the generation of pet names for selected text nodes or creates a new text node
 * @async
 * @param {PetNameOptions} config - Configuration options for pet name generation
 * @returns {Promise<void>}
 */
async function handlePetNameGeneration(config: PetNameOptions) {
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
            node.characters = generatePetName(config)
            modifiedCount++
        }
    }

    if (isNewNode) {
        figma.notify(CONFIG.NOTIFICATION_MESSAGES.NEW_NODE())
    } else if (modifiedCount > 0) {
        figma.notify(
            modifiedCount === 1
                ? CONFIG.NOTIFICATION_MESSAGES.RENAMED_SINGLE()
                : CONFIG.NOTIFICATION_MESSAGES.RENAMED_MULTIPLE(modifiedCount)
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
            await handlePetNameGeneration(message)
            break
        case MessageType.GENERATE_AND_CLOSE:
            await handlePetNameGeneration(message)
            figma.closePlugin()
            break
        case MessageType.CLOSE:
            figma.closePlugin()
            break
    }
}
