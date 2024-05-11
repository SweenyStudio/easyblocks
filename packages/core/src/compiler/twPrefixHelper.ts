export const twPrefixHelper = (values: any) => {
  const tw = (propertyName: string, callback: (property: any) => string) => {
    if (!values.hasOwnProperty(propertyName))
      throw new Error(`Property ${propertyName} wasn't found`);
    const value = values[propertyName];

    if (typeof value === "object" && value.hasOwnProperty("$res")) {
      return [
        callback(value.xs.value),
        `sm:${callback(value.sm)}`,
        `md:${callback(value.md)}`,
        `lg:${callback(value.lg)}`,
        `xl:${callback(value.xl)}`,
        `2xl:${callback(value["2xl"])}`,
      ].join(" ");
    } else {
      return callback(value);
    }
  };

  return tw;
};
