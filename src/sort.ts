import { window } from 'vscode';

const arryToStr = (arr: string[]) => (arr.length ? arr.join('\n') + '\n\n' : '');

const isOthers = (str: string) => /from \'\./g.test(str);

const sortPackages = (arr: string[]) => {};

const sort = (text: string) => {
  const lines = text.split('\n').filter((line) => line);
  /**
   * 引入的样式
   */
  let styles: string[] = [];
  /**
   * 引入的依赖，如react, redux
   */
  let packages: string[] = [];
  /**
   * 其他
   */
  let others: string[] = [];

  lines.forEach((line) => {
    if (line.endsWith(".styl';")) {
      styles.push(line);
    } else if (isOthers(line)) {
      others.push(line);
    } else {
      packages.push(line);
    }
  });

  return arryToStr(packages) + arryToStr(others) + arryToStr(styles);
};

export function sortCurrentDocument() {
  const editor = window.activeTextEditor;
  if (!editor) {
    return;
  }
  const { document, selection } = editor;
  const word = document.getText(selection);
  const sortedText = sort(word);

  return editor.edit((edit) => edit.replace(selection, sortedText));
}
