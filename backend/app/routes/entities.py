"""Entity management API routes"""
from typing import Optional, List
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from app.models.world import Entity, ModelEntity, LightEntity, Vector3, Transform
from app.services.scene_graph import SceneGraphManager

router = APIRouter(prefix="/api", tags=["entities"])

# Global scene graph manager instance
scene_manager = SceneGraphManager()

# Initialize with default entities
scene_manager.create_entity(
    entity_type="model",
    name="Ground Plane",
    model_url=None,
    static=True,
    transform=Transform(position=Vector3(x=0, y=0, z=-0.5)),
)
scene_manager.create_entity(
    entity_type="light",
    name="Sun",
    light_type="directional",
    intensity=1.0,
    color=Vector3(x=1.0, y=1.0, z=1.0),
    transform=Transform(position=Vector3(x=0, y=0, z=10)),
)


class CreateEntityRequest(BaseModel):
    """Request model for creating an entity"""
    type: str = Field(..., description="Entity type: 'entity', 'model', or 'light'")
    name: str = Field(..., description="Human-readable name for the entity")
    transform: Optional[Transform] = Field(
        default=None, description="Entity transformation (optional)"
    )
    model_url: Optional[str] = Field(
        default=None, description="Model URL (for model entities)"
    )
    static: Optional[bool] = Field(
        default=False, description="Static flag (for model entities)"
    )
    light_type: Optional[str] = Field(
        default="directional", description="Light type (for light entities)"
    )
    intensity: Optional[float] = Field(
        default=1.0, description="Light intensity (for light entities)"
    )
    color: Optional[Vector3] = Field(
        default=None, description="Light color (for light entities)"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "type": "model",
                "name": "Robot",
                "transform": {
                    "position": {"x": 0.0, "y": 0.0, "z": 0.0},
                    "rotation": {"x": 0.0, "y": 0.0, "z": 0.0},
                    "scale": {"x": 1.0, "y": 1.0, "z": 1.0},
                },
                "model_url": None,
                "static": False,
            }
        }


@router.get("/entities", response_model=List[Entity])
async def list_entities() -> List[Entity]:
    """
    Get all entities in the scene graph.

    Returns:
        List of all entities
    """
    return scene_manager.list_entities()


@router.get("/entities/{entity_id}", response_model=Entity)
async def get_entity(entity_id: str) -> Entity:
    """
    Get a specific entity by ID.

    Args:
        entity_id: ID of the entity

    Returns:
        The requested entity

    Raises:
        HTTPException: If entity not found (404)
    """
    entity = scene_manager.get_entity(entity_id)
    if entity is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Entity with id '{entity_id}' not found",
        )
    return entity


@router.post("/entities", response_model=Entity, status_code=status.HTTP_201_CREATED)
async def create_entity(request: CreateEntityRequest) -> Entity:
    """
    Create a new entity in the scene graph.

    Args:
        request: Entity creation request

    Returns:
        The created entity

    Raises:
        HTTPException: If entity type is invalid (400)
    """
    try:
        kwargs = {
            "name": request.name,
        }

        if request.transform:
            kwargs["transform"] = request.transform

        if request.type == "model":
            kwargs["model_url"] = request.model_url
            kwargs["static"] = request.static
        elif request.type == "light":
            kwargs["light_type"] = request.light_type
            kwargs["intensity"] = request.intensity
            if request.color:
                kwargs["color"] = request.color

        entity = scene_manager.create_entity(entity_type=request.type, **kwargs)
        return entity
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.delete("/entities/{entity_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_entity(entity_id: str) -> None:
    """
    Delete an entity from the scene graph.

    Args:
        entity_id: ID of the entity to delete

    Raises:
        HTTPException: If entity not found (404)
    """
    deleted = scene_manager.delete_entity(entity_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Entity with id '{entity_id}' not found",
        )
