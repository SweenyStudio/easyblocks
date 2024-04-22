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

  const commonParams = {
    readOnly,
    locale,
    preview,
    debug,
  };

  let editorSearchParams;

  if (documentId) {
    editorSearchParams = {
      documentId,
      ...commonParams,
    };
  } else if (rootComponentId) {
    editorSearchParams = {
      rootComponentId,
      ...commonParams,
    };
  } else if (rootTemplateId) {
    editorSearchParams = {
      rootTemplateId,
      ...commonParams,
    };
  } else if (templateId) {
    editorSearchParams = {
      templateId,
      ...commonParams,
    };
  }

  return editorSearchParams as EditorParams;
}
