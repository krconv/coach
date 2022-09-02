from typing import Literal

import pydantic


class _Settings(pydantic.BaseSettings):
    ENV: Literal["prod", "dev"] = "dev"
    PELOTON_ACCOUNTS: dict[str, dict[str, str]] = {}


settings = _Settings()
