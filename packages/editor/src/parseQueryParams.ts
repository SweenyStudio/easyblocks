import { EditorParams } from "./types";

export function parseQueryParams() {
  const searchParams = new URLSearchParams(window.location.search);

  const readOnly =
    searchParams.get("readOnly") === "true"
      ? true
      : searchParams.get("readOnly") === "false"
      ? false
      : null;
  const documentId = searchParams.get("document");
  const templateId = searchParams.get("template");
  const rootComponentId = searchParams.get("rootComponent");
  const rootTemplateId = searchParams.get("rootTemplate");
  const locale = searchParams.get("locale");
  const debug = searchParams.get("debug") === "true";

  const preview = searchParams.get("preview") === "true";

  const editorSearchParams: EditorParams = {
    readOnly,
    documentId,
    templateId,
    rootComponentId,
    rootTemplateId,
    locale,
    preview,
    debug,
  };

  return editorSearchParams;
}
