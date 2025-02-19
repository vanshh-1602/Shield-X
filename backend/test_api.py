import requests
import json
from datetime import datetime

def test_fraud_detection_api():
    # API configuration
    base_url = 'http://localhost:8000/api'
    headers = {
        'Content-Type': 'application/json',
        'X-API-Key': 'your-test-api-key-123'  # Add your API key here
    }
    
    def print_response(response, test_name):
        print(f"\n{test_name}")
        print("Status Code:", response.status_code)
        print("Response:", json.dumps(response.json(), indent=2))
    
    # Test 1: Get model information
    print("\nTesting Model Info Endpoint...")
    try:
        response = requests.get(f'{base_url}/model-info/', headers=headers)
        print_response(response, "Model Information")
    except requests.exceptions.RequestException as e:
        print(f"Error getting model info: {e}")
    
    # Test 2: Legitimate transaction
    legitimate_transaction = {
        "V1": -1.3598071336738172,
        "V2": -0.0727811733098497,
        "V3": 2.536346738618042,
        "V4": 1.378155707540121,
        "V5": -0.338320769942518,
        "V6": 0.462387777762292,
        "V7": 0.239598554061257,
        "V8": 0.098698383309431,
        "V9": 0.363786969611213,
        "V10": 0.090794172431893,
        "V11": -0.551599533260813,
        "V12": -0.617800855762348,
        "V13": -0.991389847235408,
        "V14": -0.311169353699879,
        "V15": 1.468176972444449,
        "V16": -0.470400525259478,
        "V17": 0.207971241929242,
        "V18": 0.025791217664086,
        "V19": 0.403992960255733,
        "V20": 0.251412098239705,
        "V21": -0.018306777944153,
        "V22": 0.277837575558899,
        "V23": -0.110473910188767,
        "V24": 0.066928075074387,
        "V25": 0.128539358273528,
        "V26": -0.189114843888824,
        "V27": 0.133558376740387,
        "V28": -0.021053053337014,
        "Amount": 100.00
    }

    print("\nTesting legitimate transaction...")
    try:
        response = requests.post(
            f'{base_url}/predict/',
            headers=headers,
            json=legitimate_transaction
        )
        print_response(response, "Legitimate Transaction Test")
    except requests.exceptions.RequestException as e:
        print(f"Error testing legitimate transaction: {e}")

    # Test 3: Potentially fraudulent transaction
    fraudulent_transaction = legitimate_transaction.copy()
    fraudulent_transaction.update({
        "V1": -5.3598071336738172,  # Significantly different value
        "V2": -4.0727811733098497,  # Significantly different value
        "Amount": 9999.00  # Unusually large amount
    })

    print("\nTesting potentially fraudulent transaction...")
    try:
        response = requests.post(
            f'{base_url}/predict/',
            headers=headers,
            json=fraudulent_transaction
        )
        print_response(response, "Potentially Fraudulent Transaction Test")
    except requests.exceptions.RequestException as e:
        print(f"Error testing fraudulent transaction: {e}")

    # Test 4: Invalid input (missing field)
    print("\nTesting invalid input (missing field)...")
    invalid_transaction = legitimate_transaction.copy()
    del invalid_transaction['V1']
    try:
        response = requests.post(
            f'{base_url}/predict/',
            headers=headers,
            json=invalid_transaction
        )
        print_response(response, "Invalid Input Test")
    except requests.exceptions.RequestException as e:
        print(f"Error testing invalid transaction: {e}")

    # Test 5: Missing API key
    print("\nTesting missing API key...")
    try:
        response = requests.post(
            f'{base_url}/predict/',
            json=legitimate_transaction
        )
        print_response(response, "Missing API Key Test")
    except requests.exceptions.RequestException as e:
        print(f"Error testing missing API key: {e}")

if __name__ == "__main__":
    test_fraud_detection_api()
