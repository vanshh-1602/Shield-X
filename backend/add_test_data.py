from api.models import Transaction

# Create a normal transaction
Transaction.objects.create(
    amount=100.0,
    is_fraud=False,
    fraud_probability=0.01,
    features={
        "V1": -1.3598, "V2": -0.07278, "V3": 2.53635,
        "V4": 1.37816, "V5": -0.33832, "V6": 0.46239
    },
    top_contributing_features={
        "Amount": 2.58,
        "V1": 1.77,
        "V14": 1.50
    }
)

# Create a fraudulent transaction
Transaction.objects.create(
    amount=2500.0,
    is_fraud=True,
    fraud_probability=0.89,
    features={
        "V1": 1.3598, "V2": 2.07278, "V3": -1.53635,
        "V4": -1.37816, "V5": 0.33832, "V6": -0.46239
    },
    top_contributing_features={
        "Amount": 4.58,
        "V1": -2.77,
        "V14": -3.50
    }
)

print("Test data added successfully!")
