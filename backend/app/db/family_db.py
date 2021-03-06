import neo4j
from neo4j import GraphDatabase


class FamilyGraph:
    def __init__(
        self, uri: str, user: str | None = None, password: str | None = None
    ) -> None:

        self.driver: neo4j.Driver = GraphDatabase.driver(
            uri, auth=(user, password)
        )

    def __enter__(self):
        return self

    def __exit__(self, type, value, traceback):
        self.driver.close()

    def clean_db(self):
        with self.driver.session() as session:
            session.write_transaction(self._clean_db)

    def read_query(self, query: str, query_args: dict[str, str]):

        # create transaction function
        def trans_fn(tx, query_args):
            result = tx.run(query, query_args)
            result_list = []

            for row in result:
                # create dictionary mapping of result keys to result values
                result_values = row.values(*result.keys())
                result_dict = dict(zip(result.keys(), result_values))
                result_list.append(result_dict)

            return result_list

        # use self context manager to close driver after use
        with self:
            with self.driver.session() as session:
                result = session.read_transaction(trans_fn, query_args)

        return result

    def write_query(self, query: str, query_args: dict[str, str]):

        # create transaction function
        def trans_fn(tx, query_args):
            result = tx.run(query, query_args)
            result_list = []

            for row in result:
                # create dictionary mapping of result keys to result values
                result_values = row.values(*result.keys())
                result_dict = dict(zip(result.keys(), result_values))
                result_list.append(result_dict)

            return result_list

        # use self context manager to close driver after use
        with self:
            with self.driver.session() as session:
                result = session.write_transaction(trans_fn, query_args)

        return result

    @staticmethod
    def _clean_db(
        tx: neo4j.Transaction,
    ):
        tx.run("MATCH (n) DETACH DELETE(n)")
