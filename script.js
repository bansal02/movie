const API_KEY = 'bc1d6a9f';
const API_URL = 'http://www.omdbapi.com/';

let presentPageNumber = 1;
let searchText = '';

function searchMovies(){
  const searchInputText = document.getElementById('searchInput');
  searchText = searchInputText.value.trim();
  moviePage(1);
}

function openModal(movie) {
  const openCon = document.getElementById('modalContainer');
  const title = document.getElementById('movieTitle');
  const poster = document.getElementById('moviePoster');
  const info = document.getElementById('movieInfo');
  const ratinginfo = document.getElementById('ratingComment');
  const movieID = movie.imdbID;
  title.textContent = movie.Title;
  poster.src = movie.Poster;
  info.innerHTML = `<p><strong>Year:</strong> ${movie.Year}</p>
                         <p><strong>Type:</strong> ${movie.Type}</p>
                         <p><strong>IMDB-ID:</strong> ${movie.imdbID}</p>`;
                         
  ratinginfo.innerHTML = `<div class="user-rating">
          <h3>Rate this movie:</h3>
          <div class="stars" onclick="rateMovie(event)">
            <span class="star" data-rating="1">&#9733;</span>
            <span class="star" data-rating="2">&#9733;</span>
            <span class="star" data-rating="3">&#9733;</span>
            <span class="star" data-rating="4">&#9733;</span>
            <span class="star" data-rating="5">&#9733;</span>
          </div>
          <div class="user-comment">
            <h3>Leave a comment:</h3>
            <textarea id="userComment" rows="4" placeholder="Write your comment here"></textarea>
            <button onclick="saveComment()">Save</button>
          </div>
          <div class="comments" id="commentsContainer"></div>
        </div>`
  openCon.style.display = 'block';
  renderRatingsAndComments(movieID);
}

function renderRatingsAndComments(movieID) {
    const comments = JSON.parse(localStorage.getItem(movieID)) || [];
    comments.forEach(comment => {
      const commentElement = document.createElement('div');
      commentElement.classList.add('comment');
      commentElement.innerHTML = `<div class="user">${comment.user}</div>
                                   <div class="rating">${generateStars(comment.rating)}</div>
                                   <div class="content">${comment.content}</div>`;
                                   console.log(comment.rating);
      commentsContainer.appendChild(commentElement);
    });
}

function closeModal() {
  const closeCon = document.getElementById('modalContainer');
  closeCon.style.display = 'none';
}

function rateMovie(event) {
  const stars = event.currentTarget.querySelectorAll('.star');
  const rating = Array.from(stars).indexOf(event.target) + 1;
  const movieTitle = document.getElementById('movieTitle').textContent;
  localStorage.setItem(`${movieTitle}-rating`, rating);
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.add('selected');
    } else {
      star.classList.remove('selected');
    }
  });

  renderRatingsAndComments(movieID);
}

function saveComment() {
    const comInput = document.getElementById('userComment');
    const userCom = comInput.value.trim();
    const movieTitle = document.getElementById('movieTitle').textContent;
    const movieID = movieTitle.replace(/\s+/g, '-').toLowerCase();

    const userRating = localStorage.getItem(`${movieTitle}-rating`) || '0';
  
    const comment = {
      user: 'User',
      rating: parseInt(userRating),
      content: userCom
    };

    const comments = JSON.parse(localStorage.getItem(movieID)) || [];
    comments.push(comment);
    localStorage.setItem(movieID, JSON.stringify(comments));
    renderRatingsAndComments(movieID);
    comInput.value = '';
  }
  
  function generateStars(rating) {
    return '&#9733;'.repeat(rating) + '&#9734;'.repeat(5 - rating);
  }

function showMovies(movies) {
  const moviesCon = document.getElementById('moviesContainer');
  moviesCon.innerHTML = '';

  movies.forEach(movie => {
    const infoMovie = document.createElement('div');
    infoMovie.classList.add('movie-card');
    infoMovie.innerHTML = `<img src="${movie.Poster}" alt="${movie.Title}">
                           <p>${movie.Title}</p>`;
    infoMovie.addEventListener('click', () => openModal(movie));
    moviesCon.appendChild(infoMovie);
  });
}

function showPagination(totalResults) {
  const pageCon = document.getElementById('paginationContainer');
  pageCon.innerHTML = '';
  const button = document.createElement('button');
  button.textContent = "Previous";
  button.addEventListener('click', () => {
     gotoPreviousPage()
  });
  pageCon.appendChild(button);

  const button2 = document.createElement('button');
  button2.textContent = presentPageNumber;
  button2.addEventListener('click', () => {
     gotoPage(presentPageNumber)
  });
  pageCon.appendChild(button2); 

  const button1 = document.createElement('button');
  button1.textContent = "Next";
  button1.addEventListener('click', () => {
     gotoNextPage(totalResults)
  });
  pageCon.appendChild(button1); 
}

function fetchData(url) {
  return fetch(url)
    .then(response => response.json())
    .catch(error => console.error('Error fetching data:', error));
}

function gotoPreviousPage() {
  presentPageNumber = Math.max(1, presentPageNumber - 1);
  console.log(presentPageNumber);
  moviePage(presentPageNumber);
}

function gotoNextPage(totalResults) {
  const totalPages = Math.ceil(totalResults / 10);
  presentPageNumber = Math.min(totalPages, presentPageNumber + 1);
  moviePage(presentPageNumber);
}

function gotoPage(page) {
  presentPageNumber = page;
  moviePage(presentPageNumber);
}

function moviePage(presentPageNumber) {
    console.log(presentPageNumber);
  if (searchText) {
    console.log(presentPageNumber);
    const url = `${API_URL}?apikey=${API_KEY}&s=${searchText}&page=${presentPageNumber}`;
    fetchData(url)
      .then(data => {
        if (data.Response === 'True') {
          console.log(data.Search);
          console.log(data.totalResults);
          showMovies(data.Search);
          showPagination(data.totalResults);
        } else {
          console.error('Error searching movies:', data.Error);
        }
      });
  }
}
