from time import sleep
from typing import Iterator

import docker
import pytest
from docker.errors import APIError
from neo4j.exceptions import DatabaseUnavailable

from app.db.family_db import FamilyGraph


@pytest.fixture(scope="session")
def neo4j_container():
    """start docker instance of neo4j"""
    client = docker.from_env()

    try:
        # create container
        db_container = client.containers.run(
            "neo4j:latest",
            environment={"NEO4J_AUTH": "none"},
            name="test_db",
            detach=True,
            ports={7687: 7687, 7474: 7474},
        )

    except APIError:
        # docker api returns an error since we already have a container
        # remove existing container and make a new one
        db_container = client.containers.get("test_db")
        db_container.stop()
        db_container.remove()  # type:ignore
        db_container = client.containers.run(
            "neo4j:latest",
            environment={"NEO4J_AUTH": "none"},
            name="test_db",
            detach=True,
            ports={7687: 7687, 7474: 7474},
        )
    # return to calling function so we can use the container
    yield
    # calling function is done so we can stop and remove the container
    db_container.stop()  # type:ignore
    db_container.remove()  # type:ignore


@pytest.fixture
def test_graph(neo4j_container) -> Iterator[FamilyGraph]:
    """create db session and cleanup data after each test"""
    # testing connection string
    DOCKER_HOSTNAME = "localhost:7687"

    db_uri = f"bolt://{DOCKER_HOSTNAME}"
    family_graph = FamilyGraph(db_uri)

    # wait for db to be ready
    # this will only return when db is ready
    family_graph.read_query("RETURN 1")

    yield family_graph

    # clean up our db
    family_graph.clean_db()
