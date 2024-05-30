document.getElementById('shipping-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const shipperCity = document.getElementById('shipper-city').value;
    const shipperPostalCode = document.getElementById('shipper-postal-code').value;
    const shipperCountry = document.getElementById('shipper-country').value;
    const recipientCity = document.getElementById('recipient-city').value;
    const recipientPostalCode = document.getElementById('recipient-postal-code').value;
    const recipientCountry = document.getElementById('recipient-country').value;
    const weight = document.getElementById('weight').value;

    const data = {
        shipperCity,
        shipperPostalCode,
        shipperCountry,
        recipientCity,
        recipientPostalCode,
        recipientCountry,
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
