const fs = require("fs");

const contentFolder = "/public/";
const allowedMimeTypes = {
    html: "text/html",
    css: "text/css",
    js: "application/javascript",
    png: "image/png",
    jpg: "image/jpeg",
    ico: "image/x-icon"
};

/**
 *
 * @param { http.ClientRequest } req
 * @param { http.ClientResponse } res
 */
function staticFileHandler(req, res) {
    const path = req.path;
    const extension = path.split(".").pop();

    let isInContentFolder = path.startsWith(contentFolder);
    let hasValidExtension = allowedMimeTypes.hasOwnProperty(extension);

    if (!isInContentFolder || !hasValidExtension) {
        return true;
    }

    res.writeHead(200, {
        "Content-Type": allowedMimeTypes[extension]
    });

    try {
        const read = fs.createReadStream("." + req.path);
        read.pipe(res);
    } catch (error) {
        console.log(error);
        return true;
    }
}

module.exports = staticFileHandler;
