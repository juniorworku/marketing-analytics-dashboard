"""
This is a boilerplate pipeline 'data_processing'
generated using Kedro 0.19.5
"""

# src/kedro_project/pipelines/data_processing/pipeline.py

from kedro.pipeline import Pipeline, node
from .nodes import process_ads_data, process_play_store_data

def create_pipeline(**kwargs):
    return Pipeline(
        [
            node(
                func=process_ads_data,
                inputs="raw_telegram_posts_data",
                outputs="intermediate_ads_data",
                name="process_ads_data_node",
            ),
            node(
                func=process_play_store_data,
                inputs="raw_abyssinia_bank_reviews",
                outputs="intermediate_play_store_data",
                name="process_play_store_data_node",
            ),
        ]
    )
