import {
  buttonActionSchemaProp,
  buttonLabelSchemaProp,
  buttonOptionalIconSchemaProp,
  buttonRequiredIconSchemaProp,
  CompilationContextType,
  DEFAULT_DEVICES,
  InternalActionComponentDefinition,
  InternalComponentDefinition,
  InternalLinkDefinition,
  InternalRenderableComponentDefinition,
  InternalTextModifierDefinition,
  isResourceSchemaProp,
  parseSpacing,
  responsiveValueMap,
} from "@easyblocks/app-utils";
import {
  Config,
  ConfigDeviceRange,
  ContextParams,
  createFetchingContext,
  Devices,
  EditorLauncherProps,
  FetchingContext,
  ResourceTransformer,
  ResponsiveValue,
  SchemaProp,
  Spacing,
  Theme,
} from "@easyblocks/core";
import {
  actionTextModifier,
  StandardLink,
} from "@easyblocks/editable-components";
import { SHA1 as sha1 } from "crypto-js";
import flow from "lodash/flow";
import { buildFullTheme } from "./buildFullTheme";
import {
  themeObjectValueToResponsiveValue,
  themeScalarValueToResponsiveValue,
} from "./themeValueToResponsiveValue";
import { addTracingSchema } from "./tracing";

function normalizeSpace(
  space: ResponsiveValue<number | string>
): ResponsiveValue<Spacing> {
  return responsiveValueMap(space, (val) => {
    if (typeof val === "number") {
      return `${val}px`;
    }

    return val;
  });
}

function prepareDevices(configDevices: Config["devices"]): Devices {
  const devices: Devices = []; // let's make devices copy
  DEFAULT_DEVICES.forEach((defaultDevice) => {
    devices.push({
      ...defaultDevice,
    });
  });

  if (configDevices) {
    devices.forEach((device, index) => {
      const configDevice: ConfigDeviceRange | undefined = (
        configDevices as any
      )[device.id];
      if (configDevice) {
        device.w = configDevice.w ?? device.w;
        device.h = configDevice.h ?? device.h;
        device.hidden = configDevice.hidden ?? device.hidden;

        if (configDevice.startsFrom && index > 0) {
          const previousDevice = devices[index - 1];
          previousDevice.breakpoint = configDevice.startsFrom;
        }
      }
    });
  }

  return devices;
}

