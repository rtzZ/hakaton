import os
from functools import wraps
import requests
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBasic, HTTPBearer, HTTPAuthorizationCredentials
from requests.auth import HTTPBasicAuth


class ServiceSender:
    """ Интерфейс обмена между сервисами """
    def __init__(self, username: str, auth: HTTPAuthorizationCredentials, auth_type: str, role: str):
        self.username = username
        self.auth = auth
        self.params = dict(app_role=role)
        self.auth_type = auth_type

    def send_request(self, url: str, method: str, params: dict = None, headers: dict = None) -> dict:
        if headers:
            headers.update({'accept': 'application/json', 'Content-Type': 'application/json'})
        else:
            headers = {'accept: application/json'}
        if params:
            self.params.update(params)

        resp = {}
        if method == 'POST':
            resp = requests.post(url=url, auth=self.auth, params=self.params, headers=headers)
        if method == 'GET':
            resp = requests.get(url=url, auth=self.auth, params=self.params, headers=headers)
        if method == 'PUT':
            resp = requests.put(url=url, auth=self.auth, params=self.params, headers=headers)
        if method == 'DELETE':
            resp = requests.delete(url=url, auth=self.auth, params=self.params, headers=headers)
        return resp


class Authorization:
    """ Авторизация """
    def __init__(self, role: str):
        self.role = role
        self.url = f"http://{os.environ.get('AUTH_APP_HOST')}:{str(os.environ.get('AUTH_APP_PORT'))}/sign-in"

    def __call__(self,
                 basic_auth: HTTPAuthorizationCredentials = Depends(HTTPBasic(auto_error=False)),
                 bearer_auth: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False))):
        basic = self.basic_auth(basic_auth) if basic_auth else None
        bearer = self.bearer_auth(bearer_auth) if bearer_auth else None
        if not (basic or bearer):
            raise HTTPException(status_code=401, detail="Not authenticated")
        if basic:
            return ServiceSender(username=basic[1], auth=basic_auth, auth_type='Basic', role=self.role)
        return ServiceSender(username=bearer[1], auth=bearer_auth,  auth_type='Bearer', role=self.role)

    def basic_auth(self, auth: HTTPAuthorizationCredentials):
        auth = HTTPBasicAuth(auth.username, auth.password)
        role = dict(app_role=self.role)
        resp = requests.post(url=self.url, auth=auth, params=role if role else {})
        if resp.status_code == 401:
            raise HTTPException(status_code=401, detail="Not authenticated")
        return True, auth.username

    def bearer_auth(self, auth: HTTPAuthorizationCredentials):
        headers = dict(Authorization=f"Bearer {auth.credentials}")
        role = dict(app_role=self.role)
        resp = requests.post(url=self.url, headers=headers, params=role if role else {})
        if resp.status_code == 401:
            raise HTTPException(status_code=401, detail="Not authenticated")
        return True, resp.json().get('username')