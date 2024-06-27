document.getElementById('searchButton').addEventListener('click', function () {
    const category = document.getElementById('category').value;
    if (category) {
        fetchBooks(category);
    } else {
        alert('Please, insert a valid category.');
    }
});


//funzione per fetch API ed estrarre la categoria
function fetchBooks(category) {
    const apiUrl = `https://openlibrary.org/subjects/${category}.json`;
    const headers = new Headers({
        "User-Agent": "librarySearch/1.0 (matteo.ricci0304@gmail.com)"
    });

    fetch(apiUrl, {
        method: 'GET',
        headers: headers
    })
        .then(response => response.json()
            .then(data => displayResults(data.works)))
        .catch(error => console.error('Errore', error));
}

//funzione per mostrare i risultati in un div creato appositamente
function displayResults(books) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (books.length === 0) {
        resultsDiv.innerHTML = '<p>No book has been found for this category.</p>';
        return;
    }

    //funzione per ottenere il titolo
    books.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.className = 'book';

        const titleElement = document.createElement('h3');
        titleElement.textContent = book.title;
        bookElement.appendChild(titleElement);

        const descriptionButton = document.createElement('button');
        descriptionButton.textContent = 'Show Description';
        descriptionButton.addEventListener('click', function () {
            toggleDescription(book.key, bookElement, descriptionButton);
        });

        //funzione per ottenere gli autori
        book.authors.forEach(author => {
            const authorElement = document.createElement('p');
            authorElement.textContent = `Author: ${author.name}`;
            bookElement.appendChild(authorElement);
            authorElement.appendChild(descriptionButton);
            resultsDiv.appendChild(bookElement);
        })
    });
}

//funzione per ottenere la descrizione + pulsante 'hide' e 'show description'
function toggleDescription(bookKey, bookElement, button) {
    let descriptionElement = bookElement.querySelector('.description');
    if (descriptionElement) {
        if (descriptionElement.style.display === 'none') {
            descriptionElement.style.display = 'block';
            button.textContent = 'Hide Description';
        } else {
            descriptionElement.style.display = 'none';
            button.textContent = 'Show Description';
        }
    } else {
        fetchDescription(bookKey, bookElement, button);
    }
}

function fetchDescription(bookKey, bookElement, button) {
    const apiUrl = `https://openlibrary.org${bookKey}.json`;
    fetch(apiUrl)
        .then(response => response.json()
            .then(data => {
                const descriptionElement = document.createElement('p');
                descriptionElement.className = 'description';
                descriptionElement.textContent = data.description.value || data.description;
                bookElement.appendChild(descriptionElement);
                button.textContent = 'Hide Description';
            }))
        .catch(error => console.error('Errore', error));
}
