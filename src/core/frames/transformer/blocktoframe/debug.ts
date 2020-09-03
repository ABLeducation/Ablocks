import { arduinoFrameByExplanation } from "../frame-transformer.helpers";
import { BlockToFrameTransformer } from "../block-to-frame.interface";

export const debugBlock: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  preivousState
) => {
  return [
    arduinoFrameByExplanation(
      block.id,
      block.blockName,
      timeline,
      "Debug [will pause in Arduino Code.]",
      preivousState
    ),
  ];
};
