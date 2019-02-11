/**
 *
 * @param { http.ClientRequest } req
 * @param { http.ClientResponse } res
 */
module.exports = (req, res) => {
    res.writeHead(404, {
        "content-type": "text/plain"
    });
    res.end("Bad request");
};
