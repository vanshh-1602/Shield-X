from django.contrib import admin
from .models import Transaction

admin.site.register(Transaction)

class TransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'timestamp', 'amount', 'is_fraud', 'fraud_probability')
    list_filter = ('is_fraud',)
    search_fields = ('id', 'amount')
