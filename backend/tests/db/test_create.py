from app.db.transactions import create, delete, find


def test_create_person():
    created_person_id = create.create_person("create_person_test")[0]["id"]
    found_person = find.find_person_by_id(created_person_id)[0]["props"]

    assert created_person_id == found_person["id"]

    # cleanup created person
    delete.delete_person(created_person_id)


def test_create_child(temp_person_factory):
    # create parents
    family_ids = temp_person_factory(2)
    parent1_id, parent2_id = family_ids

    created_family = create.create_child("test_child", parent1_id, parent2_id)

    assert created_family[0]["parent1"]["id"] == parent1_id
    assert created_family[0]["parent2"]["id"] == parent2_id
    assert created_family[0]["child"]["name"] == "test_child"

    # cleanup child creation
    delete.delete_person(created_family[0]["child"]["id"])


def test_add_child(temp_person_factory):
    # create parents and child
    parent1_id, parent2_id, child_id = temp_person_factory(3)

    created_family = create.add_child(child_id, parent1_id, parent2_id)

    assert created_family[0]["child"]["id"] == child_id


def test_create_marriage(temp_person_factory):
    person1_id, person2_id = temp_person_factory(2)
    created_marriage = create.create_marriage(person1_id, person2_id)[0]

    assert created_marriage["person1"]["id"] == person1_id
    assert created_marriage["person2"]["id"] == person2_id
