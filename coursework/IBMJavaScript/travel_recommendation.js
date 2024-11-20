function addSearchResult(item, categoryContainer) {
    // Create the destination card
    const destinationCard = document.createElement('div');
    destinationCard.id = 'destination-card';
    destinationCard.className = 'page-content';

    // Add image
    const image = document.createElement('img');
    image.src = item.imageUrl || 'assets/images/placeholder.jpg'; // Use a placeholder if no image URL is provided
    image.alt = item.name;
    destinationCard.appendChild(image);

    // Add name
    const nameHeading = document.createElement('h2');
    nameHeading.textContent = item.name;
    destinationCard.appendChild(nameHeading);

    // Add description
    const descriptionParagraph = document.createElement('p');
    descriptionParagraph.textContent = item.description || 'No description available.';
    destinationCard.appendChild(descriptionParagraph);

    // Append the card to the category container
    categoryContainer.appendChild(destinationCard);
}

function resetSearchResults() {
    console.log("%c resetting search results", "background: magenta");
    // Clear the search results
    const searchResults = document.getElementById('search-results-container');
    while (searchResults.lastChild && searchResults.lastChild.id !== 'back-home') {
        searchResults.removeChild(searchResults.lastChild);
    }
}

function hideAllSections() {
    document.querySelectorAll('.content > div').forEach(div => {
        div.style.display = 'none';
    });
}

// Function to show a specific section
function showSection(id) {
    hideAllSections();
    document.getElementById(id).style.display = 'block';
    if (id === 'home') {
        document.getElementById('search-form-nav').style.display = 'block';
    } else {
        document.getElementById('search-form-nav').style.display = 'none';
    }
}

// Define a constant for the keys in the recommendations dictionary
const RECOMMENDATION_KEYS = ['countries', 'temples', 'beaches'];
let recommendations;

function handleSearch(searchInput, searchResults, recommendations) {
    // Clear previous results by removing children except for the back-home button
    if (searchInput) {
        console.log("%csearchInput: "+searchInput, "background: cyan");
        // Use the constant to iterate through keys
        RECOMMENDATION_KEYS.forEach(key => {
            const categoryResults = recommendations[key];
            if (key.toLowerCase().includes(searchInput)) {
                if (key==='countries') {
                    categoryResults.forEach(item => {
                        item['cities'].forEach(city => {
                            addSearchResult(city, searchResults);
                        });
                    });
                } else {
                    categoryResults.forEach(item => {
                        addSearchResult(item, searchResults);
                    });
                }
            } else {
                categoryResults.forEach(item => {
                    if (key === 'countries') {
                        if (item.name.toLowerCase().includes(searchInput)) {
                            item['cities'].forEach(city => {
                                addSearchResult(city, searchResults);
                            });
                        } else {
                            item['cities'].forEach(city => {
                                if (city.name.toLowerCase().includes(searchInput)) {
                                    addSearchResult(city, searchResults);
                                }
                            });
                        }
                    } else {
                        if (item.name.toLowerCase().includes(searchInput) || 
                        (item.description && item.description.toLowerCase().includes(searchInput))) {
                            addSearchResult(item, searchResults);
                        }
                    }
                });
            }
        });
    }
}


document.addEventListener('DOMContentLoaded', function() {
    // Fetch recommendations data
    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            recommendations = data;
            console.log(recommendations);
        });


    // Attach event listener to the search button
    document.querySelector('.search-button[type="submit"]').addEventListener('click', function(e) {
        e.preventDefault();
        resetSearchResults();
        const searchInput = document.querySelector('.search-input').value.toLowerCase();
        const searchResults = document.getElementById('search-results-container');    
        handleSearch(searchInput, searchResults, recommendations);
    });

    // Attach event listener to the reset button
    document.querySelector('.search-button[type="reset"]').addEventListener('click', function(e) {
        e.preventDefault();
        resetSearchResults();
        document.querySelector('.search-input').value = '';
    });

});