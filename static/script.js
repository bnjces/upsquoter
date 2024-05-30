document.getElementById('shipping-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const shipperPostalCode = document.getElementById('shipper-postal-code').value;
    const shipperCity = document.getElementById('shipper-city').value;
    const shipperCountry = document.getElementById('shipper-country').value;
    const recipientPostalCode = document.getElementById('recipient-postal-code').value;
    const recipientCity = document.getElementById('recipient-city').value;
    const recipientCountry = document.getElementById('recipient-country').value;
    const weight = document.getElementById('weight').value;
    const numberOfPackages = document.getElementById('number-of-packages').value;

    const data = {
        shipperPostalCode,
        shipperCity,
        shipperCountry,
        recipientPostalCode,
        recipientCity,
        recipientCountry,
        weight,
        numberOfPackages
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

document.getElementById('shipper-postal-code').addEventListener('blur', function() {
    const postalCode = this.value;
    fetch(`https://api.zippopotam.us/us/${postalCode}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Invalid Postal Code');
            }
        })
        .then(data => {
            document.getElementById('shipper-city').value = data.places[0]['place name'];
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('shipper-city').value = '';
        });
});

document.getElementById('recipient-postal-code').addEventListener('blur', function() {
    const postalCode = this.value;
    fetch(`https://api.zippopotam.us/us/${postalCode}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Invalid Postal Code');
            }
        })
        .then(data => {
            document.getElementById('recipient-city').value = data.places[0]['place name'];
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('recipient-city').value = '';
        });
});
