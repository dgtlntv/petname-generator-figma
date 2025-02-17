import { Shape } from "@penpot/plugin-types"
import generatePetname from "../petname/petname"
import { MessageType, PetnameOptions, PluginMessage } from "../types"
import {
    NOTIFICATION_MESSAGES,
    TEXT_STYLES,
    UI_DIMENSIONS,
    WINDOW_CONFIG,
} from "./penpot.config"

/**
 * Initialize and open the plugin window with specified configuration
 */
penpot.ui.open(WINDOW_CONFIG.TITLE, WINDOW_CONFIG.THEME_PARAM(penpot.theme), {
    width: UI_DIMENSIONS.WIDTH,
    height: UI_DIMENSIONS.HEIGHT,
})

/**
 * Creates a new text node at the center of the viewport
 * @returns {Shape | undefined} The created text node, or undefined if creation fails
 */
function createCenteredTextNode() {
    const viewport = penpot.viewport
    const center = viewport.center
    const textNode = penpot.createText(" ")

    if (textNode) {
        textNode.fontFamily = TEXT_STYLES.FONT_FAMILY
        textNode.x = center.x
        textNode.y = center.y
    }

    return textNode
}

/**
 * Handles the generation of pet names for selected or newly created text nodes
 * @param {PetnameOptions} config - Configuration options for pet name generation
 * @returns {Promise<void>}
 */
async function handlePetnameGeneration(config: PetnameOptions) {
    let workingNodes: readonly Shape[] = []
    let modifiedCount = 0
    let isNewNode = false

    const textNodes = penpot.selection.filter((node) => node.type === "text")

    if (textNodes.length === 0) {
        const newNode = createCenteredTextNode()
        if (newNode) {
            workingNodes = [newNode]
            isNewNode = true
        }
    } else {
        workingNodes = penpot.selection
    }

    for (const node of workingNodes) {
        if (node.type === "text") {
            node.characters = generatePetname(config)
            modifiedCount++
        }
    }

    if (isNewNode) {
        console.log(NOTIFICATION_MESSAGES.NEW_NODE)
    } else if (modifiedCount > 0) {
        console.log(
            modifiedCount === 1
                ? NOTIFICATION_MESSAGES.RENAMED_SINGLE
                : NOTIFICATION_MESSAGES.RENAMED_MULTIPLE(modifiedCount)
        )
    }
}

/**
 * Message handler for plugin UI interactions
 * Processes different types of messages and performs corresponding actions
 * @param {unknown} msg - The message received from the UI
 * @returns {Promise<void>}
 */
penpot.ui.onMessage(async (msg: unknown) => {
    const pluginMessage = (msg as any).pluginMessage as PluginMessage

    switch (pluginMessage.type) {
        case MessageType.GENERATE_PETNAMES:
            await handlePetnameGeneration(pluginMessage)
            break
        case MessageType.GENERATE_AND_CLOSE:
            await handlePetnameGeneration(pluginMessage)
            penpot.closePlugin()
            break
        case MessageType.CLOSE:
            penpot.closePlugin()
            break
    }
})
