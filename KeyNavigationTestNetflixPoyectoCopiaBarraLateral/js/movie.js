document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const backdropUrl = urlParams.get("backdrop");
  const movieTitle = urlParams.get("title");

  const homeButton = document.querySelector(".Home-Button");

  if (backdropUrl) {
    document.body.style.backgroundImage = `url('${backdropUrl}')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";

    const movieInfoElement = document.createElement("div");
    movieInfoElement.className = "movie-info";

    const titleElement = document.createElement("h1");
    titleElement.className = "title";
    titleElement.textContent = movieTitle;

    document.title = titleElement.textContent;

    const descriptionElement = document.createElement("p");
    descriptionElement.className = "overview";
    descriptionElement.textContent = urlParams.get("overview");

    movieInfoElement.appendChild(titleElement);
    movieInfoElement.appendChild(descriptionElement);

    document.body.appendChild(movieInfoElement);
  } else {
    console.error("Thumbnail URL is empty or invalid");
  }

  /** */
  // Get the return button element
  const returnButton = document.querySelector(".index-link");

  // Add event listener to handle keyboard navigation
  returnButton.addEventListener("keydown", (event) => {
    console.log("Return button keydown event listener triggered");
    if (event.key === "Enter") {
      returnButton.click();
    }
  });
});

angular.module("myApp", ["caph.focus"]).controller("myController", [
  "$scope",
  "FocusConstant",
  "focusController",
  "nearestFocusableFinder",
  function ($scope, FocusConstant, focusController, nearestFocusableFinder) {
    $scope.focusRight = function (from) {
      focusController.focus(
        nearestFocusableFinder.getNearest(from, FocusConstant.DIRECTION.RIGHT)
      );
    };
  },
]);

document.addEventListener("keydown", function (event) {
  if (event.key === "Backspace" || event.keyCode === 8) {
    window.location.href = "index.html";
  }
});
