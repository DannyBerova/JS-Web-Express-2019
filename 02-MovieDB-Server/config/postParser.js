const qs = require("querystring");

module.exports = (req, res) => {
    if (req.method !== "POST") {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        let body = [];
        req
            .on("data", chunk => {
                body.push(chunk);
            })
            .on("end", () => {
                body = Buffer.concat(body).toString();
                // `body` has the entire request body stored in it as a string

                req.bodyData = qs.parse(body);
                resolve();
            });
    });
};
