import { Shape } from "@penpot/plugin-types"
import generatePetname from "../petname/petname"
import {
    CloseMessage,
    GenerateAndCloseMessage,
    GeneratePetnamesMessage,
} from "../typings/types"

// Type guards
function isGeneratePetnamesMessage(msg: any): msg is GeneratePetnamesMessage {
    return msg.type === "generate-petnames"
}

function isGenerateAndCloseMessage(msg: any): msg is GenerateAndCloseMessage {
    return msg.type === "generate-and-close"
}

function isCloseMessage(msg: any): msg is CloseMessage {
    return msg.type === "close"
}

// Show the UI with specified dimensions
penpot.ui.open("Canonical pet name generator", `?theme=${penpot.theme}`, {
    width: 450,
    height: 770,
})

// Function to create a text node at the center of the viewport
function createCenteredTextNode() {
    // Get the viewport information
    const viewport = penpot.viewport
    const center = viewport.center

    // Create a text node
    const textNode = penpot.createText(" ")

    // Set Ubuntu Sans as the font if the API supports it
    if (textNode) {
        textNode.fontFamily = "Ubuntu Sans"
        // Set its position to the center of the viewport
        textNode.x = center.x
        textNode.y = center.y
    }

    return textNode
}

// Function to handle generating petnames
async function handlePetnameGeneration(
    config: Omit<GeneratePetnamesMessage, "type">
) {
    let workingNodes: readonly Shape[] = []
    let modifiedCount = 0
    let isNewNode = false

    // Check if there are any text nodes selected
    const textNodes = penpot.selection.filter((node) => node.type === "text")

    if (textNodes.length === 0) {
        // Create a new text node in the center if none are selected
        const newNode = createCenteredTextNode()
        if (newNode) {
            workingNodes = [newNode]
            isNewNode = true
        }
    } else {
        workingNodes = penpot.selection
    }

    // Iterate through all nodes
    for (const node of workingNodes) {
        // Check if the node is a text node
        if (node.type === "text") {
            // Generate and set the new pet name
            node.characters = generatePetname({
                words: config.words,
                separator: config.separator,
                letters: config.letters,
                ubuntu: config.ubuntu,
            })
            modifiedCount++
        }
    }

    // We can use console.log for debugging instead of notifications
    if (isNewNode) {
        console.log("Created new text node with pet name")
    } else if (modifiedCount > 0) {
        console.log(
            `Renamed ${modifiedCount} ${modifiedCount === 1 ? "node" : "nodes"} with pet names`
        )
    }
}

// Handle messages from the UI
penpot.ui.onMessage(async (msg: unknown) => {
    // Extract the plugin message from Penpot's message structure
    const pluginMessage = (msg as any).pluginMessage

    if (isGeneratePetnamesMessage(pluginMessage)) {
        // Just generate the names
        await handlePetnameGeneration(pluginMessage)
    } else if (isGenerateAndCloseMessage(pluginMessage)) {
        // Generate the names and then close
        await handlePetnameGeneration(pluginMessage)
        penpot.closePlugin()
    } else if (isCloseMessage(pluginMessage)) {
        // Just close the plugin
        penpot.closePlugin()
    }
})
