"use client";

import { EasyblocksEditor } from "@easyblocks/editor";
import { Config, EasyblocksBackend } from "@easyblocks/core";
import { ReactElement } from "react";
import Editor from "./_components/editor";

if (!process.env.NEXT_PUBLIC_EASYBLOCKS_ACCESS_TOKEN) {
  throw new Error("Missing NEXT_PUBLIC_EASYBLOCKS_ACCESS_TOKEN");
}

export default function EeasyblocksEditorPage() {
  return (
    <Editor
      editorParams={{
        readOnly: false,
        rootComponentId: "DummyBanner",
        rootTemplateId: null,
        documentId: null,
        templateId: null,
        locale: null,
        preview: false,
        debug: false,
      }}
    />
  );
}
