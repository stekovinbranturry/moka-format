import * as vscode from 'vscode';

import { sortCurrentDocument } from './sort';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('moka-sort-imports.sortImports', () => {
    sortCurrentDocument();
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
