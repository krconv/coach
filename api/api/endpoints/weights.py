import fastapi

router = fastapi.APIRouter()


@router.get("/", response_model=dict)
def read_root():
    return {"test1": "World"}
