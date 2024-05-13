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
  }, [css]);

  useEffect(() => {
    function traverseAndExtractClasses(obj: any): string {
      let result = "";
      function traverse(obj: any) {
        if (Array.isArray(obj)) {
          obj.forEach(traverse);
        } else if (typeof obj === "object" && obj !== null) {
          for (const key in obj) {
            if (key.startsWith("classNames")) {
              Object.entries(obj[key]).forEach(([key, value]) => {
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
      if (eventType === "meta") {
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