export function createCompilationContext(
  config: Config,
  contextParams: ContextParams,
  rootContainer: NonNullable<EditorLauncherProps["rootContainer"]>
): CompilationContextType {
  const devices = prepareDevices(config.devices);
  const mainDevice = devices.find((x) => x.isMain);

  if (!mainDevice) {
    throw new Error(`Missing main device in devices config.`);
  }

  const theme: Theme = {
    colors: {},
    fonts: {},
    space: {},
    numberOfItemsInRow: {},
    aspectRatios: {},
    icons: {},
    containerWidths: {},
    boxShadows: {},
  };

  const grid = {
    ...(config.mainGrid ?? {}),
    ...(config.grids?.[contextParams.grid] ?? {}),
  };

  // Main grid values
  theme.space["grid.containerMargin"] = {
    type: "dev",
    value: normalizeSpace(
      themeScalarValueToResponsiveValue(grid?.containerMargin ?? 32, devices)
    ),
  };

  theme.space["grid.horizontalGap"] = {
    type: "dev",
    value: normalizeSpace(
      themeScalarValueToResponsiveValue(grid?.horizontalGap ?? 16, devices)
    ),
  };

  theme.space["grid.verticalGap"] = {
    type: "dev",
    value: normalizeSpace(
      themeScalarValueToResponsiveValue(grid.verticalGap ?? 16, devices)
    ),
  };

  theme.numberOfItemsInRow["grid"] = {
    type: "dev",
    value: themeScalarValueToResponsiveValue(
      grid.numberOfItemsInRow ?? "4",
      devices
    ),
  }; // fill necessary to prevent auto

  // TODO: allow for custom breakpoints!!! What happens with old ones when the new ones show up?

  if (config.space) {
    config.space.forEach((space) => {
      let val = space.value;

      // If value is "vw" and is not responsive then we should responsify it.
      // Why? Because responsive token behaves differently from non-responsive in terms of auto.
      // Responsive token automatically "fills" all the breakpoints.
      // If someone does 10vw it is responsive in nature, it's NEVER a scalar.
      if (typeof val === "string" && parseSpacing(val).unit === "vw") {
        val = { [`@${mainDevice.id}`]: val };
      }

      const { id, ...rest } = space;

      theme.space[id] = {
        ...rest,
        type: "dev",
        value: normalizeSpace(themeScalarValueToResponsiveValue(val, devices)),
      };
    });
  }

  if (config.colors) {
    config.colors.forEach((color) => {
      const { id, ...rest } = color;

      theme.colors[id] = {
        ...rest,
        type: "dev",
        value: themeScalarValueToResponsiveValue(color.value, devices),
      };
    });
  }

  // if (config.tokenMapping?.colors) {
  //   for (const masterTokenId in config.tokenMapping?.colors) {
  //     const mappedTokenId = config.tokenMapping?.colors[masterTokenId];
  //     const mappedToken = config.colors?.find(
  //       (token) => token.id === mappedTokenId
  //     );
  //
  //     if (mappedToken) {
  //       theme.tokenMapping.colors[masterTokenId] = mappedTokenId;
  //     } else {
  //       console.warn(
  //         `Wrong token mapping. Token "${mappedTokenId}" doesn't exist, you try to map ${masterTokenId} to it.`
  //       );
  //     }
  //   }
  // }

  if (config.fonts) {
    // fonts are a bit more complex because they're objects
    config.fonts.forEach((font) => {
      const { id, ...rest } = font;

      theme.fonts[id] = {
        ...rest,
        type: "dev",
        value: themeObjectValueToResponsiveValue(font.value, devices),
      };
    });
  }

  if (config.aspectRatios) {
    config.aspectRatios.forEach((aspectRatio) => {
      const { id, ...rest } = aspectRatio;

      theme.aspectRatios[id] = {
        ...rest,
        type: "dev",
        value: themeScalarValueToResponsiveValue(aspectRatio.value, devices),
      };
    });
  }

  if (config.boxShadows) {
    config.boxShadows.forEach((boxShadow) => {
      const { id, ...rest } = boxShadow;

      theme.boxShadows[id] = {
        ...rest,
        type: "dev",
        value: themeScalarValueToResponsiveValue(boxShadow.value, devices),
      };
    });
  }

  if (config.containerWidths) {
    config.containerWidths.forEach((containerWidth) => {
      const { id, ...rest } = containerWidth;

      theme.containerWidths[id] = {
        ...rest,
        type: "dev",
        value: themeScalarValueToResponsiveValue(
          containerWidth.value.toString(),
          devices
        ),
      };
    });
  }

  if (config.icons) {
    config.icons.forEach((icon) => {
      const { id, ...rest } = icon;

      theme.icons[id] = {
        ...rest,
        type: "dev",
        value: icon.value,
      };
    });
  }

  const fetchingContext = createFetchingContext(config);

  const addTransformHashToResourceSchemaPropsForConfig =
    addTransformHashToResourceSchemaProps(fetchingContext);

  const actions: Array<InternalActionComponentDefinition> = (
    config.actions || []
  ).map((action) =>
    flow(addTransformHashToResourceSchemaPropsForConfig)({
      ...action,
      tags: ["action"],
    })
  );

  const components: Array<InternalRenderableComponentDefinition> = [
    ...(config.components || []).map((component) => {
      if ("tags" in component) {
        return component;
      }

      const customComponent: InternalRenderableComponentDefinition = {
        id: component.id,
        schema: component.schema,
        tags: [component.type ?? "item"],
        previewImage: component.previewImage,
        label: component.label,
      };

      return customComponent;
    }),
    ...(config.buttons || []).map((component) => {
      const customComponent = {
        ...component,
        tags: ["button"],
      };

      // Check if user didn't set label / symbol properties
      const userDefinedLabel = component.schema.find(
        (schemaProp) => schemaProp.prop === "label"
      );
      if (userDefinedLabel) {
        throw new Error(
          `Your custom component "${component.id}" have a prop named "label". You can't use it as it's a reserved prop.`
        );
      }
      const userDefinedSymbol = component.schema.find(
        (schemaProp) => schemaProp.prop === "symbol"
      );
      if (userDefinedSymbol) {
        throw new Error(
          `Your custom component "${component.id}" have a prop named "symbol". You can't use it as it's a reserved prop.`
        );
      }

      const buttonSchemaProps: SchemaProp[] = [];

      buttonSchemaProps.push(buttonActionSchemaProp);

      const { label, symbol } = component.builtinProps || {};

      if (label !== "off") {
        buttonSchemaProps.push(buttonLabelSchemaProp);
      } else {
        buttonSchemaProps.push({ ...buttonLabelSchemaProp, visible: false });
      }

      if (symbol === "optional") {
        buttonSchemaProps.push(buttonOptionalIconSchemaProp);
      } else if (symbol === "on") {
        buttonSchemaProps.push(buttonRequiredIconSchemaProp);
      } else {
        buttonSchemaProps.push({
          ...buttonOptionalIconSchemaProp,
          visible: false, // by default symbol is not visible
        });
      }

      customComponent.schema = [
        ...buttonSchemaProps,
        ...customComponent.schema.map((x) => ({
          ...x,
          group: x.group || "Properties",
        })),
      ];

      return customComponent;
    }),
  ].map(flow(addTransformHashToResourceSchemaPropsForConfig, addTracingSchema));

  const links: Array<InternalLinkDefinition> = [
    StandardLink,
    ...(config.links || []).map((linkConfig) =>
      addTransformHashToResourceSchemaPropsForConfig({
        ...linkConfig,
        tags: ["actionLink"],
      })
    ),
  ];

  const textModifiers: Array<InternalTextModifierDefinition> = [
    {
      id: "$MissingTextModifier",
      tags: ["actionTextModifier"],
      schema: [],
      apply: () => {
        return {};
      },
    },
    actionTextModifier,
    ...(config.textModifiers ?? []).map((modifier) => {
      return addTransformHashToResourceSchemaPropsForConfig({
        ...modifier,
        tags: [
          modifier.type === "text"
            ? "textModifier"
            : `${modifier.type}TextModifier`,
        ],
      });
    }),
  ];

  const rootContainers = buildRootContainers(config.rootContainers, devices);

  const compilationContext: CompilationContextType = {
    devices,
    theme: buildFullTheme(theme),
    definitions: {
      components,
      actions,
      links,
      textModifiers,
    },
    resourceTypes: fetchingContext.resourceTypes,
    image: fetchingContext.image,
    imageVariants: fetchingContext.imageVariants,
    video: fetchingContext.video,
    videoVariants: fetchingContext.videoVariants,
    text: fetchingContext.text,
    eventSink: config.eventSink,
    mainBreakpointIndex: mainDevice.id,
    contextParams,
    strict: fetchingContext.strict,
    locales: config.locales,
    rootContainer,
    rootContainers,
  };

  return compilationContext;
}

