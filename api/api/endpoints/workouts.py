import asyncio
import datetime
import enum

import aiohttp
import fastapi
import pydantic
from api import settings

router = fastapi.APIRouter()


class _PelotonAccount:
    name: str
    _username: str
    _password: str
    _session_id: str | None = None
    _user_id: str | None = None

    def __init__(self, name: str, username: str, password: str):
        self.name = name
        self._username = username
        self._password = password

    async def fetch_workouts(self) -> list["PelotonWorkout"]:
        await self._reauthenticate_if_needed()

        async with self._client() as client:
            response = await client.get(
                f"/api/user/{self._user_id}/workouts?joins=ride&limit=100&page=0"
            )
            workouts = (await response.json())["data"]
            return [
                PelotonWorkout(
                    id=workout["id"],
                    name=workout["name"],
                    created_at=datetime.datetime.fromtimestamp(workout["created_at"]),
                    is_complete=workout["status"] == "COMPLETE",
                    discipline=workout["fitness_discipline"],
                    duration=datetime.timedelta(seconds=workout["ride"]["duration"])
                    if workout["ride"]["duration"]
                    else None,
                )
                for workout in workouts
            ]

    async def _reauthenticate_if_needed(self):
        if not await self._is_authenticated():
            await self._reauthenticate()

    async def _is_authenticated(self) -> bool:
        if self._session_id is None or self._user_id is None:
            return False

        async with self._client() as client:
            response = await client.get(
                "/api/me",
            )
            return response.status == 200

    async def _reauthenticate(self):
        async with self._client(include_auth=False) as client:
            response = await client.post(
                "/auth/login",
                json={
                    "username_or_email": "KodeyConverse",
                    "password": "AfPhuoVxNv8-FeqniE*C",
                },
            )
            data = await response.json()
            self._session_id = data["session_id"]
            self._user_id = data["user_id"]

    def _client(self, include_auth: bool = True) -> aiohttp.ClientSession:
        return aiohttp.ClientSession(
            base_url="https://api.onepeloton.com",
            headers={"Cookie": f"peloton_session_id={self._session_id}"}
            if include_auth
            else {},
        )


class PelotonDiscipline(str, enum.Enum):
    meditation = "meditation"
    cycling = "cycling"
    stretching = "stretching"
    yoga = "yoga"
    strength = "strength"


class PelotonWorkout(pydantic.BaseModel):
    id: str
    name: str
    created_at: datetime.datetime
    is_complete: bool
    discipline: PelotonDiscipline | str
    duration: datetime.timedelta | None


accounts = [
    _PelotonAccount(
        name=name, username=credentials["username"], password=credentials["password"]
    )
    for name, credentials in settings.PELOTON_ACCOUNTS.items()
]


@router.get("/", response_model=dict[str, list[PelotonWorkout]])
async def read_root():
    all_workouts = await asyncio.gather(
        *[account.fetch_workouts() for account in accounts]
    )

    return {account.name: workouts for account, workouts in zip(accounts, all_workouts)}
