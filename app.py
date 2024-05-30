from flask import Flask, request, jsonify, render_template
import requests

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get-rate', methods=['POST'])
def get_rate():
    data = request.json

    ups_url = "https://onlinetools.ups.com/rest/Rate"
    headers = {"Content-Type": "application/json"}

    payload = {
        "UPSSecurity": {
            "UsernameToken": {
                "Username": "your_username",
                "Password": "your_password"
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
                        "StateProvinceCode": data['shipperState'],
                        "CountryCode": data['shipperCountry']
                    }
                },
                "ShipTo": {
                    "Address": {
                        "City": data['recipientCity'],
                        "StateProvinceCode": data['recipientState'],
                        "CountryCode": data['recipientCountry']
                    }
                },
                "Package": {
                    "PackagingType": {
                        "Code": "02",
                        "Description": "Package"
                    },
                    "Dimensions": {
                        "UnitOfMeasurement": {
                            "Code": "IN"
                        },
                        "Length": data['length'],
                        "Width": data['width'],
                        "Height": data['height']
                    },
                    "PackageWeight": {
                        "UnitOfMeasurement": {
                            "Code": "LBS"
                        },
                        "Weight": data['weight']
                    }
                }
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
