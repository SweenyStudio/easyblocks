import type { CompilationContextType } from "@easyblocks/app-utils";
import { uniqueId } from "@easyblocks/utils";
import type { RichTextComponentConfig } from "./$richText";
import type {
  RichTextBlockElementComponentConfig,
  RichTextBlockElementType,
} from "./$richTextBlockElement/$richTextBlockElement";
import type { RichTextInlineWrapperElementEditableComponentConfig } from "./$richTextInlineWrapperElement/$richTextInlineWrapperElement";
import type { RichTextLineElementComponentConfig } from "./$richTextLineElement/$richTextLineElement";
import type { RichTextPartComponentConfig } from "./$richTextPart/$richTextPart";

interface Identity {
  id: string;
}

function buildRichTextComponentConfig({
  accessibilityRole,
  compilationContext,
  elements,
  isListStyleAuto,
  mainColor,
  mainFont,
}: Pick<RichTextComponentConfig, "mainColor" | "mainFont"> &
  Partial<
    Pick<RichTextComponentConfig, "accessibilityRole" | "isListStyleAuto">
  > & {
    compilationContext: CompilationContextType;
    elements: RichTextComponentConfig["elements"][string];
  }): RichTextComponentConfig {
  return {
    _id: uniqueId(),
    _template: "$richText",
    accessibilityRole: accessibilityRole ?? "div",
    elements: {
      [compilationContext.contextParams.locale]: elements,
    },
    isListStyleAuto: isListStyleAuto ?? true,
    mainColor,
    mainFont,
  };
}

function buildRichTextBlockElementComponentConfig(
  type: RichTextBlockElementType,
  elements: RichTextBlockElementComponentConfig["elements"]
): RichTextBlockElementComponentConfig {
  return {
    _template: "$richTextBlockElement",
    elements,
    type,
    _id: uniqueId(),
  };
}

function buildRichTextParagraphBlockElementComponentConfig({
  elements,
}: Pick<
  RichTextBlockElementComponentConfig,
  "elements"
>): RichTextBlockElementComponentConfig {
  return {
    _template: "$richTextBlockElement",
    elements,
    type: "paragraph",
    _id: uniqueId(),
  };
}

function buildRichTextBulletedListBlockElementComponentConfig({
  elements,
}: Pick<
  RichTextBlockElementComponentConfig,
  "elements"
>): RichTextBlockElementComponentConfig {
  return {
    _template: "$richTextBlockElement",
    elements,
    type: "bulleted-list",
    _id: uniqueId(),
  };
}

function buildRichTextLineElementComponentConfig({
  elements,
}: Pick<
  RichTextLineElementComponentConfig,
  "elements"
>): RichTextLineElementComponentConfig {
  return {
    _template: "$richTextLineElement",
    elements,
    _id: uniqueId(),
  };
}

function buildRichTextInlineWrapperElementComponentConfig({
  id,
  elements,
  action,
  textModifier,
  actionTextModifier,
}: Pick<RichTextInlineWrapperElementEditableComponentConfig, "elements"> &
  Partial<
    Identity &
      Pick<
        RichTextInlineWrapperElementEditableComponentConfig,
        "textModifier" | "actionTextModifier" | "action"
      >
  >): RichTextInlineWrapperElementEditableComponentConfig {
  return {
    _id: id ?? uniqueId(),
    _template: "$richTextInlineWrapperElement",
    elements,
    action: action ?? [],
    textModifier: textModifier ?? [],
    actionTextModifier: actionTextModifier ?? [],
  };
}

function buildRichTextPartComponentConfig({
  color,
  font,
  value,
  id,
}: Pick<RichTextPartComponentConfig, "color" | "font" | "value"> &
  Partial<Identity>): RichTextPartComponentConfig {
  return {
    _id: id ?? uniqueId(),
    _template: "$richTextPart",
    color,
    font,
    value,
  };
}

export {
  buildRichTextComponentConfig,
  buildRichTextBlockElementComponentConfig,
  buildRichTextBulletedListBlockElementComponentConfig,
  buildRichTextParagraphBlockElementComponentConfig,
  buildRichTextLineElementComponentConfig,
  buildRichTextInlineWrapperElementComponentConfig,
  buildRichTextPartComponentConfig,
};
