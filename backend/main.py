import argparse
import asyncio
import os
from enum import StrEnum, auto

from agents.emerging_competitors_agent import emerging_competitors_agent
from agents.incumbent_research_agent import incumbent_research_agent
from agents.market_sizing_agent import market_sizing_agent
from agents.senior_agent import generate_decision


async def main(market, company):
    response = await generate_decision(market, company)
    print(response)
    return response


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--market", required=True)
    parser.add_argument("--company", required=True)
    args = parser.parse_args()
    asyncio.run(main(market=args.market, company=args.company))
