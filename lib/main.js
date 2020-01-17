"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const installer = __importStar(require("./installer"));
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
function run(silent) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (os.platform() == 'darwin') {
                core.setFailed('Not supported on darwin platform');
                return;
            }
            const version = core.getInput('version') || 'latest';
            const file = core.getInput('file', { required: true });
            const args = core.getInput('args');
            const upx = yield installer.getUPX(version);
            if (!fs.existsSync(file)) {
                core.setFailed(`⛔ File to compress not found: ${file}`);
            }
            console.log('🏃 Running UPX...');
            yield exec.exec(`${upx} ${args} ${file}`, undefined, {
                silent: silent
            });
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
exports.run = run;
run();
