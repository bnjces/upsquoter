from flask import Flask, request, jsonify, render_template
import requests

app = Flask(__name__)

# UPS API credentials
UPS_CLIENT_ID = 'your_client_id'
UPS_CLIENT_SECRET = 'your_client_secret'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get-rate', methods=['POST'])
def get_rate():
    data = request.json

    ups_url = "https://onlinetools.ups.com/rest/Rate"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Basic {UPS_CLIENT_ID}:{UPS_CLIENT_SECRET}"
    }

    # Set default dimensions
    default_length = "15"
    default_width = "15"
    default_height = "15"

    packages = []
    for _ in range(int(data['numberOfPackages'])):
        packages.append({
            "PackagingType": {
                "Code": "02",
                "Description": "Package"
            },
            "Dimensions": {
                "UnitOfMeasurement": {
                    "Code": "IN"
                },
                "Length": default_length,
                "Width": default_width,
                "Height": default_height
            },
            "PackageWeight": {
                "UnitOfMeasurement": {
                    "Code": "LBS"
                },
                "Weight": data['weight']
            }
        })

    payload = {
        "UPSSecurity": {
            "UsernameToken": {
                "Username": UPS_CLIENT_ID,
                "Password": UPS_CLIENT_SECRET
            },
            "ServiceAccessToken": {
                "AccessLicenseNumber": "your_access_key"
            }
        },
        "RateRequest": {
            "Request": {
                "RequestOption": "Rate"
            },
            "Shipment": {
                "Shipper": {
                    "Address": {
                        "City": data['shipperCity'],
                        "PostalCode": data['shipperPostalCode'],
                        "CountryCode": data['shipperCountry']
                    }
                },
                "ShipTo": {
                    "Address": {
                        "City": data['recipientCity'],
                        "PostalCode": data['recipientPostalCode'],
                        "CountryCode": data['recipientCountry']
                    }
                },
                "Package": packages
            }
        }
    }

    response = requests.post(ups_url, json=payload, headers=headers)
    rate_data = response.json()

    rate_quotes = []
    for rate in rate_data['RateResponse']['RatedShipment']:
        rate_quotes.append({
            "service": rate['Service']['Code'],
            "cost": rate['TotalCharges']['MonetaryValue']
        })

    return jsonify(rateQuotes=rate_quotes)

if __name__ == '__main__':
    app.run(debug=True)
