import { window } from 'vscode';
import { CSS_ORDER } from './constant';

const getCssProperty = (text: string) => {
  let property = text.trim().split(' ')[0];
  if (property.endsWith(':')) {
    property = property.substr(0, property.length - 1);
  }
  return property;
};

const sort = (text: string) => {
  const lines = text.split('\r\n');
  lines.sort((a, b) => {
    a = getCssProperty(a);
    b = getCssProperty(b);
    const aIndex = CSS_ORDER.indexOf(a) || 9999;
    const bIndex = CSS_ORDER.indexOf(b) || 9999;
    return aIndex - bIndex;
  });
  return lines.join('\r\n');
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
