document.addEventListener('DOMContentLoaded', function() {
    const locationList = document.getElementById('location-list');

    // Fetch locations from the server and populate the list
    fetch('/locations')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched locations:', data.locations); // Add this line
            data.locations.forEach(location => {
                const option = document.createElement('option');
                option.value = location;
                option.textContent = location;
                locationList.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching locations:', error);
        });
});