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
const decompress = require("decompress");
const decompresstarxz = require("decompress-tarxz");
const download = __importStar(require("download"));
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const util = __importStar(require("util"));
const restm = __importStar(require("typed-rest-client/RestClient"));
let osPlat = os.platform();
let osArch = os.arch();
function getUPX(version) {
    return __awaiter(this, void 0, void 0, function* () {
        const selected = yield determineVersion(version);
        if (selected) {
            version = selected;
        }
        console.log(`✅ UPX version found: ${version}`);
        const tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'upx-'));
        const fileName = getFileName(version);
        const downloadUrl = util.format('https://github.com/upx/upx/releases/download/v%s/%s', version, fileName);
        console.log(`⬇️ Downloading ${downloadUrl}...`);
        yield download.default(downloadUrl, tmpdir, { filename: fileName });
        console.log('📦 Extracting UPX...');
        if (osPlat == 'win32') {
            yield decompress(`${tmpdir}/${fileName}`, tmpdir, { strip: 1 });
        }
        else {
            yield decompresstarxz(`${tmpdir}/${fileName}`, tmpdir, { strip: 1 });
        }
        return path.join(tmpdir, osPlat == 'win32' ? 'upx.exe' : 'upx');
    });
}
exports.getUPX = getUPX;
function getFileName(version) {
    let platform = '';
    if (osPlat == 'win32') {
        platform = osArch == 'x64' ? 'win64' : 'win32';
    }
    else if (osPlat == 'linux') {
        platform = osArch == 'x64' ? 'amd64_linux' : 'i386_linux';
    }
    const ext = osPlat == 'win32' ? 'zip' : 'tar.xz';
    return util.format('upx-%s-%s.%s', version, platform, ext);
}
function determineVersion(version) {
    return __awaiter(this, void 0, void 0, function* () {
        let rest = new restm.RestClient('ghaction-upx', 'https://github.com', undefined, {
            headers: {
                Accept: 'application/json'
            }
        });
        if (version !== 'latest') {
            version = `v${version}`;
        }
        let res = yield rest.get(`/upx/upx/releases/${version}`);
        if (res.statusCode != 200 || res.result === null) {
            throw new Error(`Cannot find UPX ${version} release (http ${res.statusCode})`);
        }
        return res.result.tag_name.replace(/^v/, '');
    });
}
