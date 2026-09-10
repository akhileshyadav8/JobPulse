from app.connectors.base import ATSConnector
from app.connectors.greenhouse import GreenhouseConnector
from app.connectors.lever import LeverConnector
from app.connectors.ashby import AshbyConnector
from app.connectors.teamtailor import TeamTailorConnector
# Importing later:
# from app.connectors.workday import WorkdayConnector
# from app.connectors.custom_scraper import CustomScraper

def get_connector(ats_type: str) -> ATSConnector:
    connectors = {
        "greenhouse": GreenhouseConnector,
        "lever": LeverConnector,
        "ashby": AshbyConnector,
        "teamtailor": TeamTailorConnector,
    }
    connector_class = connectors.get(ats_type)
    if not connector_class:
        # Fallback to custom scraper, to be implemented
        from app.connectors.custom_scraper import CustomScraper
        return CustomScraper()
    return connector_class()
