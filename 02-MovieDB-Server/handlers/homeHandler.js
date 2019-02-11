/**
 *
 * @param { http.ClientRequest } req
 * @param { http.ClientResponse } res
 */
module.exports = (req, res) => {
    let path = req.path;
    let method = req.method;

    if (path === "/" && method === "GET") {
        res.view("views/home.html");
    } else {
        return true;
    }
};
