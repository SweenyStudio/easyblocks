import { CompilationContextType, configMap } from "@easyblocks/app-utils";
import { ConfigComponent } from "@easyblocks/core";

export function removeLocalizedFlag(
  config: ConfigComponent,
  context: CompilationContextType
) {
  return configMap(config, context, ({ value, schemaProp }) => {
    if (
      (schemaProp.type === "text" && value.id.startsWith("local.")) ||
      schemaProp.type === "component-collection-localised"
    ) {
      delete value.__localized;
    }

    return value;
  });
}
