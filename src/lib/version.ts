
// sdkName is the name of this SDK
const sdkName = "wekey-sdk-js";

// sdkVersion is the version of this SDK
const sdkVersion = "0.1.0";

export function buildUserAgent(): string {
    return `${sdkName}-${sdkVersion}`
}
