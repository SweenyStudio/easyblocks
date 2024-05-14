"use client";

import { EasyblocksEditor } from "@easyblocks/editor";
import { easyblocksConfig } from "./config";
import { DummyBanner, DummySelectable } from "./components";
import { useEffect, useState } from "react";
import { createTailwindcss } from "@mhsdesign/jit-browser-tailwindcss";
import useMemoizedState from "./useMemomizedState";

const tailwind = createTailwindcss({
  tailwindConfig: {
    // disable normalize css
    corePlugins: { preflight: false },
  },
});

export default function EeasyblocksEditorPage() {
  const [css, setCss] = useMemoizedState<string>("");

  useEffect(() => {
    console.log("CSS updated");
    console.log(css);
  }, [css]);

  useEffect(() => {
    function traverseAndExtractClasses(obj: any): string {
      let result = "";
      function traverse(obj: any) {
        if (Array.isArray(obj)) {
          obj.forEach(traverse);
        } else if (typeof obj === "object" && obj !== null) {
          for (const key in obj) {
            if (key.startsWith("tw")) {
              Object.entries(obj[key]).forEach(([key, value]) => {
                if (typeof value === "string") {
                  result += ` ${value}`;
                } else if (typeof value === "object" || Array.isArray(value)) {
                  result += ` ${JSON.stringify(value)}`;
                }
                console.log("CSS", { value });
                result += ` ${value}`;
              });
            } else {
              traverse(obj[key]);
            }
          }
        }
      }

      traverse(obj);
      return result;
    }

    const callback = (eventType: string) => {
      if (eventType === "meta" || eventType === "renderableContent") {
        const createTailwind = async () => {
          const stringForTailwind = traverseAndExtractClasses(
            window.parent.editorWindowAPI?.compiled
          );
          const generatedCss = await tailwind.generateStylesFromContent(
            `
              /* without the "@tailwind base;" */
              @tailwind components;
              @tailwind utilities;
            `,
            [stringForTailwind]
          );
          setCss(generatedCss);
        };
        createTailwind();
      }
    };

    // poll for the editor window api to be ready
    const interval = setInterval(() => {
      if (window.parent.editorWindowAPI && window.parent != window.self) {
        clearInterval(interval);
        window.parent.editorWindowAPI.subscribe(callback);
        callback("renderableContent"); // trigger the first time
      }
    }, 100);
  }, []);

  return (
    <>
      <style jsx global>
        {`
          ${css}
        `}
      </style>
      <EasyblocksEditor
        config={easyblocksConfig}
        components={{ DummyBanner, DummySelectable }}
      />
    </>
  );
}
