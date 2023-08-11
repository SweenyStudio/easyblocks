import {
  CompiledCustomComponentConfig,
  CompiledShopstoryComponentConfig,
} from "@easyblocks/core";
import { InternalEditingInfo } from "@easyblocks/app-utils";

type CompilationCacheItemValue = {
  /**
   * Values compared during compilation to determine if component has changed
   */
  values: Record<string, any>;
  valuesAfterAuto: Record<string, any>;
  compiledValues: Record<string, any>;
  compiledConfig:
    | CompiledShopstoryComponentConfig
    | CompiledCustomComponentConfig;
  contextProps: { [componentName in string]: Record<string, any> };
  // TODO: editor only????
  editingContextProps?: InternalEditingInfo["components"];
};

class CompilationCache {
  private cache: Map<string, CompilationCacheItemValue>;

  constructor();
  constructor(initialEntries: Array<[string, CompilationCacheItemValue]>);
  constructor(initialEntries?: Array<[string, CompilationCacheItemValue]>) {
    this.cache = initialEntries ? new Map(initialEntries) : new Map();
  }

  get(key: string): CompilationCacheItemValue | undefined {
    return this.cache.get(key);
  }

  set(key: string, entry: CompilationCacheItemValue): void {
    this.cache.set(key, entry);
  }

  get count(): number {
    return this.cache.size;
  }

  remove(path: string) {
    this.cache.delete(path);
  }

  clear() {
    this.cache.clear();
  }
}

export { CompilationCache };
export type { CompilationCacheItemValue };
