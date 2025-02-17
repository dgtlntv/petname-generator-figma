import type { Shape } from "@penpot/plugin-types";
import generatePetName from "../petname/petname.js";
import {
  MessageType,
  type PetNameOptions,
  type PluginMessage,
} from "../types.js";
import * as CONFIG from "./penpot.config.js";

/**
 * Initialize and open the plugin window with specified configuration
 */
penpot.ui.open(
  CONFIG.WINDOW_CONFIG.TITLE,
  CONFIG.WINDOW_CONFIG.THEME_PARAM(penpot.theme),
  {
    width: CONFIG.UI_DIMENSIONS.WIDTH,
    height: CONFIG.UI_DIMENSIONS.HEIGHT,
  },
);

/**
 * Creates a new text node at the center of the viewport
 * @returns {Shape | undefined} The created text node, or undefined if creation fails
 */
function createCenteredTextNode() {
  const viewport = penpot.viewport;
  const center = viewport.center;
  const textNode = penpot.createText(" ");

  if (textNode) {
    textNode.fontFamily = CONFIG.TEXT_STYLES.FONT_FAMILY;
    textNode.x = center.x;
    textNode.y = center.y;
  }

  return textNode;
}

/**
 * Handles the generation of pet names for selected or newly created text nodes
 * @param {PetNameOptions} config - Configuration options for pet name generation
 * @returns {Promise<void>}
 */
async function handlePetNameGeneration(config: PetNameOptions) {
  let workingNodes: readonly Shape[] = [];
  let modifiedCount = 0;
  let isNewNode = false;

  const textNodes = penpot.selection.filter((node) => node.type === "text");

  if (textNodes.length === 0) {
    const newNode = createCenteredTextNode();
    if (newNode) {
      workingNodes = [newNode];
      isNewNode = true;
    }
  } else {
    workingNodes = penpot.selection;
  }

  for (const node of workingNodes) {
    if (node.type === "text") {
      node.characters = generatePetName(config);
      modifiedCount++;
    }
  }

  if (isNewNode) {
    console.log(CONFIG.NOTIFICATION_MESSAGES.NEW_NODE());
  } else if (modifiedCount > 0) {
    console.log(
      modifiedCount === 1
        ? CONFIG.NOTIFICATION_MESSAGES.RENAMED_SINGLE()
        : CONFIG.NOTIFICATION_MESSAGES.RENAMED_MULTIPLE(modifiedCount),
    );
  }
}

/**
 * Message handler for plugin UI interactions
 * Processes different types of messages and performs corresponding actions
 * @param {object} msg - The message received from the UI
 * @returns {Promise<void>}
 */
penpot.ui.onMessage(async (msg: { pluginMessage: PluginMessage }) => {
  const { pluginMessage } = msg;

  switch (pluginMessage.type) {
    case MessageType.GENERATE_PETNAMES:
      await handlePetNameGeneration(pluginMessage);
      break;
    case MessageType.GENERATE_AND_CLOSE:
      await handlePetNameGeneration(pluginMessage);
      penpot.closePlugin();
      break;
    case MessageType.CLOSE:
      penpot.closePlugin();
      break;
  }
});
