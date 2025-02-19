import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
import joblib
import os

def train_fraud_model():
    # Check if data file exists
    data_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'creditcard.csv')
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Data file not found at {data_path}")

    # Load and prepare data
    print("Loading data...")
    df = pd.read_csv(data_path)
    
    # Separate features and target
    X = df.drop(['Class', 'Time'], axis=1)
    y = df['Class']
    
    # Split the data
    print("Splitting data into train and test sets...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Scale the features
    print("Scaling features...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train the model
    print("Training logistic regression model...")
    model = LogisticRegression(random_state=42, max_iter=1000, class_weight='balanced')
    model.fit(X_train_scaled, y_train)
    
    # Evaluate the model
    y_pred = model.predict(X_test_scaled)
    y_pred_proba = model.predict_proba(X_test_scaled)[:, 1]
    
    # Calculate and print metrics
    print("\nModel Evaluation Metrics:")
    print("-" * 50)
    print("Classification Report:")
    print(classification_report(y_test, y_pred))
    
    print("\nConfusion Matrix:")
    conf_matrix = confusion_matrix(y_test, y_pred)
    print(conf_matrix)
    
    print("\nROC AUC Score:", roc_auc_score(y_test, y_pred_proba))
    
    # Calculate feature importance
    feature_importance = pd.DataFrame({
        'feature': X.columns,
        'importance': abs(model.coef_[0])
    }).sort_values('importance', ascending=False)
    
    print("\nTop 10 Most Important Features:")
    print(feature_importance.head(10))
    
    # Save model metadata
    metadata = {
        'feature_importance': dict(zip(feature_importance['feature'], feature_importance['importance'])),
        'threshold': 0.5,  # Default threshold
        'feature_names': list(X.columns),
        'training_date': pd.Timestamp.now().isoformat()
    }
    
    # Save both the model and scaler
    model_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'models')
    os.makedirs(model_dir, exist_ok=True)
    
    model_path = os.path.join(model_dir, 'fraud_model.pkl')
    scaler_path = os.path.join(model_dir, 'scaler.pkl')
    metadata_path = os.path.join(model_dir, 'model_metadata.pkl')
    
    print(f"\nSaving model and metadata to {model_dir}")
    joblib.dump(model, model_path)
    joblib.dump(scaler, scaler_path)
    joblib.dump(metadata, metadata_path)
    
    return model, scaler, metadata

def load_model():
    """Load the trained model, scaler, and metadata"""
    model_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'models')
    model_path = os.path.join(model_dir, 'fraud_model.pkl')
    scaler_path = os.path.join(model_dir, 'scaler.pkl')
    metadata_path = os.path.join(model_dir, 'model_metadata.pkl')
    
    if not all(os.path.exists(p) for p in [model_path, scaler_path, metadata_path]):
        model, scaler, metadata = train_fraud_model()
    else:
        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)
        metadata = joblib.load(metadata_path)
    
    return model, scaler, metadata

def validate_features(features_dict, feature_names):
    """Validate input features"""
    errors = []
    
    # Check for missing or extra features
    missing_features = set(feature_names) - set(features_dict.keys())
    extra_features = set(features_dict.keys()) - set(feature_names)
    
    if missing_features:
        errors.append(f"Missing features: {', '.join(missing_features)}")
    if extra_features:
        errors.append(f"Extra features not used by model: {', '.join(extra_features)}")
    
    # Validate feature values
    for feature, value in features_dict.items():
        if feature in feature_names:
            try:
                float_value = float(value)
                # Check for reasonable ranges (adjust these based on your data)
                if abs(float_value) > 100 and feature != 'Amount':
                    errors.append(f"Feature {feature} has unusually large value: {float_value}")
                if feature == 'Amount' and (float_value <= 0 or float_value > 25000):
                    errors.append(f"Amount {float_value} is outside reasonable range (0-25000)")
            except ValueError:
                errors.append(f"Feature {feature} has invalid value: {value}")
    
    return errors

def predict_fraud(features_dict):
    """Predict whether a transaction is fraudulent"""
    model, scaler, metadata = load_model()
    feature_names = metadata['feature_names']
    
    # Validate input features
    validation_errors = validate_features(features_dict, feature_names)
    if validation_errors:
        raise ValueError('\n'.join(validation_errors))
    
    # Prepare features in correct order
    features = [float(features_dict[fname]) for fname in feature_names]
    features_array = np.array(features).reshape(1, -1)
    
    # Scale features and predict
    features_scaled = scaler.transform(features_array)
    prediction = model.predict(features_scaled)
    probability = model.predict_proba(features_scaled)[0][1]
    
    # Get top contributing features
    feature_contributions = []
    for fname, importance, value in zip(feature_names, model.coef_[0], features):
        contribution = abs(importance * value)
        feature_contributions.append((fname, contribution))
    
    top_contributors = sorted(feature_contributions, key=lambda x: abs(x[1]), reverse=True)[:5]
    
    return {
        'is_fraud': bool(prediction[0]),
        'fraud_probability': float(probability),
        'transaction_amount': float(features_dict['Amount']),
        'top_contributing_features': [
            {'feature': f, 'contribution': float(c)} 
            for f, c in top_contributors
        ],
        'model_info': {
            'training_date': metadata['training_date'],
            'threshold': metadata['threshold']
        }
    }

if __name__ == '__main__':
    # Train and save the model
    train_fraud_model()
