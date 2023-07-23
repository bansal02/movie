const API_KEY = 'bc1d6a9f';
const API_URL = 'http://www.omdbapi.com/';

let currentPage = 1;
let currentSearchQuery = '';

function fetchData(url) {
  return fetch(url)
    .then(response => response.json())
    .catch(error => console.error('Error fetching data:', error));
}

function displayMovies(movies) {
  const moviesContainer = document.getElementById('moviesContainer');
  moviesContainer.innerHTML = '';

  movies.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');
    movieCard.innerHTML = `<img src="${movie.Poster}" alt="${movie.Title}">
                           <p>${movie.Title}</p>`;
    movieCard.addEventListener('click', () => openModal(movie));
    moviesContainer.appendChild(movieCard);
  });
}

function displayPagination(totalResults) {
  const paginationContainer = document.getElementById('paginationContainer');
  paginationContainer.innerHTML = '';
  const button = document.createElement('button');
  button.textContent = "Previous";
  button.addEventListener('click', () => {
     gotoPreviousPage()
  });
  paginationContainer.appendChild(button);

  const button2 = document.createElement('button');
  button2.textContent = currentPage;
  button2.addEventListener('click', () => {
     gotoPage(currentPage)
  });
  paginationContainer.appendChild(button2); 

  const button1 = document.createElement('button');
  button1.textContent = "Next";
  button1.addEventListener('click', () => {
     gotoNextPage(totalResults)
  });
  paginationContainer.appendChild(button1); 
}

function gotoPreviousPage() {
    currentPage = Math.max(1, currentPage - 1);
    console.log(currentPage);
    searchMoviesPage(currentPage);
  }
  
  function gotoNextPage(totalResults) {
    const totalPages = Math.ceil(totalResults / 10);
    currentPage = Math.min(totalPages, currentPage + 1);
    searchMoviesPage(currentPage);
  }
  
  function gotoPage(page) {
    currentPage = page;
    searchMoviesPage(currentPage);
  }

function searchMoviesPage(currentPage) {
    console.log(currentPage);
  if (currentSearchQuery) {
    console.log(currentPage);
    const url = `${API_URL}?apikey=${API_KEY}&s=${currentSearchQuery}&page=${currentPage}`;
    fetchData(url)
      .then(data => {
        if (data.Response === 'True') {
          console.log(data.Search);
          console.log(data.totalResults);
          displayMovies(data.Search);
          displayPagination(data.totalResults);
        } else {
          console.error('Error searching movies:', data.Error);
        }
      });
  }
}
function searchMovies(){
    const searchInput = document.getElementById('searchInput');
    currentSearchQuery = searchInput.value.trim();
    searchMoviesPage(1);
}

function openModal(movie) {
  const modalContainer = document.getElementById('modalContainer');
  const movieTitle = document.getElementById('movieTitle');
  const moviePoster = document.getElementById('moviePoster');
  const movieInfo = document.getElementById('movieInfo');
  const commentsContainer = document.getElementById('commentsContainer');

  movieTitle.textContent = movie.Title;
  moviePoster.src = movie.Poster;
  movieInfo.innerHTML = `<p><strong>Year:</strong> ${movie.Year}</p>
                         <p><strong>Type:</strong> ${movie.Type}</p>
                         <p><strong>IMDB-ID:</strong> ${movie.imdbID}</p>`;

  modalContainer.style.display = 'block';
  
}

function closeModal() {
  const modalContainer = document.getElementById('modalContainer');
  modalContainer.style.display = 'none';
}

function rateMovie(event) {
  const stars = event.currentTarget.querySelectorAll('.star');
  const rating = Array.from(stars).indexOf(event.target) + 1;
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.add('selected');
    } else {
      star.classList.remove('selected');
    }
  });
  console.log('User rating:', rating);
  
}

function saveComment() {
  const userComment = document.getElementById('userComment').value.trim();
  console.log('User comment:', userComment);

}


fetchMovies();
