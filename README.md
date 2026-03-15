# setup-xcode
This action is intended to switch between pre-installed versions of Xcode for macOS images in GitHub Actions. Now fully powered by **Node.js 24**.

The list of all available versions can be found in the [runner-images](https://github.com/actions/runner-images/tree/main/images/macos) repository (e.g., [macOS 15 Readme](https://github.com/actions/runner-images/blob/main/images/macos/macos-15-Readme.md#xcode)).

# Available parameters
| Argument                | Description              | Format    |
|-------------------------|--------------------------|--------------------|
| `xcode-version`           | Specify the Xcode version to use | - `latest` or<br> - `latest-stable` or<br> - [SemVer](https://semver.org/) string or<br> - `<semver>-beta` |

**Notes:**
- `latest-stable` points to the latest stable version of Xcode.
- `latest` *includes* beta releases that GitHub Actions has installed.
- SemVer examples: `15`, `16.1`, `16.4`, `^16.0.0`.
- **Beta Versions**: Use the `-beta` suffix (e.g., `'26.4-beta'`) to select specific beta releases.
- If setting a specific version, wrap it in single quotes in YAML like `'16.0'` to ensure it's passed as a string string (preventing trailing `.0` trimming).

# Usage

Set the latest stable Xcode version on the latest macOS runner:
```yaml
jobs:
  build:
    runs-on: macos-latest
    steps:
    - uses: actions/checkout@v6
    - uses: lpgneg19/setup-xcode@v1 # Replace with your version/branch
      with:
        xcode-version: latest-stable
```

Set the specific Xcode version on macOS 15:
```yaml
jobs:
  build:
    runs-on: macos-15
    steps:
    - uses: actions/checkout@v6
    - uses: lpgneg19/setup-xcode@v1
      with:
        xcode-version: '16.1'
```

Set a beta version of Xcode on macOS 26:
```yaml
jobs:
  build:
    runs-on: macos-26
    steps:
    - uses: actions/checkout@v6
    - uses: lpgneg19/setup-xcode@v1
      with:
        xcode-version: '26.4-beta'
```

# License
The scripts and documentation in this project are released under the [MIT License](LICENSE)
