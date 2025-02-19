import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.conf import settings
import numpy as np
from .ml_fraud_model import predict_fraud, load_model
from .models import Transaction
import base64
import hmac
import hashlib
import time
from functools import wraps
from django.core.paginator import Paginator
import random
from django.utils.dateparse import parse_datetime

def api_key_required(view_func):
    @wraps(view_func)
    def wrapped_view(request, *args, **kwargs):
        # For development, allow requests without API key
        if settings.DEBUG:
            return view_func(request, *args, **kwargs)
            
        api_key = request.headers.get('X-API-Key')
        if not api_key:
            return JsonResponse({
                'error': 'API key is required',
                'code': 'missing_api_key'
            }, status=401)
        
        # In production, use a secure key management system
        valid_api_key = 'your-test-api-key-123'  # Change this in production!
        
        if not hmac.compare_digest(api_key, valid_api_key):
            return JsonResponse({
                'error': 'Invalid API key',
                'code': 'invalid_api_key'
            }, status=401)
        
        return view_func(request, *args, **kwargs)
    return wrapped_view

@csrf_exempt
@api_key_required
@require_http_methods(["POST"])
def predict_fraud_view(request):
    try:
        # Parse JSON data from request
        data = json.loads(request.body)
        
        # Make prediction
        prediction_result = predict_fraud(data)
        
        # Add request timestamp
        prediction_result['timestamp'] = time.strftime('%Y-%m-%d %H:%M:%S')
        
        # Save transaction to database
        Transaction.objects.create(
            amount=prediction_result['transaction_amount'],
            is_fraud=prediction_result['is_fraud'],
            fraud_probability=prediction_result['fraud_probability'],
            features=data,
            top_contributing_features=prediction_result['top_contributing_features']
        )
        
        # Return prediction with enhanced information
        return JsonResponse(prediction_result)
        
    except json.JSONDecodeError:
        return JsonResponse({
            'error': 'Invalid JSON data',
            'code': 'invalid_json'
        }, status=400)
    except ValueError as e:
        return JsonResponse({
            'error': str(e),
            'code': 'validation_error'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'error': f'Prediction error: {str(e)}',
            'code': 'internal_error'
        }, status=500)

@csrf_exempt
@api_key_required
@require_http_methods(["GET"])
def model_info(request):
    """Get information about the current model"""
    try:
        _, _, metadata = load_model()
        return JsonResponse({
            'model_info': {
                'training_date': metadata['training_date'],
                'feature_count': len(metadata['feature_names']),
                'top_features': [
                    {'feature': k, 'importance': float(v)}
                    for k, v in sorted(
                        metadata['feature_importance'].items(),
                        key=lambda x: abs(x[1]),
                        reverse=True
                    )[:10]
                ]
            }
        })
    except Exception as e:
        return JsonResponse({
            'error': f'Error fetching model info: {str(e)}',
            'code': 'model_info_error'
        }, status=500)

@csrf_exempt
@api_key_required
@require_http_methods(["GET"])
def transactions_list(request):
    """Get list of transactions with pagination"""
    try:
        # Get the latest 50 transactions, ordered by timestamp
        transactions = Transaction.objects.all().order_by('-timestamp')[:50]
        
        return JsonResponse({
            'transactions': [
                {
                    'id': t.id,
                    'timestamp': t.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
                    'amount': float(t.amount),
                    'is_fraud': t.is_fraud,
                    'fraud_probability': float(t.fraud_probability),
                    'top_contributing_features': t.top_contributing_features
                }
                for t in transactions
            ]
        })
    except Exception as e:
        return JsonResponse({
            'error': f'Error fetching transactions: {str(e)}',
            'code': 'transactions_error'
        }, status=500)

def generate_ml_features():
    """Generate mock ML features for demonstration purposes."""
    return {f'V{i}': random.gauss(0, 1) for i in range(1, 29)}

@csrf_exempt
@require_http_methods(["POST"])
def create_transaction(request):
    try:
        # Parse request data
        data = json.loads(request.body)
        
        # Parse the timestamp
        timestamp = parse_datetime(data.get('timestamp'))
        if not timestamp:
            return JsonResponse({
                'error': 'Invalid timestamp format',
                'code': 'invalid_timestamp'
            }, status=400)
        
        # Create transaction with user-provided fields
        transaction = Transaction.objects.create(
            timestamp=timestamp,
            amount=float(data.get('amount', 0)),
            location=data.get('location', ''),
            description=data.get('description', ''),
            ml_features=generate_ml_features()  # Auto-generate ML features
        )
        
        # Simulate fraud detection (in production, this would use real ML)
        is_fraud = random.random() < 0.1  # 10% chance of fraud
        transaction.is_fraud = is_fraud
        transaction.fraud_probability = random.random()
        transaction.save()
        
        return JsonResponse({
            'id': transaction.id,
            'timestamp': transaction.timestamp.isoformat(),
            'amount': transaction.amount,
            'location': transaction.location,
            'description': transaction.description,
            'is_fraud': transaction.is_fraud,
            'fraud_probability': transaction.fraud_probability,
            'created_at': transaction.created_at.isoformat()
        }, status=201)
        
    except Exception as e:
        return JsonResponse({
            'error': str(e),
            'code': 'transaction_error'
        }, status=400)

@csrf_exempt
@require_http_methods(["GET"])
def transactions_list(request):
    try:
        transactions = Transaction.objects.all()[:100]  # Limit to last 100
        return JsonResponse({
            'transactions': [{
                'id': t.id,
                'timestamp': t.timestamp.isoformat(),
                'amount': t.amount,
                'location': t.location,
                'description': t.description,
                'is_fraud': t.is_fraud,
                'fraud_probability': t.fraud_probability,
                'created_at': t.created_at.isoformat()
            } for t in transactions]
        })
    except Exception as e:
        return JsonResponse({
            'error': str(e),
            'code': 'transactions_error'
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def predict_transaction(request):
    try:
        data = json.loads(request.body)
        transaction_id = data.get('transaction_id')
        
        if not transaction_id:
            return JsonResponse({'message': 'transaction_id is required'}, status=400)
            
        transaction = Transaction.objects.get(id=transaction_id)
        
        # Mock ML prediction (replace with actual ML model call)
        is_fraud = random.random() < 0.1  # 10% chance of fraud
        fraud_probability = random.random()
        
        transaction.is_fraud = is_fraud
        transaction.fraud_probability = fraud_probability
        transaction.save()
        
        return JsonResponse({
            'is_fraud': is_fraud,
            'fraud_probability': fraud_probability
        })
    except Transaction.DoesNotExist:
        return JsonResponse({'message': 'Transaction not found'}, status=404)
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=400)
