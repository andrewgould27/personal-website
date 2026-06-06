from fastapi import APIRouter

router = APIRouter()

@router.get("/", tags=["info"])
async def iracing_api_info():
    return {
        "health": "ok"
    }

