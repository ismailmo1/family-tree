import pytest
from app.db.transactions import create, delete


@pytest.fixture
def temp_person_factory():
    """Factory func to create temporary people nodes

    Yields:
        function: _create_temp(num_people:int) -> create temporary nodes with cleanup after yielding
    """
    people_ids = []

    def _create_temp(num_people: int):
        for i in range(num_people):
            people_ids.append(
                create.create_person(person_name=f"temp{i}")[0]["id"]
            )
        return people_ids

    yield _create_temp

    # remove temp people
    for id in people_ids:
        delete.delete_person(id)
