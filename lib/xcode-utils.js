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
exports.getXcodeVersionInfo = exports.getXcodeReleaseType = exports.getInstalledXcodeApps = exports.parsePlistFile = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const core = __importStar(require("@actions/core"));
const plist = __importStar(require("plist"));
const semver = __importStar(require("semver"));
const parsePlistFile = (plistPath) => {
    if (!fs.existsSync(plistPath)) {
        core.debug(`Unable to open plist file. File doesn't exist on path '${plistPath}'`);
        return null;
    }
    const plistRawContent = fs.readFileSync(plistPath, "utf8");
    return plist.parse(plistRawContent);
};
exports.parsePlistFile = parsePlistFile;
const getInstalledXcodeApps = () => {
    const applicationsDirectory = "/Applications";
    const xcodeAppFilenameRegex = /^Xcode.*\.app$/;
    const allApplicationsChildItems = fs.readdirSync(applicationsDirectory, {
        encoding: "utf8",
        withFileTypes: true,
    });
    const allApplicationsRealItems = allApplicationsChildItems.filter(child => !child.isSymbolicLink() && child.isDirectory());
    const xcodeAppsItems = allApplicationsRealItems.filter(app => xcodeAppFilenameRegex.test(app.name));
    return xcodeAppsItems.map(child => path.join(applicationsDirectory, child.name));
};
exports.getInstalledXcodeApps = getInstalledXcodeApps;
const getXcodeReleaseType = (xcodeRootPath) => {
    var _a, _b;
    const licenseInfo = (0, exports.parsePlistFile)(path.join(xcodeRootPath, "Contents", "Resources", "LicenseInfo.plist"));
    const licenseType = (_b = (_a = licenseInfo === null || licenseInfo === void 0 ? void 0 : licenseInfo.licenseType) === null || _a === void 0 ? void 0 : _a.toString()) === null || _b === void 0 ? void 0 : _b.toLowerCase();
    if (!licenseType) {
        core.debug("Unable to determine Xcode version type based on license plist");
        core.debug("Xcode License plist doesn't contain 'licenseType' property");
        return "Unknown";
    }
    return licenseType.includes("beta") ? "Beta" : "GM";
};
exports.getXcodeReleaseType = getXcodeReleaseType;
const getXcodeVersionInfo = (xcodeRootPath) => {
    var _a, _b;
    const versionInfo = (0, exports.parsePlistFile)(path.join(xcodeRootPath, "Contents", "version.plist"));
    const xcodeVersion = semver.coerce((_a = versionInfo === null || versionInfo === void 0 ? void 0 : versionInfo.CFBundleShortVersionString) === null || _a === void 0 ? void 0 : _a.toString());
    const xcodeBuildNumber = (_b = versionInfo === null || versionInfo === void 0 ? void 0 : versionInfo.ProductBuildVersion) === null || _b === void 0 ? void 0 : _b.toString();
    if (!xcodeVersion || !semver.valid(xcodeVersion)) {
        core.debug(`Unable to retrieve Xcode version info on path '${xcodeRootPath}'`);
        return null;
    }
    const releaseType = (0, exports.getXcodeReleaseType)(xcodeRootPath);
    return {
        version: xcodeVersion.version,
        buildNumber: xcodeBuildNumber,
        releaseType: releaseType,
        stable: releaseType === "GM",
        path: xcodeRootPath,
    };
};
exports.getXcodeVersionInfo = getXcodeVersionInfo;
