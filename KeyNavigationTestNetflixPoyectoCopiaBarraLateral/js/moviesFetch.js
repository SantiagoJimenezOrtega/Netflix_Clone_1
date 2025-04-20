const tmdbApiEndpoint = "https://api.themoviedb.org/3";
const tmdbAuthorizationToken =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYmFhMjczMzYwYTk2NzhlNTk1NzQ4MGY2YWRkYTNiNyIsIm5iZiI6MTcxOTc5MDEzNC41NTA3MzYsInN1YiI6IjY2NmI0NzVhODgzNmIxNDM4N2NkMjMxYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.H3MzymLd5I99vNksikrAowiR9SKWSfgxByfVdnXX8Mo";

async function fetchTmdbData(endpoint, options = {}) {
  try {
    const response = await fetch(`${tmdbApiEndpoint}/${endpoint}`, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${tmdbAuthorizationToken}`,
      },
      ...options,
    });
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }
    return response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}
/**/
let rowMovieArrays = [];
let cont = 0;
const selectedMovies = {};
/**/

function renderMovieList(endpoint, containerId, rowNumber) {
  fetchTmdbData(endpoint)
    .then((response) => {
      const rowContentElement = document.querySelector(
        `#${containerId} .row-content`
      );
      const movies = response.results;

      const movieListElement = document.createElement("div");
      movieListElement.className = "movieListElement";

      const moviePosition = {}; // <--- Add this object to store movie positions
      const movieArray = []; // <--- Add this array to store movie objects

      movies.forEach((movie, index) => {
        const thumbnailElement = document.createElement("div");
        thumbnailElement.className = "thumbnail";

        const posterElement = document.createElement("img");
        posterElement.src = `https://image.tmdb.org/t/p/w500${
          movie.backdrop_path || movie.poster_path
        }`;
        posterElement.alt = movie.title || movie.original_name;

        const titleElement = document.createElement("h2");
        titleElement.className =
          "w-56 cursor-pointer text-sm font-semibold text-[#e5e5e5] transition duration-200 hover:text-red-500 md:text-2xl";
        titleElement.textContent = movie.title || movie.original_name;

        // Add movie description to the movie object
        const descriptionElement = document.createElement("p");
        descriptionElement.textContent = movie.overview;
        descriptionElement.style.display = "none";

        thumbnailElement.appendChild(posterElement);
        thumbnailElement.appendChild(titleElement);
        thumbnailElement.appendChild(descriptionElement);

        // Add tabindex here
        thumbnailElement.tabIndex = 0;

        // Add event listeners for keyboard navigation here
        // Add event listeners for keyboard navigation here
        thumbnailElement.addEventListener("keydown", (event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            // Navigate to previous/next movie thumbnail
            const currentIndex = Array.prototype.indexOf.call(
              movieListElement.children,
              thumbnailElement
            );
            const newIndex =
              currentIndex + (event.key === "ArrowRight" ? 1 : -1);
            const newThumbnail = movieListElement.children[newIndex];
            if (newThumbnail) {
              newThumbnail.focus();
            } else if (event.key === "ArrowLeft" && currentIndex === 0) {
              // If we're at the first thumbnail in the row and press left arrow,
              // focus on the sidebar element
              const sidebarElement = document.querySelector(".sidenav"); // adjust the selector to match your sidebar element
              sidebarElement.focus();
            }
          } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            // Navigate to previous/next row
            const rowElements = document.querySelectorAll(`.row-content`);
            const currentRowIndex = Array.prototype.indexOf.call(
              rowElements,
              rowContentElement
            );
            const newRowIndex =
              currentRowIndex + (event.key === "ArrowDown" ? 1 : -1);
            if (newRowIndex >= 0 && newRowIndex < rowElements.length) {
              const newRowElement = rowElements[newRowIndex];
              const firstThumbnail = newRowElement.querySelector(".thumbnail");
              if (firstThumbnail) {
                firstThumbnail.focus();
              }
            }
          } else if (event.key === "Enter") {
            const movieTitle = thumbnailElement.querySelector("h2").textContent;
            const movie = movies.find(
              (movie) =>
                movie.title === movieTitle || movie.original_name === movieTitle
            );
            const backdropUrl = `https://image.tmdb.org/t/p/original${
              movie.backdrop_path || movie.poster_path
            }`;

            const movieOverview = movie.overview;
            window.location.href = `movie.html?title=${movieTitle}&backdrop=${backdropUrl}&overview=${movieOverview}`;
          }
        });

        //** */
        // Add an event listener to the sidebar element
        const sidebarElement = document.querySelector(".sidenav");
        sidebarElement.addEventListener("keydown", (event) => {
          if (event.key === "ArrowRight") {
            // If we're in the sidebar and press right arrow,
            // focus on the first thumbnail in the row
            const rowElements = document.querySelectorAll(`.row-content`);
            const firstRowElement = rowElements[0];
            const firstThumbnail = firstRowElement.querySelector(".thumbnail");
            if (firstThumbnail) {
              firstThumbnail.focus();
            }
          }
        });

        // Add an event listener to the sidenav element
        const sidenavElement = document.querySelector(".sidenav");
        sidenavElement.addEventListener("focus", () => {
          sidenavElement.classList.add("focused");
        });

        sidenavElement.addEventListener("blur", () => {
          sidenavElement.classList.remove("focused");
        });

        // Add movie to the object with its position
        moviePosition[movie.title || movie.original_name] = index + 1;
        // Add movie object to the array
        movieArray.push({
          name: movie.title || movie.original_name,
          position: index + 1,
          rowNumber: rowNumber,
        });
        //

        //Conditional to add initial focus to the first movie
        if (cont === 0) {
          thumbnailElement.setAttribute("autofocus", "true");
          thumbnailElement.setAttribute("data-focusable-initial-focus", "true");
          thumbnailElement.addEventListener("focused", (event) => {
            // handle the "focused" event
          });
          thumbnailElement.addEventListener("blurred", (event) => {
            // handle the "blurred" event
          });
          thumbnailElement.addEventListener("selected", (event) => {
            // handle the "selected" event
          });
          cont++;
          console.log(thumbnailElement.appendChild(titleElement));
        }
        //
        thumbnailElement.addEventListener("focus", () => {
          thumbnailElement.classList.add("focused");
        });

        thumbnailElement.addEventListener("blur", () => {
          thumbnailElement.classList.remove("focused");
        });
        //

        movieListElement.appendChild(thumbnailElement);
      });

      rowContentElement.appendChild(movieListElement);

      rowMovieArrays.push(movieArray);
    })
    .catch((err) => console.error(err));
}

