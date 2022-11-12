from unittest import mock

from app.db import FamilyGraph
from app.db.transactions import create


class TestCreate:
    def test_create_person(self, test_graph: FamilyGraph):
        with mock.patch("app.db.transactions.create.family_graph", test_graph):
            created_person_id = create.create_person("create_person_test")[0][
                "id"
            ]
            found_person = test_graph.write_query("MATCH (p) RETURN p")[0]["p"]

        assert created_person_id == found_person["id"]

    def test_create_child(self, test_graph: FamilyGraph):
        # create parents
        parent1_id = "p1"
        parent2_id = "p2"
        test_graph.write_query(
            "CREATE (:Person { id: $p1_id  }) CREATE (:Person { id: $p2_id  })",
            {"p1_id": parent1_id, "p2_id": parent2_id},
        )

        created_family = create.create_child(
            "test_child", parent1_id, parent2_id
        )

        assert created_family[0]["parent1"]["id"] == parent1_id  # type:ignore
        assert created_family[0]["parent2"]["id"] == parent2_id  # type:ignore
        assert (
            created_family[0]["child"]["name"] == "test_child"  # type:ignore
        )

    def test_add_child(self, test_graph: FamilyGraph):
        # create parents and child
        parent1_id = "p1"
        child_id = "c1"
        test_graph.write_query(
            "CREATE (:Person { id: $p1_id  }) CREATE (:Person { id: $c1_id  })",
            {"p1_id": parent1_id, "c1_id": child_id},
        )
        created_family = create.add_child(child_id, parent1_id)

        assert created_family[0]["child"]["id"] == child_id  # type:ignore

    def test_create_marriage(self, test_graph: FamilyGraph):
        person1_id = "p1"
        person2_id = "p2"
        test_graph.write_query(
            "CREATE (:Person { id: $p1_id  }) CREATE (:Person { id: $p2_id  })",
            {"p1_id": person1_id, "p2_id": person2_id},
        )
        created_marriage = create.create_marriage(person1_id, person2_id)[0]

        assert created_marriage["person1"]["id"] == person1_id  # type:ignore
        assert created_marriage["person2"]["id"] == person2_id  # type:ignore
