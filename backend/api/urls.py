from django.urls import path
from . import views

urlpatterns = [
    path('transactions/', views.transactions_list, name='transactions_list'),
    path('transactions/create/', views.create_transaction, name='create_transaction'),
    path('predict/', views.predict_transaction, name='predict_transaction'),
]