// Call the function for each endpoint.
Promise.all([
  renderMovieList(
    "trending/all/week?api_key=ebaa273360a9678e5957480f6adda3b7&language=en-US",
    "netflixOriginals",
    "1"
  ),
  renderMovieList(
    "discover/movie?api_key=ebaa273360a9678e5957480f6adda3b7&with_networks=213",
    "trendingNow",
    "2"
  ),
  renderMovieList(
    "movie/top_rated?api_key=ebaa273360a9678e5957480f6adda3b7&language=en-US",
    "topRated",
    "3"
  ),
  renderMovieList(
    "discover/movie?api_key=ebaa273360a9678e5957480f6adda3b7&language=en-US&with_genres=28",
    "actionMovies",
    "4"
  ),
  renderMovieList(
    "discover/movie?api_key=ebaa273360a9678e5957480f6adda3b7&language=en-US&with_genres=35",
    "comedyMovies",
    "5"
  ),
  renderMovieList(
    "discover/movie?api_key=ebaa273360a9678e5957480f6adda3b7&language=en-US&with_genres=27",
    "horrorMovies",
    "6"
  ),
  renderMovieList(
    "discover/movie?api_key=ebaa273360a9678e5957480f6adda3b7&language=en-US&with_genres=10749",
    "romanceMovies",
    "7"
  ),
  renderMovieList(
    "discover/movie?api_key=ebaa273360a9678e5957480f6adda3b7&language=en-US&with_genres=99",
    "documentaries",
    "8"
  ),
]).then(() => {
  console.log("Fetched movies from tmdb -", rowMovieArrays);
});


document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    event.preventDefault();
  }
});

document.addEventListener(
  "focus",
  (event) => {
    const focusedElement = event.target;
    if (focusedElement.classList.contains("thumbnail")) {
      const movieTitle = focusedElement.querySelector("h2").textContent;
      const movieDescription = focusedElement.querySelector("p").textContent;
      console.log(
        `Focused movie: ${movieTitle}, Description: ${movieDescription}`
      );

      // Update the focused movie image
      const focusedMovieImage = document.getElementById("focused-movie-image");
      const moviePosterUrl = `https://image.tmdb.org/t/p/original${
        focusedElement.querySelector("img").src.split("w500")[1]
      }`;
      focusedMovieImage.src = moviePosterUrl;

      // Update the movie title and overview
      const movieTitleElement = document.querySelector(".movie-title");
      const movieOverviewElement = document.querySelector(".movie-overview");
      movieTitleElement.textContent = movieTitle;
      movieOverviewElement.textContent = movieDescription;

      // Limit the overview length to 150 characters
      const maxLength = 150;
      const truncatedOverview = movieDescription.substring(0, maxLength);
      if (movieDescription.length > maxLength) {
        truncatedOverview += "See More"; // add an ellipsis if the text is truncated
      }
      movieOverviewElement.textContent = truncatedOverview;
    }
  },
  true
);
document.addEventListener(
  "focus",
  (event) => {
    const focusedElement = event.target;
    if (focusedElement.classList.contains("thumbnail")) {
      const movieTitle = focusedElement.querySelector("h2").textContent;
      const movieDescription = focusedElement.querySelector("p").textContent;
      console.log(
        `Focused movie: ${movieTitle}, Description: ${movieDescription}`
      );
      let moviePosition = 0;
      let contRows = -1;
      let contMovies = -1;

      // Find the movie in the rowMovieArrays
      let rowIndex = -1;
      let movieIndex = -1;
      let moviePositions = [];
      for (let i = 0; i < rowMovieArrays.length; i++) {
        for (let j = 0; j < rowMovieArrays[i].length; j++) {
          if (rowMovieArrays[i][j].name === movieTitle) {
            rowIndex = i;
            movieIndex = j;
            moviePosition = rowMovieArrays[i][j].position;
            moviePositions.push({
              rowNumber: rowMovieArrays[i][j].rowNumber,
              position: rowMovieArrays[i][j].position,
            });
          }
        }
      }
      console.log(
        "Movie is located in ",
        moviePositions.length,
        " diferent position/s ",
        moviePositions
      );
    }
  },
  true
);
