"""Data models for Gazebo Studio backend"""
from typing import List, Optional, Literal
from pydantic import BaseModel, Field


class Vector3(BaseModel):
    """3D vector with x, y, z coordinates"""
    x: float = Field(default=0.0, description="X coordinate")
    y: float = Field(default=0.0, description="Y coordinate")
    z: float = Field(default=0.0, description="Z coordinate")

    class Config:
        json_schema_extra = {
            "example": {"x": 0.0, "y": 0.0, "z": 0.0}
        }


class Transform(BaseModel):
    """3D transformation with position, rotation, and scale"""
    position: Vector3 = Field(default_factory=lambda: Vector3(), description="Position in world space")
    rotation: Vector3 = Field(default_factory=lambda: Vector3(), description="Rotation in degrees (euler angles)")
    scale: Vector3 = Field(default_factory=lambda: Vector3(x=1.0, y=1.0, z=1.0), description="Scale factor")

    class Config:
        json_schema_extra = {
            "example": {
                "position": {"x": 0.0, "y": 0.0, "z": 0.0},
                "rotation": {"x": 0.0, "y": 0.0, "z": 0.0},
                "scale": {"x": 1.0, "y": 1.0, "z": 1.0},
            }
        }


class Entity(BaseModel):
    """Base class for entities in the scene"""
    id: str = Field(..., description="Unique identifier for the entity")
    type: Literal["entity"] = Field(default="entity", description="Entity type")
    name: str = Field(..., description="Human-readable name")
    transform: Transform = Field(default_factory=Transform, description="Entity transformation")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "entity_001",
                "type": "entity",
                "name": "Generic Entity",
                "transform": {
                    "position": {"x": 0.0, "y": 0.0, "z": 0.0},
                    "rotation": {"x": 0.0, "y": 0.0, "z": 0.0},
                    "scale": {"x": 1.0, "y": 1.0, "z": 1.0},
                },
            }
        }


class ModelEntity(Entity):
    """Represents a model entity in the scene"""
    type: Literal["model"] = Field(default="model", description="Entity type")
    model_url: Optional[str] = Field(default=None, description="URL or path to model file")
    static: bool = Field(default=False, description="Whether the model is static")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "ground_plane",
                "type": "model",
                "name": "Ground Plane",
                "transform": {
                    "position": {"x": 0.0, "y": 0.0, "z": -0.5},
                    "rotation": {"x": 0.0, "y": 0.0, "z": 0.0},
                    "scale": {"x": 1.0, "y": 1.0, "z": 1.0},
                },
                "model_url": None,
                "static": True,
            }
        }


class LightEntity(Entity):
    """Represents a light entity in the scene"""
    type: Literal["light"] = Field(default="light", description="Entity type")
    light_type: Literal["directional", "point", "spot"] = Field(
        default="directional", description="Type of light"
    )
    intensity: float = Field(default=1.0, ge=0.0, le=1.0, description="Light intensity (0-1)")
    color: Vector3 = Field(
        default_factory=lambda: Vector3(x=1.0, y=1.0, z=1.0),
        description="Light color in RGB (0-1 range)"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "id": "sun",
                "type": "light",
                "name": "Sun",
                "transform": {
                    "position": {"x": 0.0, "y": 0.0, "z": 10.0},
                    "rotation": {"x": 0.0, "y": 0.0, "z": 0.0},
                    "scale": {"x": 1.0, "y": 1.0, "z": 1.0},
                },
                "light_type": "directional",
                "intensity": 1.0,
                "color": {"x": 1.0, "y": 1.0, "z": 1.0},
            }
        }


class World(BaseModel):
    """Represents a Gazebo world"""
    name: str = Field(..., description="Name of the world")
    sdfVersion: str = Field(default="1.10", description="SDF version used in the world")
    entities: List[Entity] = Field(default_factory=list, description="List of entities in the world")

    class Config:
        json_schema_extra = {
            "example": {
                "name": "default_world",
                "sdfVersion": "1.10",
                "entities": [
                    {
                        "id": "ground_plane",
                        "type": "model",
                        "name": "Ground Plane",
                        "transform": {
                            "position": {"x": 0.0, "y": 0.0, "z": -0.5},
                            "rotation": {"x": 0.0, "y": 0.0, "z": 0.0},
                            "scale": {"x": 1.0, "y": 1.0, "z": 1.0},
                        },
                        "model_url": None,
                        "static": True,
                    },
                    {
                        "id": "sun",
                        "type": "light",
                        "name": "Sun",
                        "transform": {
                            "position": {"x": 0.0, "y": 0.0, "z": 10.0},
                            "rotation": {"x": 0.0, "y": 0.0, "z": 0.0},
                            "scale": {"x": 1.0, "y": 1.0, "z": 1.0},
                        },
                        "light_type": "directional",
                        "intensity": 1.0,
                        "color": {"x": 1.0, "y": 1.0, "z": 1.0},
                    },
                ],
            }
        }
