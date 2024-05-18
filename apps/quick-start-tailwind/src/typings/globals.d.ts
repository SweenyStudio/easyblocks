import { EditorWindowAPI } from "@easyblocks/editor";

declare global {
  interface Window {
    editorWindowAPI: EditorWindowAPI;
    isShopstoryEditor?: boolean;
  }
}
