"""Data models for Gazebo Studio backend"""
from typing import List
from pydantic import BaseModel, Field


class Entity(BaseModel):
    """Represents an entity (model, light, etc.) in the world"""
    id: str = Field(..., description="Unique identifier for the entity")
    type: str = Field(..., description="Type of entity (model, light, etc.)")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "ground_plane",
                "type": "model",
            }
        }


class World(BaseModel):
    """Represents a Gazebo world"""
    name: str = Field(..., description="Name of the world")
    sdfVersion: str = Field(..., description="SDF version used in the world")
    entities: List[Entity] = Field(default_factory=list, description="List of entities in the world")

    class Config:
        json_schema_extra = {
            "example": {
                "name": "default_world",
                "sdfVersion": "1.10",
                "entities": [
                    {"id": "ground_plane", "type": "model"},
                    {"id": "sun", "type": "light"},
                ],
            }
        }
