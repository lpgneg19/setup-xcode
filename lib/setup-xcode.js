"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const xcode_selector_1 = require("./xcode-selector");
const run = () => {
    try {
        if (process.platform !== "darwin") {
            throw new Error(`This task is intended only for macOS platform. It can't be run on '${process.platform}' platform`);
        }
        const versionSpec = core.getInput("xcode-version", { required: false });
        core.info(`Switching Xcode to version '${versionSpec}'...`);
        const selector = new xcode_selector_1.XcodeSelector();
        if (core.isDebug()) {
            core.startGroup("Available Xcode versions:");
            core.debug(JSON.stringify(selector.getAllVersions(), null, 2));
            core.endGroup();
        }
        const targetVersion = selector.findVersion(versionSpec);
        if (!targetVersion) {
            console.log("Available versions:");
            console.table(selector.getAllVersions());
            throw new Error(`Could not find Xcode version that satisfied version spec: '${versionSpec}'`);
        }
        core.debug(`Xcode ${targetVersion.version} (${targetVersion.buildNumber}) (${targetVersion.path}) will be set`);
        selector.setVersion(targetVersion);
        core.info(`Xcode is set to ${targetVersion.version} (${targetVersion.buildNumber})`);
        core.setOutput("version", targetVersion.version);
        core.setOutput("path", targetVersion.path);
    }
    catch (error) {
        core.setFailed(error.message);
    }
};
run();
