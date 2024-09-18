class LoginService:
    def __init__(self):
        self._admin_username = 'Lesya'
        self._admin_password = 'Admin123'

        self._admin_token_key = 'admin'
        self._admin_token_value = 'e0380cca-93ba-409d-9d3e-d38287964a94'
        self._admin_token_max_age = 60 * 60 * 24 * 365

    def validate_credentials(self, username: str, password: str) -> bool:
        return username == self._admin_username and password == self._admin_password

    def login(self, resp):
        resp.set_cookie(self._admin_token_key, self._admin_token_value, max_age=self._admin_token_max_age)
        return resp
