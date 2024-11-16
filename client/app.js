// app.js
document.addEventListener('DOMContentLoaded', function() {
    const locationSelect = document.getElementById('location');
    const predictionForm = document.getElementById('prediction-form');
    const resultDiv = document.getElementById('result');

    // Fetch locations and populate the select element
    fetch('/locations')
        .then(response => response.json())
        .then(data => {
            data.locations.forEach(location => {
                const option = document.createElement('option');
                option.value = location;
                option.textContent = location;
                locationSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching locations:', error);
            resultDiv.textContent = 'Failed to load locations';
        });

    // Handle form submission
    predictionForm.addEventListener('submit', function(event) {
        event.preventDefault();
        if (!predictionForm.checkValidity()) {
            event.stopPropagation();
            predictionForm.classList.add('was-validated');
            return;
        }

        const formData = new FormData(predictionForm);
        const data = {
            bhk: formData.get('bhk'),
            bathroom: formData.get('bathroom'),
            area: formData.get('area'),
            location: formData.get('location')
        };

        resultDiv.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div>';

        fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            resultDiv.textContent = `Estimated Price: ₹${data.estimated_price}`;
        })
        .catch(error => {
            console.error('Error fetching prediction:', error);
            resultDiv.textContent = 'Failed to get price prediction';
        });
    });
});