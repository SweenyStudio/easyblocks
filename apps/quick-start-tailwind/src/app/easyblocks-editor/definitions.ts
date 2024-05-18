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
      prop: "dummyColor",
      label: "Dummy Color",
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
      accepts: ["DummySelectable"],
    },
    {
      prop: "DummyComponentCollection",
      type: "component-collection",
      accepts: ["DummySelectable"],
      itemFields: [
        {
          prop: "test",
          type: "select",
          params: {
            options: [
              { label: "1", value: "bg-red-200" },
              { label: "2", value: "bg-yellow-200" },
            ],
          },
          defaultValue: "1",
        },
      ],
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
  // tailwind: ({ props, params, styles, tw }) => {
  //   const bg = tw(props.backgroundColor, (p) => `bg-[${p}]`);
  //   const pt = tw(props.paddingTop, (p) => p);

  //   return {
  //     Root: `${bg} ${pt}`,
  //   };
  // },
  styles: ({ values, device, isEditing, params }) => {
    // console.log("DummyComponentDefinition", { values });

    // const dataItemProps = values.DummyComponentCollection.map((c: any) => {
    //   return { tw: c.test };
    // });

    // console.log("dataItemProps", { dataItemProps });

    const ItemWrappers = values.DummyComponentCollection.map((c: any) => {
      return `bg-[${values.dummyColor}]`;
    });

    return {
      // styled: {
      //   // Root: {},
      //   // ItemWrappers: ItemWrappers.map((i: any) => ({})),
      // },
      props: {
        tw: {
          Root: `bg-[${values.backgroundColor}] lg-[${values.padding}] ${
            device.id === "sm" ? "top-0" : ""
          }`,
          ItemWrappers,
        },
      },
    };
  },
};
