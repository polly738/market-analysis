from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from agents.senior_agent import SeniorAgentDecision, generate_decision

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class IdeaRequest(BaseModel):
    market: str
    company: str


@app.post("/analyze")
async def idea(request: IdeaRequest) -> SeniorAgentDecision:
    decison = await generate_decision(request.market, request.company)
    print(decison)
    return decison


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8080)
