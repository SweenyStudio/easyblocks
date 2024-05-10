import { NoCodeComponentDefinition } from "@easyblocks/core";

export const DummySelectableDefinition: NoCodeComponentDefinition = {
  id: "DummySelectable",
  label: "DummySelectable",
  type: "component",
  schema: [
    {
      prop: "paddingTop",
      label: "Padding Top",
      type: "select",
      params: {
        options: [
          { label: "pt-0", value: "pt-0" },
          { label: "pt-10", value: "pt-10" },
        ],
      },
      defaultValue: "pt-0",
    },
  ],
  tailwind: ({ values, tw }) => {
    const pt = tw("paddingTop", (v) => v);

    return {
      classNames: {
        Root: `${pt}`,
      },
    };
  },
  styles: ({ values, device, isEditing, params }) => {
    return {
      styled: {
        Root: {
          // still need to
        },
      },
    };
  },
};

export const DummyBannerDefinition: NoCodeComponentDefinition = {
  id: "DummyBanner",
  label: "DummyBanner",
  schema: [
    {
      prop: "nonResponsive",
      label: "Non Responsive",
      type: "boolean",
      responsive: true,
    },
    {
      prop: "backgroundColor",
      label: "Background Color",
      type: "color",
      defaultValue: {
        tokenId: "white",
      },
    },
    {
      prop: "padding",
      label: "Pading",
      type: "space",
    },
    {
      prop: "DummyComponent",
      type: "component",
      required: false,
      accepts: ["DummySelectable"],
    },
    {
      prop: "paddingTop",
      label: "Padding Top",
      type: "select",
      params: {
        options: [
          { label: "pt-0", value: "pt-0" },
          { label: "pt-10", value: "pt-10" },
        ],
      },
      defaultValue: "pt-10",
    },
  ],
  tailwind: ({ values, tw }) => {
    const bg = tw("backgroundColor", (v) => `bg-[${v}]`);
    const pt = tw("paddingTop", (v) => `${v}`);

    return {
      classNames: {
        Root: `${bg} ${pt}`,
      },
    };
  },
  styles: ({ values, device, isEditing, params }) => {
    return {
      styled: {
        Root: {
          // still need to
        },
        DummyComponent: {},
      },
    };
  },
};
