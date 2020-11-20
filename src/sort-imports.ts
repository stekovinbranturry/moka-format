import { Range, TextDocument, window } from 'vscode';

import { getMaxRange } from './util';

const endLineMarker = require('os').EOL;

const REGS = {
  GET_PATH: /\'(.+)\'/,
  ABS_PATH: new RegExp(
    "('apply/)|('apply-mobile/)|('apply-web/)|('chrome-extension/)|('common/)|('dajie-api/)|('deliver_query/)|('foreground/)|('headhunter/)|('hr_mobile/)|('interview_signin/)|('lagou-sms/)|('lingui/)|('main-app/)|('oneclick/)|('reset_password/)|('server/)|('shixiseng-api/)|('sign_in/)|('source_signin/)"
  ),
  PACKAGE: /from \'([a-z]|@)(.+)\';/,
  COMPONENT: /\/[A-Z](.+)\';/
};

const getPath = (line: string) => (line.match(REGS.GET_PATH) || [])[1];

const sortByReference = (arr: string[], reference: string[]) => {
  arr.sort((a, b) => {
    const aPath = getPath(a);
    const bPath = getPath(b);
    return reference.indexOf(aPath) - reference.indexOf(bPath);
  });
  return arr;
};

const arryToStr = (arr: string[]) => (arr.length ? arr.join(endLineMarker) + endLineMarker + endLineMarker : '');

const removeEmptyLines = (str: string) =>
  str
    .split(endLineMarker)
    .filter((line) => line)
    .join(endLineMarker);

const isStyle = (str: string) => {
  str = str.toLowerCase();
  return str.endsWith(".styl';") || str.endsWith("css';");
};

const isPackage = (str: string) => REGS.PACKAGE.test(str) && !REGS.ABS_PATH.test(str);

const isComponent = (str: string) => REGS.COMPONENT.test(str);

const sortPackages = (arr: string[]) => {
  const HEADER = [
    'react',
    'react-dom',
    'redux',
    'react-redux',
    'prop-types',
    'react-router',
    'react-router-dom',
    'mage-react-router',
  ];
  const FOOTER = ['moka-ui', 'sugar-design', '@SDFoundation', '@cms'];

  let first: string[] = [];
  let second: string[] = [];
  let third: string[] = [];

  arr.forEach((el) => {
    const pack = getPath(el);
    if (HEADER.includes(pack)) {
      first.push(el);
    } else if (FOOTER.includes(pack)) {
      third.push(el);
    } else {
      second.push(el);
    }
  });

  const secondPathList = second.map((el) => getPath(el)).sort();
  first = sortByReference(first, HEADER);
  second = sortByReference(second, secondPathList);
  third = sortByReference(third, FOOTER);

  return [...first, ...second, ...third];
};

const sortOthers = (arr: string[]) => {
  const pathList = arr.map((el) => getPath(el)).sort();
  return sortByReference(arr, pathList);
};

export const sort = (document: TextDocument): string => {
  const fullText = document.getText();

  const fullTextArr = fullText.split(endLineMarker);

  let lastImportLine: number = 0;
  
  for (let i = 0; i < fullTextArr.length; i++) {
    const ele = fullTextArr[i];
    if (/^\}\sfrom\s'(.+)';/.test(ele) || /^import\s(.+)\sfrom\s'(.+)';/.test(ele) || /^import\s'(.+)';/.test(ele)) {
      lastImportLine = i;
    }
  }
  
  if (lastImportLine === 0) {
    return '';
  }

  const allImports = fullTextArr.splice(0, lastImportLine + 1).join(endLineMarker);

  /**
   * 引入的依赖，如react, redux
   */
  let packages: string[] = [];
  /**
   * 组件
   */
  let components: string[] = [];
  /**
   * utils, constants...
   */
  let utils: string[] = [];
  /**
   * 引入的样式
   */
  let styles: string[] = [];

  const lines = removeEmptyLines(allImports)
    .split(`;${endLineMarker}`)
    .map((line) => (line.endsWith(';') ? line : line + ';'));

  lines.forEach((line) => {
    if (isStyle(line)) {
      styles.push(line);
    } else if (isPackage(line)) {
      packages.push(line);
    } else if (isComponent(line)) {
      components.push(line);
    } else {
      utils.push(line);
    }
  });

  const sortedImports =
    arryToStr(sortPackages(packages)) +
    arryToStr(sortOthers(components)) +
    arryToStr(sortOthers(utils)) +
    arryToStr(styles);
  
  const newFullText = fullText.replace(allImports, sortedImports.trim());
  
  return newFullText;
};

export function sortSelectedImports() {
  const editor = window.activeTextEditor;
  if (!editor) {
    return;
  }
  const { document } = editor;
  
  const newFullText = sort(document);
  
  if (!newFullText) {
    return;
  }

  return editor.edit((edit) => edit.replace(getMaxRange(), newFullText));
}
