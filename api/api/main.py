from typing import Union

import fastapi

from . import endpoints

app = fastapi.FastAPI(
    title="coach",
    openapi_url=f"/api/openapi.json",
    generate_unique_id_function=lambda route: route.name,
)


app.include_router(endpoints.weights_router, prefix="/api/weights", tags=["weight"])
app.include_router(endpoints.workouts_router, prefix="/api/workouts", tags=["workout"])
