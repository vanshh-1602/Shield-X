from api.models import Transaction

print("\nAll Transactions:")
print("-" * 50)
for t in Transaction.objects.all():
    print(f"ID: {t.id}")
    print(f"Amount: ${t.amount}")
    print(f"Is Fraud: {t.is_fraud}")
    print(f"Fraud Probability: {t.fraud_probability}")
    print(f"Timestamp: {t.timestamp}")
    print("-" * 50)
