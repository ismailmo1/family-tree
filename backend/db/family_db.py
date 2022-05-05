import logging
import os

import neo4j
from dotenv import load_dotenv
from neo4j import GraphDatabase
from neo4j.exceptions import ServiceUnavailable

load_dotenv("./.env")


class FamilyGraph:
    def __init__(
        self, uri: str, user: str, password: str
    ) -> neo4j.Driver | neo4j.BoltDriver:

        self.driver: neo4j.Driver = GraphDatabase.driver(
            uri, auth=(user, password)
        )

    def __enter__(self):
        return self

    def __exit__(self, type, value, traceback):
        self.driver.close()

    def create_single(self, person_name: str) -> None:
        with self.driver.session() as session:
            # write_transaction takes transaction fn as first arg, and rest are passed as *args, **kwargs to the fn
            result = session.write_transaction(
                self._create_and_return_single, person_name
            )
        print(f"Created a loner: {person_name}")

    @staticmethod
    def _create_and_return_single(
        tx: neo4j.Transaction, person_name: str
    ) -> list[dict[str, str]]:
        query = (
            "CREATE (person:Person { name: $person_name }) " "RETURN person"
        )
        result = tx.run(query, person_name=person_name)
        try:
            return [
                {
                    "person": row["person"]["name"],
                }
                for row in result
            ]
        # Capture any errors along with the query and data for traceability
        except ServiceUnavailable as exception:
            logging.error(
                "{query} raised an error: \n {exception}".format(
                    query=query, exception=exception
                )
            )
            raise

    def create_marriage(self, person1_name: str, person2_name: str) -> None:
        with self.driver.session() as session:
            # write_transaction takes transaction fn as first arg, and rest are passed as *args, **kwargs to the fn
            result = session.write_transaction(
                self._create_and_return_marriage, person1_name, person2_name
            )
        print(f"Created marriage between: {person1_name} and {person2_name}")

    @staticmethod
    def _create_and_return_marriage(
        tx: neo4j.Transaction, person1_name: str, person2_name: str
    ) -> list[dict[str, str]]:
        # To learn more about the Cypher syntax, see https://neo4j.com/docs/cypher-manual/current/
        # The Reference Card is also a good resource for keywords https://neo4j.com/docs/cypher-refcard/current/
        query = (
            "MATCH (person1:Person { name: $person1_name }) "
            "MATCH (person2:Person { name: $person2_name }) "
            "CREATE (person1)-[:SPOUSE_OF]->(person2) "
            "RETURN person1, person2"
        )
        result = tx.run(
            query, person1_name=person1_name, person2_name=person2_name
        )
        try:
            return [
                {
                    "person1": row["person1"]["name"],
                    "person2": row["person2"]["name"],
                }
                for row in result
            ]
        # Capture any errors along with the query and data for traceability
        except ServiceUnavailable as exception:
            logging.error(
                "{query} raised an error: \n {exception}".format(
                    query=query, exception=exception
                )
            )
            raise

    def create_child(
        self, child_name: str, parent1_name: str, parent2_name: str
    ) -> None:
        """Creates a child node and a relationship to parents, order of parents is irrelevant

        Args:
            child_name (str): child name
            parent1_name (str): name of first parent
            parent2_name (str): name of second parent
        """
        with self.driver.session() as session:
            # write_transaction takes transaction fn as first arg, and rest are passed as *args, **kwargs to the fn
            result = session.write_transaction(
                self._create_and_return_child,
                child_name,
                parent1_name,
                parent2_name,
            )
            for row in result:
                print(
                    "Created child: {child} for {parent1} and {parent2}".format(
                        child=row["child"],
                        parent1=row["parent1"],
                        parent2=row["parent2"],
                    )
                )

    @staticmethod
    def _create_and_return_child(
        tx: neo4j.Transaction,
        child_name: str,
        parent1_name: str,
        parent2_name: str,
    ) -> list[dict[str, str]]:
        # To learn more about the Cypher syntax, see https://neo4j.com/docs/cypher-manual/current/
        # The Reference Card is also a good resource for keywords https://neo4j.com/docs/cypher-refcard/current/
        query = (
            "MATCH (parent1:Person { name: $parent1_name})"
            "MATCH (parent2:Person { name: $parent2_name})"
            "CREATE (child:Person { name: $child_name }) "
            "CREATE (child)-[:CHILD_OF]-> (parent1)"
            "CREATE (child)-[:CHILD_OF]->(parent2)"
            "RETURN child, parent1, parent2"
        )
        result = tx.run(
            query,
            child_name=child_name,
            parent1_name=parent1_name,
            parent2_name=parent2_name,
        )
        try:
            return [
                {
                    "parent1": row["parent1"]["name"],
                    "parent2": row["parent2"]["name"],
                    "child": row["child"]["name"],
                }
                for row in result
            ]
        # Capture any errors along with the query and data for traceability
        except ServiceUnavailable as exception:
            logging.error(
                "{query} raised an error: \n {exception}".format(
                    query=query, exception=exception
                )
            )
            raise
