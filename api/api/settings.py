import json
from typing import Any, Literal

import google.auth.credentials
import google.cloud.secretmanager
import pydantic


class _Settings(pydantic.BaseSettings):
    ENV: Literal["prod", "dev"] = "dev"

    PELOTON_ACCOUNTS: dict[str, dict[str, str]] = {}

    LOG_LEVEL: str = "DEBUG"

    GOOGLE_CLOUD_PROJECT: str = "<unknown>"
    SECRETS: dict[str, str] = {"PELOTON_ACCOUNTS": "peloton-accounts"}

    def on_startup(self):
        if self.GOOGLE_CLOUD_PROJECT == "<unknown>":
            return

        client = google.cloud.secretmanager.SecretManagerServiceClient()
        for setting, secret in self.SECRETS.items():
            value = client.access_secret_version(
                name=f"projects/{self.GOOGLE_CLOUD_PROJECT}/secrets/{secret}/versions/latest"
            )
            self.__setattr__(setting, json.loads(value.payload.data.decode()))


settings = _Settings()
