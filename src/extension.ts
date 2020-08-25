import * as vscode from 'vscode';

import { sortSelectedCss } from './sort-css';
import { sortSelectedImports } from './sort-imports';

export function activate() {
  vscode.commands.registerCommand('moka-format.sortImports', sortSelectedImports);
  vscode.commands.registerCommand('moka-format.sortCss', sortSelectedCss);
}
