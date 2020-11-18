import {
  Disposable,
  TextDocument,
  TextDocumentWillSaveEvent,
  TextEdit,
  TextEditorEdit,
  window,
  workspace,
} from 'vscode';

import { sort } from './sort-imports';
import { getConfiguration, getMaxRange } from './util';

let subscription: Disposable | null;     

export default {
  get isEnabled() {
    return getConfiguration('on-save');
  },

  register() {
    if (subscription) {
      return;
    }

    subscription = workspace.onWillSaveTextDocument(listener);
  },

  unregister() {
    if (!subscription) {
      return;
    }

    subscription.dispose();
    subscription = null;
  },

  update() {
    if (this.isEnabled) {
      this.register();
    } else {
      this.unregister();
    }
  },

  bypass(action: any) {
    this.unregister();
    const result = action();
    return result.then((res: any) => {
      this.update();
      return res;
    });
  },
};

function listener({ document, waitUntil }: TextDocumentWillSaveEvent) {
  const sortedText = sort(document);
  if (!sortedText) {
    return;
  }

  waitUntil(changeContentOfDocument(document, sortedText));
}

function changeContentOfDocument(document: TextDocument, sortedText: string) {
  const editor = window.activeTextEditor;
    if (!editor) {
    return Promise.resolve();
  }
  const savingActiveDocument = document === editor.document;

  const maxRange = getMaxRange();

  if (savingActiveDocument) {
    return editor.edit((edit: TextEditorEdit) => {
      edit.replace(maxRange, sortedText);
    });
  }

  return Promise.resolve([new TextEdit(maxRange, sortedText)]);
}

