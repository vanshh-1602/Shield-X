from django.db import models

class Transaction(models.Model):
    # User-visible fields
    timestamp = models.DateTimeField()
    amount = models.FloatField()
    location = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    
    # System fields
    created_at = models.DateTimeField(auto_now_add=True)
    
    # ML-related fields
    is_fraud = models.BooleanField(default=False)
    fraud_probability = models.FloatField(default=0.0)
    ml_features = models.JSONField(default=dict)  # Store V1-V28 here

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Transaction {self.id} - ${self.amount} - {'FRAUD' if self.is_fraud else 'LEGITIMATE'}"
