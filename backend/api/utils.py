import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler

def clean_data(df):
    """
    Clean transaction data by removing outliers and standardizing features
    """
    # Remove rows with missing values
    df = df.dropna()
    
    # Remove extreme outliers (beyond 3 standard deviations)
    numeric_columns = df.select_dtypes(include=[np.number]).columns
    for column in numeric_columns:
        mean = df[column].mean()
        std = df[column].std()
        df = df[abs(df[column] - mean) <= 3 * std]
    
    # Standardize features (V1-V28)
    feature_columns = [f'V{i}' for i in range(1, 29)]
    scaler = StandardScaler()
    if all(col in df.columns for col in feature_columns):
        df[feature_columns] = scaler.fit_transform(df[feature_columns])
    
    return df

def extract_top_features(model, feature_names, row_data):
    """
    Extract top contributing features for a prediction
    """
    # Get feature coefficients
    coefficients = model.coef_[0]
    
    # Calculate feature contributions
    contributions = []
    for name, coef, value in zip(feature_names, coefficients, row_data):
        contribution = coef * value
        contributions.append({
            'feature': name,
            'contribution': float(contribution)
        })
    
    # Sort by absolute contribution and get top features
    return sorted(contributions, key=lambda x: abs(x['contribution']), reverse=True)[:5]
