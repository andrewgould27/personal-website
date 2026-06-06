from fastapi import FastAPI

from routers import iracing

app = FastAPI()

app.include_router(iracing.router, prefix="/api")


@app.get("/health")
def health():
    return {"status": "ok"}
