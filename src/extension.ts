import * as vscode from 'vscode';

import { sortSelectedImports } from './sort-imports';
import { sortSelectedCss } from './sort-css';

export function activate(context: vscode.ExtensionContext) {
  vscode.commands.registerCommand('moka-sort-imports.sortImports', sortSelectedImports);
  vscode.commands.registerCommand('moka-sort-imports.sortCss', sortSelectedCss);
}
