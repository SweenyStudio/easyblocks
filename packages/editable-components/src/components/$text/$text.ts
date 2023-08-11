import {
  EditableComponentToComponentConfig,
  InternalRenderableComponentDefinition,
} from "@easyblocks/app-utils";
import {
  Color,
  Font,
  RefValue,
  ResponsiveValue,
  UnresolvedResource,
} from "@easyblocks/core";
import { range } from "@easyblocks/utils";
import $textStyles from "./$text.styles";

const textEditableComponent: InternalRenderableComponentDefinition<"$text"> = {
  id: "$text",
  styles: $textStyles,
  tags: ["item", "notrace"],
  schema: [
    {
      prop: "value",
      type: "text",
    },
    {
      prop: "color",
      label: "Color",
      type: "color",
    },
    {
      prop: "font",
      label: "Font",
      type: "font",
    },
    {
      prop: "accessibilityRole",
      type: "select",
      label: "Role",
      options: [
        { value: "p", label: "Paragraph" },
        ...range(1, 6).map((index) => ({
          value: `h${index}`,
          label: `Heading ${index}`,
        })),
      ],
      group: "Accessibility and SEO",
    },
  ],
};

type TextComponentConfig = EditableComponentToComponentConfig<
  typeof textEditableComponent
> & {
  color: ResponsiveValue<RefValue<ResponsiveValue<Color>>>;
  font: ResponsiveValue<RefValue<ResponsiveValue<Font>>>;
  value: UnresolvedResource;
  accessibilityRole: string;
};

export { textEditableComponent };
export type { TextComponentConfig };
