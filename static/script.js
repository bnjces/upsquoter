document.getElementById('shipping-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const shipperCity = document.getElementById('shipper-city').value;
    const shipperState = document.getElementById('shipper-state').value;
    const shipperCountry = document.getElementById('shipper-country').value;
    const recipientCity = document.getElementById('recipient-city').value;
    const recipientState = document.getElementById('recipient-state').value;
    const recipientCountry = document.getElementById('recipient-country').value;
    const length = document.getElementById('length').value;
    const width = document.getElementById('width').value;
    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;

    const data = {
        shipperCity,
        shipperState,
        shipperCountry,
        recipientCity,
        recipientState,
        recipientCountry,
        length,
        width,
        height,
        weight
    };

    fetch('/get-rate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        let results = document.getElementById('results');
        results.innerHTML = `<h2>Rate Quotes</h2>`;
        data.rateQuotes.forEach(rate => {
            results.innerHTML += `<p>Service: ${rate.service} - Cost: ${rate.cost}</p>`;
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
