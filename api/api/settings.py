import json
from typing import Any, Literal

import google.auth.credentials
import google.cloud.secretmanager
import pydantic


class _Settings(pydantic.BaseSettings):
    ENV: Literal["prod", "dev"] = "dev"

    PELOTON_ACCOUNTS: dict[str, dict[str, str]] = {}

    GOOGLE_CLOUD_PROJECT: str = "<unknown>"

    class Config:
        @classmethod
        def customise_sources(
            cls,
            init_settings: pydantic.env_settings.SettingsSourceCallable,
            env_settings: pydantic.env_settings.SettingsSourceCallable,
            file_secret_settings: pydantic.env_settings.SettingsSourceCallable,
        ):
            return (env_settings, init_settings, _google_cloud_secrets_source)


class _GoogleCloudSettings(pydantic.BaseSettings):
    GOOGLE_CLOUD_PROJECT: str | None = None

    SECRETS: dict[str, str] = {"PELOTON_ACCOUNTS": "peloton-accounts"}


def _google_cloud_secrets_source(_: pydantic.BaseSettings) -> dict[str, Any]:
    google_cloud_settings = _GoogleCloudSettings()
    if google_cloud_settings.GOOGLE_CLOUD_PROJECT is None:
        return

    try:
        client = google.cloud.secretmanager.SecretManagerServiceClient()
    except:
        return {}

    overrides = {}
    for setting, secret in google_cloud_settings.SECRETS.items():
        value = client.access_secret_version(
            name=f"projects/{google_cloud_settings.GOOGLE_CLOUD_PROJECT}/secrets/{secret}/versions/latest"
        )
        overrides[setting] = json.loads(value.payload.data.decode())
    return overrides


settings = _Settings()
