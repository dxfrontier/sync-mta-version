<h2> sync-mta-version </h2>

![ts-node](https://img.shields.io/badge/ts--node-3178C6?style=for-the-badge&logo=ts-node&logoColor=white)
![json](https://img.shields.io/badge/json-5E5C5C?style=for-the-badge&logo=json&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)

`sync-mta-version` is a utility designed to keep the `mta.yaml` file in sync with the version defined in `package.json`. 

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Installation](#installation)
  - [Usage](#usage)
    - [`Option 1`: using as `command` in the package.json](#option-1-using-as-command-in-the-packagejson)
    - [`Option 2`: using as `github` `workflow`](#option-2-using-as-github-workflow)
- [Contributing](#contributing)
- [License](#license)
- [Authors](#authors)

## Installation

To install sync-mta-version as a development dependency, run:

```bash
npm install --save-dev @dxfrontier/sync-mta-version
```

### Usage

| Option                              | Description                                                                                 | Default                 |
|-------------------------------------|---------------------------------------------------------------------------------------------|-------------------------|
| `-f`, `--file <mta>`                | Add the MTA file to be processed.                                                           | `"mta.yaml"`            |
| `-e`, `--extension [extensions...]` | Add the MTA extension (mtaext) files to be processed (multiple files allowed, separated by space) |                         |
| `-h`, `--help`                      | Display help for the command                                                                |                         |

**Example:**

```bash
$ sync-mta-version
$ sync-mta-version -f mta.yaml
$ sync-mta-version -f mta.yaml -e dev.mtaext qa.mtaext production.mtaext
```

#### `Option 1`: using as `command` in the package.json 

1. Add the following script to the `scripts` section of your `package.json`: 
   
```json
"scripts": {
  "sync:mta": "sync-mta-version"
}
```

> [!IMPORTANT]
> The command looks for an `mta.yaml` file in the project root and updates its version to match that of package.json.

2. To synchronize the `mta.yaml` version with `package.json`, run:

```bash
npm run sync:mta
```

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>


#### `Option 2`: using as `github` `workflow` 


The example below outlines a workflow that triggers on merging a pull request into `main`

```yaml

# This is a workflow which copies the package.json version into the mta.yaml after the `Pull request` was merged
name: Synchronize mta

on:
  pull_request:
    branches:
      - main
    types:
      - closed

permissions:
  contents: write
  pull-requests: write

jobs:

  # This job will check if the `Pull Request` was `merged` into `main` branch
  check_valid_merge:
    name: Merge 'Pull request' into 'main' branch
    if: github.event.pull_request.merged == true
    runs-on: ubuntu-latest
    steps:
      - run: |
          echo The PR was merged.

  # This job will syncronize the mta.yaml by running the 'npm run sync:mta' which is a command from 'package.json'
  synchronize_mta_version:
    name: Synchronize mta.yaml with the package.json version 
    needs: check_valid_merge
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Synchronize mta.yaml version with the package.json version
        run: npm install
        run: npm run sync:mta  

      # create a pull request containing the mta.yaml version updated
      - name: Create pull request
        uses: peter-evans/create-pull-request@v6
        with:
          base: main
          token: ${{ secrets.GITHUB_TOKEN }}
          title: mta.yaml version updated
          body: mta.yaml version updated with the latest version from package.json
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
> [!TIP]
> Steps explained : 
>   1. When the `Pull request` was `closed` and `merged`.
>   2. The workflow will run `npm run sync:mta` command defined in the `package.json`.
>   3. A new PR will be created which will contain a change in the `mta.yaml` having the new version updated based on the `package.json`.

<p align="right">(<a href="#table-of-contents">back to top</a>)</p>

<!-- 
#### `Option 2`: using `sync-mta-version` in the `husky` + `lint-staged` github hooks

1. Install [Husky](https://typicode.github.io/husky/get-started.html)

```bash
npm install --save-dev husky
```

2. Run the following husky command:

```bash
npx husky init
```

> [!TIP]
> The `init` command simplifies setting up husky in a project. It creates a `pre-commit` script in `.husky/` and updates the `prepare` script in `package.json`. Modifications can be made later to suit your workflow.

3. Install [lint-staged](https://github.com/lint-staged/lint-staged)

```bash
npm install --save-dev lint-staged 
```

4. Add a `script` command `package.json` - `scripts`:

```json
"scripts": {
  "sync:mta:version":"sync-mta-version"
}
```

5. Add a configuration `lint-staged` in your `package.json`:

```json
{
  "name": "sync-mta-version",
  "scripts": {
    // Added this line in step 4
    "sync:mta:version":"sync-mta-version"
  },
  "devDependencies": {
    // ...
    "husky": "^9.1.5",
    "lint-staged": "^15.2.9",
  },
  // Add below line to your package.json
  "lint-staged": {
    "**/*.ts": [
      "npm run sync:mta:version"
    ]
  }
}
```

6. Add in the `.husky` `pre-commit` hook the following command:

```bash
npx lint-staged
```

7. Try do a commit :

```bash
git commit -m "Keep calm and commit"
```

Now the `sync:mta:version` command will copy the `package.json` `version` in your `mta.yaml` to keep them both in sync.

<p align="right">(<a href="#table-of-contents">back to top</a>)</p> -->

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
