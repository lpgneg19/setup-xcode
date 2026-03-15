# Release Notes - Infrastructure & CI/CD Modernization

This update delivers a comprehensive modernization of the project environment and a significant expansion of the CI/CD test matrix for enhanced platform compatibility.

### 🚀 Core Upgrades
- **Node.js 24**: Fully upgraded the development and runtime environment from Node.js 20 to **Node.js 24**.
- **ESLint v10**: Migrated to the modern **ESLint v10 Flat Config** format (`eslint.config.js`).
- **Dependencies refreshed**: Updated major toolkits including `actions/checkout@v6`, `actions/setup-node@v6.3.0`, and `Jest v30.3.0`.

### 🛠️ CI/CD & E2E Enhancements
- **Extended OS Support**: Expanded the E2E test matrix to cover upcoming and stable macOS environments:
  - **macOS 26 (Tahoe)**: Added support for Xcode 26.x series (including Beta distributions).
  - **macOS 15**: Comprehensive validation for Xcode 16.x and 26.x.
  - **macOS 14**: Optimized support for Xcode 15/16 stable versions.
- **Manual Triggers**: Integrated `workflow_dispatch` to allow manual execution of CI pipelines directly from the GitHub UI.
- **Version Matching**: Fixed specific issues with Xcode Beta version identification for better environment reliability.

### 🔧 Maintenance
- Cleaned up legacy/unsupported macOS 12 and 13 E2E test nodes to streamline CI performance.
- Resolved dependency conflicts between `@actions/core` and building tools.
