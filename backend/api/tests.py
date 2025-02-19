from django.test import TestCase, Client
from django.urls import reverse
from .models import Transaction
import json

class TransactionAPITests(TestCase):
    def setUp(self):
        self.client = Client()
        self.valid_transaction = Transaction.objects.create(
            amount=100.00,
            is_fraud=False,
            fraud_probability=0.1,
            features={'V1': 1.0, 'V2': -0.5},
            top_contributing_features={'V1': 0.3, 'V2': -0.2}
        )
        
    def test_transactions_list(self):
        """Test that transactions endpoint returns correct data"""
        response = self.client.get(
            reverse('transactions_list'),
            HTTP_X_API_KEY='your-test-api-key-123'
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertTrue('transactions' in data)
        self.assertTrue('pagination' in data)
        
    def test_predict_fraud(self):
        """Test fraud prediction endpoint"""
        test_data = {
            'Amount': 100.00,
            'V1': 1.0,
            'V2': -0.5
        }
        response = self.client.post(
            reverse('predict_fraud'),
            data=json.dumps(test_data),
            content_type='application/json',
            HTTP_X_API_KEY='your-test-api-key-123'
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertTrue('is_fraud' in data)
        self.assertTrue('fraud_probability' in data)
        
    def test_invalid_api_key(self):
        """Test that invalid API key returns 401"""
        response = self.client.get(
            reverse('transactions_list'),
            HTTP_X_API_KEY='invalid-key'
        )
        self.assertEqual(response.status_code, 401)
        
    def test_model_info(self):
        """Test model info endpoint"""
        response = self.client.get(
            reverse('model_info'),
            HTTP_X_API_KEY='your-test-api-key-123'
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertTrue('model_info' in data)
