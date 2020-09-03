import { findFieldValue } from "../../../blockly/helpers/block-data.helper";
import { ValueGenerator } from "../block-to-value.interface";
import { getDefaultValue } from "../frame-transformer.helpers";
import _ from "lodash";

export const getVariable: ValueGenerator = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const variableId = findFieldValue(block, "VAR");
  const variable = variables.find((v) => v.id == variableId);

  return previousState &&
    _.keys(previousState.variables).includes(variable.name)
    ? previousState.variables[variable.name].value
    : undefined;
};
