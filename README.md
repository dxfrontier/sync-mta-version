<h2> sync-mta-version </h2>

![ts-node](https://img.shields.io/badge/ts--node-3178C6?style=for-the-badge&logo=ts-node&logoColor=white)
![json](https://img.shields.io/badge/json-5E5C5C?style=for-the-badge&logo=json&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)

The goal of `sync-mta-version` is to update the `mta.yaml` with the version of the `package.json`

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Installation](#installation)
  - [Usage](#usage)
    - [`Option 1`: using in the `scripts` package.json as command](#option-1-using-in-the-scripts-packagejson-as-command)
    - [`Option 2`: using in the `husky` github hooks](#option-2-using-in-the-husky-github-hooks)
    - [`Option 3`: using in GitHub actions](#option-3-using-in-github-actions)
- [Contributing](#contributing)
- [License](#license)
- [Authors](#authors)

## Installation

```bash
npm install --save-dev @dxfrontier/sync-mta-version
```

### Usage

#### `Option 1`: using in the `scripts` package.json as command 

1. Add the following script to your `package.json` - `scripts`: 
   
```json
"scripts": {
  "sync:mta": "sync-mta-version"
}
```

2. Run the command: 

```bash
npm run sync:mta
```

#### `Option 2`: using in the `husky` github hooks

TODO:

```bash

```

#### `Option 3`: using in GitHub actions

TODO:

```bash

```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

![Licence](https://img.shields.io/github/license/Ileriayo/markdown-badges?style=for-the-badge)

Copyright (c) 2024 DXFrontier

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Authors

- [@sblessing](https://github.com/sblessing)
- [@mathiasvkaiz](https://github.com/mathiasvkaiz)
- [@dragolea](https://github.com/dragolea)
- [@ABS GmbH](https://www.abs-gmbh.de/) team

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>
