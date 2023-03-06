import http from "https";
import * as fs from "fs";
const file = fs.createWriteStream("core.zip");
function download() {
    return new Promise((resolve, reject) => {
        try {
            const request = http.get("https://https://download.oracle.com/java/17/archive/jdk-17.0.6_windows-x64_bin.zip", function (response) {
                response.pipe(file);
                response.on("error", resolve);
                file.on("finish", () => {
                    file.close();
                    resolve(true);
                });
            });
        }
        catch (e) {
            resolve(e);
        }
    });
}
await download();
