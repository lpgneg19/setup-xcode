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
exports.XcodeSelector = void 0;
const child = __importStar(require("child_process"));
const core = __importStar(require("@actions/core"));
const fs = __importStar(require("fs"));
const semver = __importStar(require("semver"));
const xcode_utils_1 = require("./xcode-utils");
class XcodeSelector {
    getAllVersions() {
        const potentialXcodeApps = (0, xcode_utils_1.getInstalledXcodeApps)().map(appPath => (0, xcode_utils_1.getXcodeVersionInfo)(appPath));
        const xcodeVersions = potentialXcodeApps.filter((app) => !!app);
        // sort versions array by descending to make sure that the newest version will be picked up
        return xcodeVersions.sort((first, second) => semver.compare(second.version, first.version));
    }
    findVersion(versionSpec) {
        var _a;
        const availableVersions = this.getAllVersions();
        if (availableVersions.length === 0) {
            return null;
        }
        if (versionSpec === "latest") {
            return availableVersions[0];
        }
        if (versionSpec === "latest-stable") {
            return availableVersions.filter(ver => ver.stable)[0];
        }
        const betaSuffix = "-beta";
        let isStable = true;
        if (versionSpec.endsWith(betaSuffix)) {
            isStable = false;
            versionSpec = versionSpec.slice(0, -betaSuffix.length);
        }
        return ((_a = availableVersions
            .filter(ver => ver.stable === isStable)
            .find(ver => semver.satisfies(ver.version, versionSpec))) !== null && _a !== void 0 ? _a : null);
    }
    setVersion(xcodeVersion) {
        if (!fs.existsSync(xcodeVersion.path)) {
            throw new Error(`Invalid version: Directory '${xcodeVersion.path}' doesn't exist`);
        }
        child.spawnSync("sudo", ["xcode-select", "-s", xcodeVersion.path]);
        // set "MD_APPLE_SDK_ROOT" environment variable to specify Xcode for Mono and Xamarin
        core.exportVariable("MD_APPLE_SDK_ROOT", xcodeVersion.path);
    }
}
exports.XcodeSelector = XcodeSelector;
