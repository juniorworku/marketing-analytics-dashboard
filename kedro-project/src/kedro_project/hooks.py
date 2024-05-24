# src/kedro_project/hooks.py

from kedro.framework.hooks import hook_impl
from pyspark.sql import SparkSession

class SparkHooks:
    @hook_impl
    def after_context_created(self, context) -> None:
        # Set up a Spark session
        self.spark = SparkSession.builder \
            .appName("KedroProject") \
            .getOrCreate()

    @hook_impl
    def before_pipeline_run(self) -> None:
        # Code to run before the pipeline starts
        pass

    @hook_impl
    def after_pipeline_run(self) -> None:
        # Code to run after the pipeline ends
        self.spark.stop()
