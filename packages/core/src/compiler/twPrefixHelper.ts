export const twPrefixHelper = (values: any) => {
  const tw = (propertyName: string, callback: (property: any) => string) => {
    if (!values.hasOwnProperty(propertyName))
      throw new Error(`Property ${propertyName} wasn't found`);
    const value = values[propertyName];

    if (typeof value === "object" && value.hasOwnProperty("$res")) {
      return [
        callback(value.xs.value),
        `sm:${callback(value.sm.value)}`,
        `md:${callback(value.md.value)}`,
        `lg:${callback(value.lg.value)}`,
        `xl:${callback(value.xl.value)}`,
        `2xl:${callback(value["2xl"].value)}`,
      ].join(" ");
    } else {
      return callback(value);
    }
  };

  return tw;
};
