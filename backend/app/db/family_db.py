import neo4j
from app.db.transactions.types import TransactionType
from dotenv import load_dotenv
from neo4j import GraphDatabase


class FamilyGraph:
    def __init__(self, uri: str, user: str, password: str) -> None:

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

    def transaction(self, trans_type: TransactionType):
        def trans_wrapper(query_func):
            def wrapper(*args, **kwargs):
                query, query_args = query_func(*args, **kwargs)

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
                        if trans_type == TransactionType.READ:
                            result = session.read_transaction(
                                trans_fn, query_args
                            )
                        if trans_type == TransactionType.WRITE:
                            result = session.write_transaction(
                                trans_fn, query_args
                            )

                    return result

            return wrapper

        return trans_wrapper

    @staticmethod
    def _clean_db(
        tx: neo4j.Transaction,
    ):
        tx.run("MATCH (n) DETACH DELETE(n)")
