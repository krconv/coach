from typing import Union

from fastapi import FastAPI

app = FastAPI()


"""
s = requests.Session()
base_url = 'https://api.onepeloton.com'
payload = {'username_or_email': peloton_username, 'password': peloton_pw}
s.post(base_url + '/auth/login', json=payload)

https://github.com/geudrik/peloton-client-library
"""

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


@app.get("/api/health")
def read_root():
    return {"status": "healthy"}
