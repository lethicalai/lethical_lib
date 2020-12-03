import requests
from typing import List, Tuple, Text, Union
from lethai.utils import api_response_handler


def gender_tag_dataset(username: Text, api_token: Text, dataset: List) -> Union[List[Tuple[Text, Text]], None]:
    """
    :param api_token: API token to access this function
    :param username: Username associated with the API token
    :param dataset: List of words from a dataset. It should not contains any comma(','), fullstops('.') or
    any other kind of delimiter.
    :return: List of tuples of word and gender tag (f - "female", m - "male", n - "neutral")
    """
    __api_url = 'https://dev.api.lethical.ai/v1/feature/gender-tag-dataset'
    __headers = {
        'Content-Type': 'application/json',
        'Auth-Key': api_token,
        'Auth-Username': username
    }
    __json_data = {
        "dataset": dataset
    }
    success, data = api_response_handler(
        response=requests.post(url=__api_url, headers=__headers, json=__json_data),
        url=__api_url,
        expected_status_code=200
    )
    if not success:
        print(data)
        return None

    return list(map(lambda x: (x[0], x[1]), data))
