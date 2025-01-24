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
figma.showUI(__html__, {
    width: 450,
    height: 720,
})

// Function to create a text node at the center of the viewport
async function createCenteredTextNode() {
    // Get the center of the current viewport
    const center = figma.viewport.center

    // Create a text node
    const textNode = figma.createText()

    // Set its position to the center of the viewport
    textNode.x = center.x
    textNode.y = center.y

    await figma.loadFontAsync({ family: "Ubuntu Sans", style: "Regular" })
    textNode.fontName = { family: "Ubuntu Sans", style: "Regular" }
    // Set font size (in pixels)
    textNode.fontSize = 16

    // Set line height (in pixels)
    textNode.lineHeight = {
        value: 24,
        unit: "PIXELS",
    }

    // Return the created node
    return textNode
}

// Function to handle generating petnames
async function handlePetnameGeneration(
    config: Omit<GeneratePetnamesMessage, "type">
) {
    const selection = figma.currentPage.selection
    let modifiedCount = 0
    let workingNodes: readonly SceneNode[] = []
    let isNewNode = false

    // First check if there are any text nodes selected
    const textNodes = selection.filter((node) => node.type === "TEXT")

    if (textNodes.length === 0) {
        // Create a new text node in the center if none are selected
        const newNode = await createCenteredTextNode()
        workingNodes = [newNode]
        isNewNode = true
    } else {
        workingNodes = selection
    }

    // Iterate through all nodes
    for (const node of workingNodes) {
        // Check if the node is a text node
        if (node.type === "TEXT") {
            // Load the font before modifying text
            await figma.loadFontAsync(node.fontName as FontName)

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

    // Show appropriate notification
    if (isNewNode) {
        figma.notify("Created new text node with pet name")
    } else if (modifiedCount > 0) {
        figma.notify(
            `Renamed ${modifiedCount} ${modifiedCount === 1 ? "node" : "nodes"} with pet names`
        )
    }
}

// Handle messages from the UI
figma.ui.onmessage = async (msg: unknown) => {
    if (isGeneratePetnamesMessage(msg)) {
        // Just generate the names
        await handlePetnameGeneration(msg)
    } else if (isGenerateAndCloseMessage(msg)) {
        // Generate the names and then close
        await handlePetnameGeneration(msg)
        figma.closePlugin()
    } else if (isCloseMessage(msg)) {
        // Just close the plugin
        figma.closePlugin()
    }
}
