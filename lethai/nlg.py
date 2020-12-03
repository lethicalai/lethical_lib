import os
import webbrowser

import json
import requests
from typing import Callable, Text, Optional, Union
from lethai.utils import api_response_handler


class config:
    def __init__(self, username: Text, api_token: Text) -> None:
        self.__username = username
        self.__headers = {
            'Content-Type': 'application/json',
            'Auth-Key': api_token,
            'Auth-Username': self.__username
        }
        self.__dataset_api_url = 'https://dev.api.lethical.ai/v1/discrimination/nlg/dataset'
        self.__detect_api_url = 'https://dev.api.lethical.ai/v1/discrimination/nlg/detect'
        self.__dataset = None

    def check_discrimination(self, generator: Callable, model_name: Optional[Text] = None) -> None:
        """
        :param generator: Function with string input and returns the prediction of the NLG model as string
        :param model_name: Optional - String name for the model being run.
        :return:
        """
        # Gets the dataset from the backend if not already available in the frontend
        self.__dataset = self.__get_dataset()
        if not self.__dataset:
            return
        print("Dataset retrieved")

        # Generated predictions with their ML model's generator function
        print("Generating predictions...")
        results = self.__generate_output(generator)
        print("Predictions generated")

        # Now results has the generated text from the NLG model for various categories
        # We need to sync this output with the backend and process the biases (if any) in this model
        json_data = dict()
        json_data["data"] = results
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
            print("Analysis completed. Opening browser to show the analysis...")
            config.__open_browser(data)

    def __get_dataset(self) -> Union[dict, None]:
        """
        :return: The input dataset to provide to generator function to get the predictions from user model
        """
        if self.__dataset:
            return self.__dataset
        success, data = api_response_handler(
            response=requests.get(url=self.__dataset_api_url, headers=self.__headers),
            url=self.__dataset_api_url,
            expected_status_code=200
        )
        if not success:
            print(data)
            return None
        return data

    def __generate_output(self, generator: Callable) -> dict:
        """
        :param generator: Function with string input and returns the prediction of the NLG model as string
        :return: Formatted dictionary of predictions runs on the NLG model using the company's input dataset
        """
        # Create an empty dictionary and fill it in the required format
        data = dict()
        for category in self.__dataset:
            data[category] = dict()
            for datapoint in self.__dataset[category]:
                data[category][datapoint] = dict()
                for text in self.__dataset[category][datapoint]:
                    data[category][datapoint][text] = list()
                    # The range can be increased later for better results
                    # To do so we need to make this function faster
                    # Due to current function implementation the range is kept as small as possible
                    # A possible improvement can be to run the generator function async
                    for i in range(1):
                        data[category][datapoint][text].append(generator(text))

        return data

    @staticmethod
    def __open_browser(results) -> None:
        # Update the json file which is used by the html file
        with open(os.path.join(os.path.abspath(os.path.dirname(__file__)), 'public', 'nlg_json.js'), mode='w') as f:
            f.write('var data = {}'.format(json.dumps(results, indent=2)))

        # Change path to reflect file location
        html_file_path = os.path.join(os.path.abspath(
            os.path.dirname(__file__)), 'public', 'nlg.html')
        webbrowser.open_new_tab(html_file_path)