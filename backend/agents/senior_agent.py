import os
from enum import StrEnum, auto

from dotenv import load_dotenv
from pydantic import BaseModel
from pydantic_ai import Agent, RunContext, WebSearchTool
from pydantic_ai.models.openrouter import OpenRouterModel
from pydantic_ai.providers.openrouter import OpenRouterProvider

from agents.emerging_competitors_agent import (
    EmergingCompetitorLandScape,
    emerging_competitors_agent,
)
from agents.incumbent_research_agent import (
    Incumbent,
    incumbent_research_agent,
)
from agents.market_sizing_agent import (
    MarketSize,
    market_sizing_agent,
)

load_dotenv()
open_router_key = os.getenv("OPEN_ROUTER_KEY")
model = OpenRouterModel(
    "google/gemini-2.5-flash",
    provider=OpenRouterProvider(api_key=open_router_key),
)


class SeniorAgentDecision(BaseModel):
    go: bool
    summary: str


senior_agent = Agent(
    model,
    builtin_tools=[WebSearchTool()],
    system_prompt="You are a expierenced senior buiness analyst",
    output_type=SeniorAgentDecision,
)


@senior_agent.tool
async def run_emerging_competitors_agent(
    ctx: RunContext[None], market: str
) -> EmergingCompetitorLandScape:
    """Runs an agent that analysis the emerging competitors and returns there names and funding history as well as the velocity of capital flowing into this industry"""
    competitors = await emerging_competitors_agent.run(
        f"what are the emerging competitors in the {market}"
    )
    return competitors.output


@senior_agent.tool
async def run_incumbent_research_agent(
    ctx: RunContext[None], market: str
) -> list[Incumbent]:
    """Runs an agent that analyses incumbents in the market that you are researching and returns there names and market position"""
    incumbents = await incumbent_research_agent.run(
        f"what are the incumbents in the {market} market"
    )
    return incumbents.output


@senior_agent.tool
async def run_market_sizing_agent(ctx: RunContext[None], market: str) -> MarketSize:
    """Runs an agent that determines the size of the market"""
    market_size = await market_sizing_agent.run(
        f"do a market size analysis of the {market} market"
    )
    return market_size.output


async def generate_decision(market: str, company: str) -> SeniorAgentDecision:
    decision = await senior_agent.run(
        f"Do an analyse of {company} entering into the {market} market, Use tools to determine if there is room inside of the market for incumbent to either be displace or replaced. Moreover in you decision determine the market size and opportuntiy of that size would be condusive to finical success. Also looking a emerging competitors and determine if there is a strategy you can copy. Make sure that the company has the ability to transistion into that market also. Be skepictal when making a decision"
    )
    return decision.output
