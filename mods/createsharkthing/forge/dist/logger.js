"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogger = void 0;
const electron_log_1 = __importDefault(require("electron-log"));
function getLogger(system) {
    const log = electron_log_1.default.create(system);
    //disable console transport for render logger
    if (system == "renderer") {
        log.transports.console.level = false;
    }
    log.catchErrors({
        onError: () => false,
        showDialog: false
    });
    return log;
}
exports.getLogger = getLogger;
//# sourceMappingURL=logger.js.map