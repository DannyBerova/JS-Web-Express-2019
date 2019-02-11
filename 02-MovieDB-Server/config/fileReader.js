const fs = require("fs");
const path = require("path");

const placeholderTemplate = require("./templates").placeholderTemplate;
const cannotReadFileMsg = require("./templates").cannotReadFileMsg;

function readFile(response, pathName, htmlContent, contentType) {
    if (!pathName) {
        throw new ReferenceError("Pathname missing!");
    }

    pathName = path.join(__dirname, `../${pathName}`); // absolute path

    if (!contentType) {
        contentType = "text/html";
    }

    fs.readFile(pathName, (err, data) => {
        if (err) {
            console.log(err);
            generateStatus500();
            return;
        }

        if (htmlContent) {
            data = data.toString().replace(placeholderTemplate, htmlContent);
        }

        generateStatus200(data, htmlContent);
    });

    function generateStatus500() {
        response.writeHead(500, {
            "Content-Type": "text/plain"
        });
        response.end(cannotReadFileMsg(pathName));
    }

    function generateStatus200(data) {
        response.writeHead(200, {
            "Content-Type": contentType
        });
        response.write(data);
        response.end();
    }
}

module.exports = response => {
    response.view = (path, htmlContent) => {
        readFile(response, path, htmlContent, undefined);
    };

    response.staticFile = (path, contentType) => {
        readFile(response, path, undefined, contentType);
    };
};
