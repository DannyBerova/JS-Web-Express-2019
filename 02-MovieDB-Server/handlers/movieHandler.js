const movieTemplate = require("../config/templates").movieTemplate;
const detailsTemplates = require("../config/templates").detailsTemplate;
const errorTemplate = require("../config/templates").errorTemplate;
const successTemplate = require("../config/templates").successTemplate;

const listAllView = "views/viewAll.html";
const addView = "views/addMovie.html";
const detailsView = "views/details.html";

let moviesDb = require("../config/dataBase");

transformMoviesDb();

function transformMoviesDb() {
    //let index = 0;
    for (let movie of moviesDb) {
        movie.id = parseInt(movie.id);
        movie.movieYear = parseInt(movie.movieYear);
        movie.moviePoster = decodeURIComponent(movie.moviePoster);
        movie.movieTitle = decode(movie.movieTitle);
        movie.movieDescription = decode(movie.movieDescription);
    }
}

// GET /viewAllMovies
function renderAllView(res) {
    let moviesHtml = moviesDb
        .sort((a, b) => a.movieYear - b.movieYear) // ASC
        .map(m => movieTemplate(m))
        .join("");

    res.view(listAllView, moviesHtml);
}

// GET /addMovie
function renderAddView(res) {
    res.view(addView, undefined);
}

// POST /addMovie
function addMovie(req, res) {
    let movieData = req.bodyData;

    if (
        IsNullOrEmpty(movieData.movieTitle) ||
        IsNullOrEmpty(movieData.moviePoster)
    ) {
        res.view(addView, errorTemplate);
    } else {
        movieData.id = moviesDb.length;
        moviesDb.push(movieData);
        res.view(addView, successTemplate);
    }
}

// GET /movies/details/{id}
function renderDetailsView(path, res) {
    let id = path.split("/").pop();
    let movie = getById(id);

    if (!movie) {
        renderAllView(res);
    }

    let detailsHtml = detailsTemplates(movie);
    res.view(detailsView, detailsHtml);
}

function getById(id) {
    for (const movie of moviesDb) {
        if (movie.id == id) {
            return movie;
        }
    }
}

function decode(str) {
    return decodeURIComponent(str).replace(/\+/g, " ");
}

function IsNullOrEmpty(value) {
    return !value || value.trim() === "";
}

module.exports = (req, res) => {
    let path = req.path;
    let method = req.method;

    switch (method) {
        case "GET":
            if (path === "/viewAllMovies") {
                renderAllView(res);
            } else if (path === "/addMovie") {
                renderAddView(res);
            } else if (path.startsWith("/movies/details/")) {
                renderDetailsView(path, res);
            }
            break;
        case "POST":
            if (path === "/addMovie") {
                addMovie(req, res);
            }
            break;
        default:
            break;
    }
};
