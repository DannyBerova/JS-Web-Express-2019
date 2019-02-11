module.exports = {
    movieTemplate: movie => `
        <div class="movie">
            <a href="/movies/details/${movie.id}">
                <img class="moviePoster" src="${movie.moviePoster}"/>
            </a>
        </div>`,
    detailsTemplate: movie => `
        <div class="content">
            <img src="${movie.moviePoster}" alt="movie"/>
            <h3>Title ${movie.movieTitle}</h3>
            <h3>Year ${movie.movieYear}</h3 >
            <p>${movie.movieDescription}</p>
        </div>`,
    placeholderTemplate: `<div id="replaceMe">{{replaceMe}}</div>`,
    errorTemplate: `<div id="errBox"><h2 id="errMsg">Please fill all fields</h2></div>`,
    successTemplate: `<div id="succssesBox"><h2 id="succssesMsg">Movie Added</h2></div>`,
    cannotReadFileMsg: fileName => `Cannot read file ${fileName}`
};
