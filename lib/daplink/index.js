"use strict";
/*
* DAPjs
* Copyright Arm Limited 2018
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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var text_decoder_1 = require("./text-decoder");
var proxy_1 = require("../proxy");
/**
 * @hidden
 */
var DEFAULT_BAUDRATE = 9600;
/**
 * @hidden
 */
var DEFAULT_SERIAL_DELAY = 100;
/**
 * @hidden
 */
var DEFAULT_PAGE_SIZE = 62;
/**
 * @hidden
 */
var decoder = new text_decoder_1.TextDecoder();
/**
 * DAPLink Class
 */
var DAPLink = /** @class */ (function (_super) {
    __extends(DAPLink, _super);
    /**
     * DAPLink constructor
     * @param transport Debug transport to use
     * @param mode Debug mode to use
     * @param clockFrequency Communication clock frequency to use (default 10000000)
     */
    function DAPLink(transport, mode, clockFrequency) {
        if (mode === void 0) { mode = 0 /* DEFAULT */; }
        if (clockFrequency === void 0) { clockFrequency = proxy_1.DEFAULT_CLOCK_FREQUENCY; }
        var _this = _super.call(this, transport, mode, clockFrequency) || this;
        /**
         * @hidden
         */
        _this.serialPolling = false;
        /**
         * @hidden
         */
        _this.serialListeners = false;
        _this.on("newListener", function (event) { return __awaiter(_this, void 0, void 0, function () {
            var listenerCount;
            return __generator(this, function (_a) {
                if (event === DAPLink.EVENT_SERIAL_DATA) {
                    listenerCount = this.listenerCount(event);
                    if (listenerCount === 0) {
                        this.serialListeners = true;
                    }
                }
                return [2 /*return*/];
            });
        }); });
        _this.on("removeListener", function (event) {
            if (event === DAPLink.EVENT_SERIAL_DATA) {
                var listenerCount = _this.listenerCount(event);
                if (listenerCount === 0) {
                    _this.serialListeners = false;
                }
            }
        });
        return _this;
    }
    /**
     * Detect if buffer contains text or binary data
     */
    DAPLink.prototype.isBufferBinary = function (buffer) {
        var numberArray = Array.prototype.slice.call(new Uint16Array(buffer, 0, 50));
        var bufferString = String.fromCharCode.apply(null, numberArray);
        for (var i = 0; i < bufferString.length; i++) {
            var charCode = bufferString.charCodeAt(i);
            // 65533 is a code for unknown character
            // 0-8 are codes for control characters
            if (charCode === 65533 || charCode <= 8) {
                return true;
            }
        }
        return false;
    };
    DAPLink.prototype.writeBuffer = function (buffer, pageSize, offset) {
        var _this = this;
        if (offset === void 0) { offset = 0; }
        var end = Math.min(buffer.byteLength, offset + pageSize);
        var page = buffer.slice(offset, end);
        var data = new Uint8Array(page.byteLength + 1);
        data.set([page.byteLength]);
        data.set(new Uint8Array(page), 1);
        return this.send(140 /* WRITE */, data)
            .then(function () {
            _this.emit(DAPLink.EVENT_PROGRESS, offset / buffer.byteLength);
            if (end < buffer.byteLength) {
                return _this.writeBuffer(buffer, pageSize, end);
            }
            return Promise.resolve();
        });
    };
    /**
     * Flash the target
     * @param buffer The image to flash
     * @param pageSize The page size to use (defaults to 62)
     * @returns Promise
     */
    DAPLink.prototype.flash = function (buffer, pageSize) {
        var _this = this;
        if (pageSize === void 0) { pageSize = DEFAULT_PAGE_SIZE; }
        function isView(source) {
            return source.buffer !== undefined;
        }
        var arrayBuffer = isView(buffer) ? buffer.buffer : buffer;
        var streamType = this.isBufferBinary(arrayBuffer) ? 0 : 1;
        return this.send(138 /* OPEN */, new Uint32Array([streamType]))
            .then(function (result) {
            // An error occurred
            if (result.getUint8(1) !== 0)
                return Promise.reject("Flash error");
            return _this.writeBuffer(arrayBuffer, pageSize);
        })
            .then(function () {
            _this.emit(DAPLink.EVENT_PROGRESS, 1.0);
            return _this.send(139 /* CLOSE */);
        })
            .then(function (result) {
            // An error occurred
            if (result.getUint8(1) !== 0)
                return Promise.reject("Flash error");
            return _this.send(137 /* RESET */);
        })
            .then(function () { return undefined; });
    };
    /**
     * Get the serial baud rate setting
     * @returns Promise of baud rate
     */
    DAPLink.prototype.getSerialBaudrate = function () {
        return this.send(129 /* READ_SETTINGS */)
            .then(function (result) {
            return result.getUint32(1, true);
        });
    };
    /**
     * Set the serial baud rate setting
     * @param baudrate The baudrate to use (defaults to 9600)
     * @returns Promise
     */
    DAPLink.prototype.setSerialBaudrate = function (baudrate) {
        if (baudrate === void 0) { baudrate = DEFAULT_BAUDRATE; }
        return this.send(130 /* WRITE_SETTINGS */, new Uint32Array([baudrate]))
            .then(function () { return undefined; });
    };
    /**
     * Write serial data
     * @param data The data to write
     * @returns Promise
     */
    DAPLink.prototype.serialWrite = function (data) {
        var arrayData = data.split("").map(function (e) { return e.charCodeAt(0); });
        arrayData.unshift(arrayData.length);
        return this.send(132 /* WRITE */, new Uint8Array(arrayData).buffer)
            .then(function () { return undefined; });
    };
    /**
     * Read serial data
     * @returns Promise of any arrayBuffer read
     */
    DAPLink.prototype.serialRead = function () {
        return this.send(131 /* READ */)
            .then(function (serialData) {
            // Check if there is any data returned from the device
            if (serialData.byteLength === 0) {
                return undefined;
            }
            // First byte contains the vendor code
            if (serialData.getUint8(0) !== 131 /* READ */) {
                return undefined;
            }
            // Second byte contains the actual length of data read from the device
            var dataLength = serialData.getUint8(1);
            if (dataLength === 0) {
                return undefined;
            }
            var offset = 2;
            return serialData.buffer.slice(offset, offset + dataLength);
        });
    };
    /**
     * Start listening for serial data
     * @param serialDelay The serial delay to use (default 100)
     * @param autoConnect whether to automatically connect to the target (default true)
     */
    DAPLink.prototype.startSerialRead = function (serialDelay, autoConnect) {
        if (serialDelay === void 0) { serialDelay = DEFAULT_SERIAL_DELAY; }
        if (autoConnect === void 0) { autoConnect = true; }
        return __awaiter(this, void 0, void 0, function () {
            var connectedState, serialData, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.serialPolling = true;
                        _a.label = 1;
                    case 1:
                        if (!this.serialPolling) return [3 /*break*/, 9];
                        if (!this.serialListeners) return [3 /*break*/, 7];
                        connectedState = this.connected;
                        if (!(this.connected === false && autoConnect === true)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.connect()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.serialRead()];
                    case 4:
                        serialData = _a.sent();
                        if (!(connectedState === false && autoConnect === true)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.disconnect()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        if (serialData !== undefined) {
                            data = decoder.decode(serialData);
                            this.emit(DAPLink.EVENT_SERIAL_DATA, data);
                        }
                        _a.label = 7;
                    case 7: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(function () { return resolve(); }, serialDelay); })];
                    case 8:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Stop listening for serial data
     */
    DAPLink.prototype.stopSerialRead = function () {
        this.serialPolling = false;
    };
    /**
     * Progress event
     * @event
     */
    DAPLink.EVENT_PROGRESS = "progress";
    /**
     * Serial read event
     * @event
     */
    DAPLink.EVENT_SERIAL_DATA = "serial";
    return DAPLink;
}(proxy_1.CmsisDAP));
exports.DAPLink = DAPLink;
__export(require("./enums"));

//# sourceMappingURL=index.js.map
