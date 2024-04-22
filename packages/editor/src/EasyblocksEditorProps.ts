import {
  RequestedExternalData,
  Config,
  ContextParams,
  ExternalData,
  InlineTypeWidgetComponentProps,
  WidgetComponentProps,
} from "@easyblocks/core";
import React, { ComponentType } from "react";
import { EditorModeProps } from "./types";

export type ExternalDataChangeHandler = (
  externalData: RequestedExternalData,
  contextParams: ContextParams
) => void;

type CommonProps = {
  config: Config;
  externalData?: ExternalData;
  onExternalDataChange?: ExternalDataChangeHandler;
  components?: Record<string, React.ComponentType<any>>;
  widgets?: Record<
    string,
    | ComponentType<WidgetComponentProps<any>>
    | ComponentType<InlineTypeWidgetComponentProps<any>>
  >;
  __debug?: boolean;
};

export type EasyblocksEditorProps = CommonProps & EditorModeProps;
