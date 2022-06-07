from app.db.transactions import find


def test_find_person_by_name():
    expected_id = "2"
    found_person_id = find.find_person_by_name("family1_mum")[0]["id"]
    assert expected_id == found_person_id


def test_find_person_properties():
    expected_props = {
        "props": {"name": "grandad", "id": "a", "dob": "01/01/1960"}
    }
    found_props = find.find_person_by_id("a")[0]
    assert found_props == expected_props


def test_find_spouse():
    expected_spouse_id = "2"
    found_spouse_id = find.find_spouse(id="1")[0]["id"]
    assert found_spouse_id == expected_spouse_id


def test_find_parents():
    expected_parents = [
        {"id": "1", "name": "family1_dad"},
        {"id": "2", "name": "family1_mum"},
    ]
    found_parents_3 = find.find_parents("3")
    found_parents_4 = find.find_parents("4")
    assert sorted(found_parents_3, key=lambda x: x["id"]) == expected_parents
    assert sorted(found_parents_4, key=lambda x: x["id"]) == expected_parents


def test_find_children():
    expected_children = [
        {"id": "3", "name": "family1_child1"},
        {"id": "4", "name": "family1_child2"},
        {"id": "5", "name": "family1_child3"},
        {"id": "6", "name": "family1_child4"},
        {"id": "8", "name": "family1_stepchild"},
    ]
    found_children = find.find_children("1")
    assert sorted(found_children, key=lambda x: x["id"]) == expected_children


def test_find_full_siblings():
    expected_siblings = [
        {"id": "4", "name": "family1_child2"},
        {"id": "5", "name": "family1_child3"},
        {"id": "6", "name": "family1_child4"},
    ]
    found_siblings = find.find_full_siblings("3")
    assert sorted(found_siblings, key=lambda x: x["id"]) == expected_siblings


def test_find_all_siblings():
    expected_siblings = [
        {"id": "4", "name": "family1_child2"},
        {"id": "5", "name": "family1_child3"},
        {"id": "6", "name": "family1_child4"},
        {"id": "8", "name": "family1_stepchild"},
    ]
    found_siblings = find.find_all_siblings("3")

    assert sorted(found_siblings, key=lambda x: x["id"]) == expected_siblings


def test_find_siblings():
    found_full_siblings = find.find_siblings("4", full_only=True)
    found_all_siblings = find.find_siblings("4", full_only=False)
    expected_full_siblings = [
        {"id": "3", "name": "family1_child1"},
        {"id": "5", "name": "family1_child3"},
        {"id": "6", "name": "family1_child4"},
    ]
    expected_all_siblings = [
        {"id": "3", "name": "family1_child1"},
        {"id": "5", "name": "family1_child3"},
        {"id": "6", "name": "family1_child4"},
        {"id": "8", "name": "family1_stepchild"},
    ]

    assert (
        sorted(found_full_siblings, key=lambda x: x["id"])
        == expected_full_siblings
    )
    assert (
        sorted(found_all_siblings, key=lambda x: x["id"])
        == expected_all_siblings
    )


def test_find_cousins():
    expected_cousins = [
        {
            "parent.id": "1",
            "parent.name": "family1_dad",
            "unc_aunt.name": "family2_dad",
            "unc_aunt.id": "9",
            "cousins.name": "family2_child1",
            "cousins.id": "11",
        },
        {
            "parent.id": "1",
            "parent.name": "family1_dad",
            "unc_aunt.name": "family2_dad",
            "unc_aunt.id": "9",
            "cousins.name": "family2_child2",
            "cousins.id": "12",
        },
    ]
    found_cousins = find.find_cousins("6")
    assert (
        sorted(found_cousins, key=lambda x: x["cousins.id"])
        == expected_cousins
    )


def test_find_relationship():
    found_relationship = find.find_relationship_path("11", "2")

    assert len(found_relationship) == 4
    assert found_relationship[0].type == "CHILD_OF"
    assert found_relationship[1].end_node.id == 7
    assert found_relationship[2].nodes[0]._properties == {
        "name": "family1_dad",
        "id": "1",
    }
    assert found_relationship[3].start_node["name"] == "family1_dad"
