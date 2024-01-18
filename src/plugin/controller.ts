import generatePetname from "../petname/petname"

figma.showUI(__html__, { width: 400, height: 600 })

figma.ui.onmessage = async (msg) => {
    if (msg.type === "generate-petnames") {
        for (const node of figma.currentPage.selection) {
            if (node.type === "TEXT") {
                await figma.loadFontAsync(node.fontName as FontName)
                console.log(msg.words, msg.separator, msg.letters, msg.ubuntu)

                node.characters = generatePetname(msg.words, msg.separator, msg.letters, msg.ubuntu)
            }
        }
    }

    figma.closePlugin()
}
