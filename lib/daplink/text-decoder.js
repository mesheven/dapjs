"use strict";
/*
* DAPjs
* Copyright Arm Limited 2020
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/
Object.defineProperty(exports, "__esModule", { value: true });
// https://github.com/anonyco/FastestSmallestTextEncoderDecoder
var PARTIAL_CHAR_TEST = /[\xc0-\xff][\x80-\xbf]*$/g;
var DOUBLE_BYTE_REPLACE = /[\xc0-\xff][\x80-\xbf]*/g;
var TextDecoder = /** @class */ (function () {
    function TextDecoder() {
    }
    /**
     * Decode an ArrayBuffer to a string, handling double-byte characters
     * @param input The ArrayBuffer to decode
     */
    TextDecoder.prototype.decode = function (input) {
        var numberArray = Array.prototype.slice.call(new Uint8Array(input));
        var data = String.fromCodePoint.apply(undefined, numberArray);
        if (this.partialChar) {
            // Previous double-byte character was cut off
            data = "" + this.partialChar + data;
            this.partialChar = undefined;
        }
        var match = data.match(PARTIAL_CHAR_TEST);
        if (match) {
            // Partial double-byte character at end of string, save it and truncate data
            var length_1 = match[0].length;
            this.partialChar = data.slice(-length_1);
            data = data.slice(0, -length_1);
        }
        return data.replace(DOUBLE_BYTE_REPLACE, this.decoderReplacer);
    };
    TextDecoder.prototype.decoderReplacer = function (encoded) {
        var codePoint = encoded.codePointAt(0) << 24;
        var leadingOnes = Math.clz32(~codePoint);
        var endPos = 0;
        var stringLen = encoded.length;
        var result = "";
        if (leadingOnes < 5 && stringLen >= leadingOnes) {
            codePoint = (codePoint << leadingOnes) >>> (24 + leadingOnes);
            for (endPos = 1; endPos < leadingOnes; endPos = endPos + 1) {
                codePoint = (codePoint << 6) | (encoded.codePointAt(endPos) & 0x3f);
            }
            if (codePoint <= 0xFFFF) { // BMP code point
                result += String.fromCodePoint(codePoint);
            }
            else if (codePoint <= 0x10FFFF) {
                // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
                codePoint = codePoint - 0x10000;
                result += String.fromCodePoint((codePoint >> 10) + 0xD800, // highSurrogate
                (codePoint & 0x3ff) + 0xDC00 // lowSurrogate
                );
            }
            else
                endPos = 0; // to fill it in with INVALIDs
        }
        for (; endPos < stringLen; endPos = endPos + 1) {
            result += "\ufffd"; // replacement character
        }
        return result;
    };
    return TextDecoder;
}());
exports.TextDecoder = TextDecoder;

//# sourceMappingURL=text-decoder.js.map
