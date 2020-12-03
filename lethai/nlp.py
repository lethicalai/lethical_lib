import json
import requests
from typing import Text, Optional, List
from lethai.utils import api_response_handler


class config:
    def __init__(self, username: Text, api_token: Text) -> None:
        self.__username = username
        self.__headers = {
            'Content-Type': 'application/json',
            'Auth-Key': api_token,
            'Auth-Username': self.__username
        }
        self.__detect_api_url = 'https://dev.api.lethical.ai/v1/discrimination/nlp/detect'
        self.__dataset = None

    def check_sentiment_gender_bias(
            self,
            predictions: List,
            intensities: Optional[List] = None,
            model_name: Optional[Text] = None
    ) -> None:
        """
        NOTE: Do not randomize the EEC dataset. We assume the predictions are in the same order
        :param predictions: List of sentiments predicted on EEC dataset
        :param intensities: Optional - List of intensities predicted on EEC dataset
        :param model_name: Optional - String name for the model being run.
        :return: None
        """

        json_data = dict()
        json_data["predictions"] = predictions
        json_data["intensities"] = intensities
        json_data["model_name"] = model_name

        print("Running analysis on predictions...")
        success, data = api_response_handler(
            response=requests.post(url=self.__detect_api_url, headers=self.__headers, json=json_data),
            url=self.__detect_api_url,
            expected_status_code=200
        )

        if not success:
            print("Analysis failed!")
            print(data)
        else:
            print("Analysis completed. Printing results\n")
            print(json.dumps(data, indent=4))
            print("In the next update, this will be added to the dashboard and will be saved in the DB")
