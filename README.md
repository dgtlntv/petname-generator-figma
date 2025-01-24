# Canonical pet name generator plugin for Figma and Penpot
<img src="https://github.com/user-attachments/assets/234765ad-b9ff-4517-bb10-847183500898" width="600">

This is a plugin which can generate Ubuntu style pet names for selected text nodes in Figma and Penpot.

## Building

To build the plugins run `npm run build`. This will create a `dist` folder. Follow [Figmas](https://www.figma.com/plugin-docs/plugin-quickstart-guide/) and [Penpots](https://help.penpot.app/plugins/create-a-plugin/#2.7.-step-7.-load-the-plugin-in-penpot) on how to locally import these build plugins.

## Development

This is esentially a React app. Both the Figma and Penpot share most of their code. They just need different plugin Typescript files which are located under `./src/plugin/` and different manifest files localted under `./plugin-manifests`.
The vite config contains different build modes for the HTML and Javasript for both Figma and Penpot. Executing `npm run build` runs all of them.
