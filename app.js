// Movie Class: Represents a movie
class Movie {
    constructor(title, director, year) {
        this.title = title;
        this.director = director;
        this.year = year;
    }
}

// UI class: Handle UI tasks
class UI {
    static displayMovies() {
        const movies = Store.getMovies();

        movies.forEach((movie) => UI.addMovieToList(movie));
    }

    static addMovieToList(movie) {
        const list = document.querySelector('#movie-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${movie.title}</td>
            <td>${movie.director}</td>
            <td>${movie.year}</td>
            <td><a href='#' class='btn btn-danger btn-sm delete'>X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteMovie(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#movie-form');
        container.insertBefore(div, form);
        // Clear in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#director').value = '';
        document.querySelector('#year').value = '';
    }
}
// Store class: Handles storage
class Store {
    static getMovies() {
        let movies;
        if (localStorage.getItem('movies') === null) {
            movies = [];
        } else {
            movies = JSON.parse(localStorage.getItem('movies'));
        }

        return movies;
    }

    static addMovie(movie) {
        const movies = Store.getMovies();

        movies.push(movie);

        localStorage.setItem('movies', JSON.stringify(movies));
    }

    static removeMovie(year) {
        const movies = Store.getMovies();

        movies.forEach(
            (movie, index) => {
                if (movie.year === year) {
                    movies.splice(index, 1);
                }
            }
        )
        localStorage.setItem('movies', JSON.stringify(movies));
    }
}

// Event: Display movies
document.addEventListener('DOMContentLoaded', UI.displayMovies);

// Event: Add a movie
document.querySelector('#movie-form').addEventListener('submit', (e) => {
    // Prevent actual submit
    e.preventDefault();

    // Get form values
    const title = document.querySelector('#title').value;
    const director = document.querySelector('#director').value;
    const year = document.querySelector('#year').value;

    // Validate
    if (title === '' || director === '' || year === '') {
        UI.showAlert('Please fill in all fields', 'danger');
    } else {
        // Instantiate movie
        const movie = new Movie(title, director, year);

        // Add movie to UI
        UI.addMovieToList(movie);

        // Add movie to store
        Store.addMovie(movie);

        //Show success message
        UI.showAlert('Movie Added', 'success');

        // Clear fields
        UI.clearFields();
    }
});

// Event: Remove a movie
document.querySelector('#movie-list').addEventListener('click', (e) => {
    // Remove movie from UI
    UI.deleteMovie(e.target);

    // Remove movie from store
    Store.removeMovie
        (e.target.parentElement.previousElementSibling.textContent);

    //Show success message
    UI.showAlert('Movie Removed', 'success');
});