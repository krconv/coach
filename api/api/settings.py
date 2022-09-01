import pydantic


class _Settings(pydantic.BaseSettings):
    PELOTON_ACCOUNTS: dict[str, dict[str, str]] = {}


settings = _Settings()
