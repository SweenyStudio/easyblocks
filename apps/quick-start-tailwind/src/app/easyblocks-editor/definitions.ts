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
  tailwind: ({ tw }) => {
    const pt = tw("pt", (v) => v);

    return {
      classNames: {
        Root: `${pt}`,
      },
    };
  },
  styles: ({ values, device, isEditing, params }) => {
    return {
      styled: {
        Root: {},
      },
      props: {
        pt: values.paddingTop,
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
  tailwind: ({ propsOutput, tw }) => {
    console.log(propsOutput);

    const bg = tw("bg", (v) => `bg-[${v}]`);
    const pt = tw("pt", (v) => `${v}`);

    return {
      classNames: {
        Root: `${bg} ${pt}`,
      },
    };
  },
  styles: ({ values, device, isEditing, params }) => {
    return {
      // these values get used by the styles - because we aren't using this we put placeholders for the components
      //if we exclued the placeholders it doesn't work
      styled: {
        Root: {},
        DummyComponent: {},
      },

      // these values get passed to the styles function under params for the component referenced
      // not releveant for tailwind because it's for the next component - but we can use it still
      // to pass variables to the next component in the chain
      components: {
        DummyComponent: {
          test: 1,
        },
      },

      // these values get passed directly to the component - we can do calculations here and use them in tailwind
      props: {
        bg: values.backgroundColor,
        pt: values.paddingTop,
      },
    };
  },
};
