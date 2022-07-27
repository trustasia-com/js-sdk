// Copy from https://github.com/aws/aws-sdk-js/blob/307e82673b/lib/util.js
//

export function iso8601() {
  const date = new Date();
  return date.toISOString().replace(/\.\d{3}Z$/, "Z");
}

export function uriEscape(str: string) {
  var output = encodeURIComponent(str);
  output = output.replace(/[^A-Za-z0-9_.~\-%]+/g, escape);

  // AWS percent-encodes some extra non-standard characters in a URI
  output = output.replace(/[*]/g, function (ch) {
    return "%" + ch.charCodeAt(0).toString(16).toUpperCase();
  });

  return output;
}

export function uriEscapePath(str: string) {
  var parts: string[] = [];
  arrayEach(str.split("/"), function (part: string) {
    parts.push(uriEscape(part));
  });
  return parts.join("/");
}

export function each(obj: any, iterFunction: Function) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var ret = iterFunction.call(key, obj[key]);
      if (ret === {}) break;
    }
  }
}

export function arrayEach(arr: Array<any>, iterFunction: Function) {
  for (var idx in arr) {
    if (Object.prototype.hasOwnProperty.call(arr, idx)) {
      var ret = iterFunction.call(this, arr[idx], parseInt(idx, 10));
      if (ret === {}) break;
    }
  }
}
