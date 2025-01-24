import generatePetname from "../../../petname/petname"
import { GeneratePetnamesMessage } from "../typings/types"

// Type guard to check if a message is a GeneratePetnamesMessage
function isGeneratePetnamesMessage(msg: any): msg is GeneratePetnamesMessage {
    return msg.type === "generate-petnames"
}

// Show the UI with specified dimensions (note: Penpot doesn't support dimension configuration)
penpot.ui.open("Canonical pet name generator", `?theme=${penpot.theme}`)

// Handle messages from the UI
penpot.ui.onMessage((msg: unknown) => {
    // Extract the plugin message from Penpot's message structure
    const pluginMessage = (msg as any).pluginMessage

    // Type guard to ensure message is of the correct type
    if (isGeneratePetnamesMessage(pluginMessage)) {
        // Iterate through all selected nodes
        for (const node of penpot.selection) {
            // Check if the selected node is a text node
            if (node.type === "text") {
                // Generate and set the new pet name
                node.characters = generatePetname({
                    words: pluginMessage.words,
                    separator: pluginMessage.separator,
                    letters: pluginMessage.letters,
                    ubuntu: pluginMessage.ubuntu,
                })
            }
        }
    }

    // Close the plugin after processing
    penpot.closePlugin()
})
