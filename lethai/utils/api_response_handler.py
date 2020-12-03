import json
from typing import Text, Any, Tuple


def api_response_handler(response, url: Text, expected_status_code: int) -> Tuple[bool, Any]:
    """
    :param response: The response object returned by the requests library API call
    :param url: The URL which was called
    :param expected_status_code: The 2xx code which is expected by the API call to be considered a successful response
    :return: An appropriately formatted error string (error case) or the body of the response (successful case)
    """

    if response.status_code >= 500:
        return False, '[!] [{}] Server Error'.format(response.status_code)
    elif response.status_code == 404:
        return False, '[!] [{}] URL not found: [{}]'.format(response.status_code, url)
    elif response.status_code == 403:
        return False, '[!] [{}] Unauthorized Access'.format(response.status_code)
    elif response.status_code == 401:
        return False, '[!] [{}] Authentication Failed'.format(response.status_code)
    elif response.status_code >= 400:
        return False, '[!] [{}] Bad Request'.format(response.status_code)
    elif response.status_code >= 300:
        return False, '[!] [{}] Unexpected redirect.'.format(response.status_code)
    elif response.status_code != expected_status_code:
        return False, '[?] Unexpected Error: [HTTP {}]: Content: {}'.format(
            response.status_code, response.content)

    return True, json.loads(response.content) if response.content else None
