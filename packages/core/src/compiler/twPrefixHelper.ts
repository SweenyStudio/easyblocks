import { Devices } from "../types";

export const twPrefexHelper = (devices: Devices) => {
  const tw = (value: any, callback: (property: any) => string) => {
    if (typeof value === "object" && value.hasOwnProperty("$res")) {
      const sizes = devices.sort((a, b) => a.w - b.w).map((d) => d.id);

      let smallestValue: any;
      for (const size of sizes) {
        if (value[size] !== undefined) {
          smallestValue = value[size];
          break;
        }
      }

      const $res: { [key: string]: any } = {};
      for (const size of sizes) {
        if (value[size] !== undefined) {
          $res[size] = value[size];
          smallestValue = value[size];
        } else {
          $res[size] = smallestValue;
        }
      }

      let final = "";
      let index = 0;
      let prev: any = undefined;
      for (const size of sizes) {
        const cbValue = $res[size].hasOwnProperty("value")
          ? $res[size].value
          : $res[size];
        if (index === 0) {
          final = `${callback(cbValue)}`;
        } else {
          if (prev !== cbValue) {
            final = `${final} ${size}:${callback(cbValue)}`;
          }
        }
        prev = cbValue;
        index++;
      }

      return final;
    } else {
      return callback(value);
    }
  };

  return tw;
};
