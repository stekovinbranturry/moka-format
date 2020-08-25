import { window } from 'vscode';
import { CSS_ORDER } from './constant';

const endLineMarker = require('os').EOL;

const getCssProperty = (text: string) => {
  let property = text.trim().split(' ')[0];
  if (property.endsWith(':')) {
    property = property.substr(0, property.length - 1);
  }
  return property;
};

const sort = (text: string) => {
  const lines = text.split(endLineMarker);
  lines.sort((a, b) => {
    a = getCssProperty(a);
    b = getCssProperty(b);
  const aIndex = CSS_ORDER.indexOf(a) < 0 ? 9999 : CSS_ORDER.indexOf(a);
  const bIndex = CSS_ORDER.indexOf(b) < 0 ? 9999 : CSS_ORDER.indexOf(b);
    return aIndex - bIndex;
  });
  return lines.join(endLineMarker);
};

export function sortSelectedCss() {
  const editor = window.activeTextEditor;
  if (!editor) {
    return;
  }
  const { document, selection } = editor;
  const text = document.getText(selection);
  const sortedText = sort(text);

  return editor.edit((edit) => edit.replace(selection, sortedText));
}
