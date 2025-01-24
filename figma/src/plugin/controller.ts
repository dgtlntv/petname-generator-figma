import generatePetname from "../../../petname/petname"
import { GeneratePetnamesMessage } from "../typings/types"

// Type guard to check if a message is a GeneratePetnamesMessage
function isGeneratePetnamesMessage(msg: any): msg is GeneratePetnamesMessage {
    return msg.type === "generate-petnames"
}

// Show the UI with specified dimensions
figma.showUI(__html__, {
    width: 400,
    height: 600,
})

// Handle messages from the UI
figma.ui.onmessage = async (msg: unknown) => {
    // Type guard to ensure message is of the correct type
    if (isGeneratePetnamesMessage(msg)) {
        // Iterate through all selected nodes
        for (const node of figma.currentPage.selection) {
            // Check if the selected node is a text node
            if (node.type === "TEXT") {
                // Load the font before modifying text
                // Cast to FontName is necessary because Figma's types expect this
                await figma.loadFontAsync(node.fontName as FontName)

                // Generate and set the new pet name
                node.characters = generatePetname({
                    words: msg.words,
                    separator: msg.separator,
                    letters: msg.letters,
                    ubuntu: msg.ubuntu,
                })
            }
        }
    }

    // Close the plugin after processing
    figma.closePlugin()
}
