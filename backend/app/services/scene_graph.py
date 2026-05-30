"""Scene graph management service"""
from typing import Dict, List, Optional
from uuid import uuid4
from app.models.world import Entity, ModelEntity, LightEntity, World


class SceneGraphManager:
    """
    Manages the scene graph entities in memory.
    
    Provides CRUD operations for entities without database persistence.
    """

    def __init__(self):
        """Initialize the scene graph manager with empty entity storage"""
        self._entities: Dict[str, Entity] = {}

    def create_entity(
        self,
        entity_type: str,
        name: str,
        **kwargs,
    ) -> Entity:
        """
        Create a new entity in the scene graph.

        Args:
            entity_type: Type of entity ("model", "light", or "entity")
            name: Human-readable name for the entity
            **kwargs: Additional parameters for the entity type
                For ModelEntity: model_url, static
                For LightEntity: light_type, intensity, color
                For Entity: transform

        Returns:
            The created entity

        Raises:
            ValueError: If entity_type is not supported
        """
        entity_id = str(uuid4())

        if entity_type == "model":
            entity = ModelEntity(id=entity_id, name=name, **kwargs)
        elif entity_type == "light":
            entity = LightEntity(id=entity_id, name=name, **kwargs)
        elif entity_type == "entity":
            entity = Entity(id=entity_id, name=name, **kwargs)
        else:
            raise ValueError(f"Unsupported entity type: {entity_type}")

        self._entities[entity_id] = entity
        return entity

    def delete_entity(self, entity_id: str) -> bool:
        """
        Delete an entity from the scene graph.

        Args:
            entity_id: ID of the entity to delete

        Returns:
            True if entity was deleted, False if entity not found
        """
        if entity_id in self._entities:
            del self._entities[entity_id]
            return True
        return False

    def get_entity(self, entity_id: str) -> Optional[Entity]:
        """
        Get an entity by ID.

        Args:
            entity_id: ID of the entity to retrieve

        Returns:
            The entity if found, None otherwise
        """
        return self._entities.get(entity_id)

    def list_entities(self, entity_type: Optional[str] = None) -> List[Entity]:
        """
        List all entities, optionally filtered by type.

        Args:
            entity_type: Optional entity type to filter by

        Returns:
            List of entities, optionally filtered by type
        """
        entities = list(self._entities.values())

        if entity_type:
            entities = [e for e in entities if e.type == entity_type]

        return entities

    def get_world(self, world_name: str) -> World:
        """
        Get a world with all entities.

        Args:
            world_name: Name of the world

        Returns:
            World object containing all entities
        """
        return World(
            name=world_name,
            sdfVersion="1.10",
            entities=self.list_entities(),
        )

    def clear(self) -> None:
        """Clear all entities from the scene graph"""
        self._entities.clear()

    def get_entity_count(self) -> int:
        """Get the total number of entities in the scene graph"""
        return len(self._entities)
