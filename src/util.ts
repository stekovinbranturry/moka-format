import { Range, workspace } from 'vscode';

export const EXTENSION_NAME = 'moka-format';

export function getConfiguration(key: string) {
  return workspace.getConfiguration(EXTENSION_NAME)[key];
}

export function getMaxRange(): Range {
  return new Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE);
}
