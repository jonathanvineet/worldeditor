"""World API routes"""
from fastapi import APIRouter
from app.models.world import World, Entity

router = APIRouter(prefix="/api", tags=["world"])

# In-memory world data storage
worlds = {
    "default": World(
        name="default_world",
        sdfVersion="1.10",
        entities=[
            Entity(id="ground_plane", type="model"),
            Entity(id="sun", type="light"),
        ],
    )
}


@router.get("/world/default", response_model=World)
async def get_default_world() -> World:
    """
    Get the default world.
    
    Returns:
        World: The default world with entities
    """
    return worlds["default"]
