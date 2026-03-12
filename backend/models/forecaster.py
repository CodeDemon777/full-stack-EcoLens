import pandas as pd
import numpy as np
import os
from config import config
from models.model_loader import get_model
from utils.logger import logger

def run_forecast(country, start_year, end_year):
    # Depending on model type. If Prophet is loaded from disk, use it
    # Else train dynamically. The prompt specifies fitting it dynamically on OWID data, 
    # but the instructions also say load prophet_model.pkl (if exists).
    
    predictions = []
    prophet_model = get_model('prophet')
    
    try:
        data_path = os.path.join(config.DATA_PATH, "owid_co2.csv")
        if not os.path.exists(data_path):
            raise FileNotFoundError(f"Missing {data_path}. Please download the OWID dataset first.")
            
        df = pd.read_csv(data_path)
        country_df = df[df['country'].str.lower() == country.lower()].copy()
        
        if country_df.empty:
            raise ValueError(f"Country {country} not found in OWID data.")
            
        country_df = country_df.dropna(subset=['co2', 'year'])
        
        if prophet_model is None:
            from prophet import Prophet
            # Dynamically fit the prophet model on this country's data
            train_df = country_df[['year', 'co2']].rename(columns={'year': 'ds', 'co2': 'y'})
            # Prophet requires datetime
            train_df['ds'] = pd.to_datetime(train_df['ds'], format='%Y')
            
            p = Prophet()
            p.fit(train_df)
            
            future_years = [pd.to_datetime(str(y), format='%Y') for y in range(start_year, end_year + 1)]
            future = pd.DataFrame({'ds': future_years})
            forecast = p.predict(future)
            
            for index, row in forecast.iterrows():
                predictions.append({
                    "year": row['ds'].year, 
                    "predicted_co2": float(row['yhat']), 
                    "lower_bound": float(row['yhat_lower']), 
                    "upper_bound": float(row['yhat_upper'])
                })
        else:
             # Just use static Prophet model (this is less dynamic/accurate if training data is fixed to one country, but handles "if exists" requirement)
             logger.info("Using pre-loaded Prophet model")
             # Prophet model usually handles prediction with dataframe of `ds`
             future_years = [pd.to_datetime(str(y), format='%Y') for y in range(start_year, end_year + 1)]
             future = pd.DataFrame({'ds': future_years})
             forecast = prophet_model.predict(future)
            
             for index, row in forecast.iterrows():
                predictions.append({
                    "year": row['ds'].year, 
                    "predicted_co2": float(row['yhat']), 
                    "lower_bound": float(row['yhat_lower']), 
                    "upper_bound": float(row['yhat_upper'])
                })
                 
    except Exception as e:
         logger.error(f"Forecasting error: {str(e)}")
         raise e
         
    return predictions