function addTransformHashToResourceSchemaProps(
  fetchingContext: FetchingContext
) {
  return <InternalDefinitionType extends InternalComponentDefinition>(
    componentDefinition: InternalDefinitionType
  ): InternalDefinitionType => {
    return {
      ...componentDefinition,
      schema: componentDefinition.schema.map((schemaProp) => {
        if (isResourceSchemaProp(schemaProp)) {
          if ("transform" in schemaProp) {
            return {
              ...schemaProp,
              transformHash: getTransformHash(schemaProp.transform),
            };
          }

          if (schemaProp.type === "image") {
            return {
              ...schemaProp,
              transformHash: getTransformHash(fetchingContext.image.transform),
            };
          } else if (schemaProp.type === "video") {
            return {
              ...schemaProp,
              transformHash: getTransformHash(fetchingContext.video.transform),
            };
          } else if (
            schemaProp.type === "resource" &&
            "variants" in schemaProp
          ) {
            return {
              ...schemaProp,
              variants: schemaProp.variants.map((variant) =>
                variant.transform
                  ? {
                      ...variant,
                      transformHash: getTransformHash(variant.transform),
                    }
                  : variant
              ),
            };
          }
        }

        return schemaProp;
      }),
    };
  };
}

function buildRootContainers(
  rootContainers: Config["rootContainers"],
  devices: Devices
): CompilationContextType["rootContainers"] {
  const resultRootContainers: CompilationContextType["rootContainers"] = [];

  if (rootContainers) {
    for (const [id, rootContainer] of Object.entries(rootContainers)) {
      const resultRootContainer: CompilationContextType["rootContainers"][0] = {
        id,
        defaultConfig: rootContainer.defaultConfig,
      };

      if (rootContainer.widths) {
        if (rootContainer.widths.length !== devices.length) {
          throw new Error(
            `Invalid number of widths for root container "${id}". Expected ${devices.length} widths, got ${rootContainer.widths.length}.`
          );
        }

        resultRootContainer.widths = Object.fromEntries(
          rootContainer.widths.map((containerWidth, index) => {
            const currentDevice = devices[index];

            return [
              currentDevice.id,
              containerWidth > currentDevice.w ? "100%" : containerWidth,
            ];
          })
        );
      }

      resultRootContainers.push(resultRootContainer);
    }
  }

  return resultRootContainers;
}

function getTransformHash(transformer: ResourceTransformer<any, any>) {
  return sha1(transformer.toString()).toString();
}
