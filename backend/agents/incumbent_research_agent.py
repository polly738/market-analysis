import os
from enum import StrEnum, auto

from dotenv import load_dotenv
from pydantic import BaseModel
from pydantic_ai import Agent, RunContext, WebSearchTool
from pydantic_ai.models.openrouter import OpenRouterModel
from pydantic_ai.providers.openrouter import OpenRouterProvider

load_dotenv()
open_router_key = os.getenv("OPEN_ROUTER_KEY")
model = OpenRouterModel(
    "google/gemini-2.5-flash",
    provider=OpenRouterProvider(api_key=open_router_key),
)


class Incumbent(BaseModel):
    name: str
    unique_company_market_offering: str
    market_position: str


incumbent_research_agent = Agent(
    model,
    builtin_tools=[WebSearchTool()],
    system_prompt="You are a experience junior analyst. You are not aiming to be too eager but provide your boss the user with an excellent report",
    output_type=list[Incumbent],
)
