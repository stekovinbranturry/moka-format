import * as vscode from 'vscode';

import onSave from './on-save';
import { sortSelectedCss } from './sort-css';
import { sortSelectedImports } from './sort-imports';
import { workspace } from 'vscode';

export function activate() {
  vscode.commands.registerCommand('moka-format.sortImports', sortSelectedImports);
  vscode.commands.registerCommand('moka-format.sortCss', sortSelectedCss);

  onSave.update();
  workspace.onDidChangeWorkspaceFolders(() => onSave.update());
  workspace.onDidChangeConfiguration(() => onSave.update());
}
