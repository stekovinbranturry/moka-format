[![](https://vsmarketplacebadge.apphb.com/version-short/ZhangKai.moka-format.svg)](https://marketplace.visualstudio.com/items?itemName=ZhangKai.moka-format)
[![](https://vsmarketplacebadge.apphb.com/downloads-short/ZhangKai.moka-format.svg)](https://marketplace.visualstudio.com/items?itemName=ZhangKai.moka-format)
[![](https://vsmarketplacebadge.apphb.com/rating-short/ZhangKai.moka-format.svg)](https://marketplace.visualstudio.com/items?itemName=ZhangKai.moka-format)

# Moka format

VS Code auto format extension used by Moka

## Usage

### 1. Manually sort imports

Command - "Moka sort imports"

![](https://github.com/stekovinbranturry/moka-format/blob/master/static/manual-sort-imports.gif)

Not only do the sorting, the extension will also help to merge same imports.

For example:

```js
import a, { b, c } from 'A';
import { d, c, e } from 'A';
import { f, g } from 'A';

=>

import a, { b, c, d ,e, f, g } from 'A';
```

![](https://github.com/stekovinbranturry/moka-format/blob/master/static/merge-imports.gif)

### 2. Sort imports on save

Setup as below:

![](https://github.com/stekovinbranturry/moka-format/blob/master/static/format-on-save.png)

then imports will be formatted automatically:

![](https://github.com/stekovinbranturry/moka-format/blob/master/static/auto-sort-imports.gif)


### 3. Manually sort css

Command - "Moka sort css"

![](https://github.com/stekovinbranturry/moka-format/blob/master/static/manual-sort-css.gif)

Sorry, there is no sort css on save option

## Rules
