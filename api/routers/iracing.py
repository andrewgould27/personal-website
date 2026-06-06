import os

import httpx
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/iracing", tags=["iracing"])

_BACKEND = "https://iracing6-backend.herokuapp.com/api"


@router.get("/stats")
async def career_stats():
    member_id = os.environ.get("IRACING_MEMBER_ID")
    if not member_id:
        raise HTTPException(status_code=500, detail="IRACING_MEMBER_ID not configured")

    async with httpx.AsyncClient() as client:
        response = await client.get(f"{_BACKEND}/member-career-stats/career/{member_id}")

    if response.status_code != 200:
        raise HTTPException(status_code=502, detail="Failed to fetch iRacing stats")

    return response.json()
