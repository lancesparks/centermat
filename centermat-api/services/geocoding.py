import httpx
from decimal import Decimal
from dataclasses import dataclass

@dataclass
class GeocodeResult:
    latitude: Decimal
    longitude: Decimal
    display_name: str

def geocode(address: str) -> GeocodeResult | None:
    resp = httpx.get(
        "https://nominatim.openstreetmap.org/search",
        params={"q": address, "format": "json", "limit": 1},
        headers={"User-Agent": "centermat/1.0 (your-email@example.com)"},  # required by their policy
        timeout=10.0,
    )
    resp.raise_for_status()
    results = resp.json()
    if not results:
        return None
    top = results[0]
    return GeocodeResult(
        latitude=Decimal(top["lat"]),
        longitude=Decimal(top["lon"]),
        display_name=top["display_name"],
    )