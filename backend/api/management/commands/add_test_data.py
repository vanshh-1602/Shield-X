from django.core.management.base import BaseCommand
from api.models import Transaction
from django.utils import timezone

class Command(BaseCommand):
    help = 'Adds test transaction data'

    def handle(self, *args, **kwargs):
        # Create a normal transaction
        Transaction.objects.create(
            amount=500.0,
            is_fraud=False,
            fraud_probability=0.80,
            timestamp=timezone.now(),
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
            timestamp=timezone.now(),
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

        # Print all transactions
        self.stdout.write("\nAll Transactions:")
        self.stdout.write("-" * 50)
        for t in Transaction.objects.all():
            self.stdout.write(f"ID: {t.id}")
            self.stdout.write(f"Amount: ${t.amount}")
            self.stdout.write(f"Is Fraud: {t.is_fraud}")
            self.stdout.write(f"Fraud Probability: {t.fraud_probability}")
            self.stdout.write(f"Timestamp: {t.timestamp}")
            self.stdout.write("-" * 50)

        self.stdout.write(self.style.SUCCESS('Successfully added test transactions'))
