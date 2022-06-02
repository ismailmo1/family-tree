from app.db.transactions import find


def test_find_person_by_name():
    expected_id = "2"
    found_person_id = find.find_person_by_name("family1_mum")[0]["id"]
    assert expected_id == found_person_id


def test_find_person_properties():
    expected_props = {
        "props": {"name": "grandad", "id": "a", "dob": "01/01/1960"}
    }
    found_props = find.find_person_properties("a")[0]
    assert found_props == expected_props


def test_find_spouse():
    expected_spouse_id = "2"
    found_spouse_id = find.find_spouse(id="1")[0]["id"]
    assert found_spouse_id == expected_spouse_id


def test_find_parents():
    expected_parents = [
        {"id": "2", "name": "family1_mum"},
        {"id": "1", "name": "family1_dad"},
    ]
    found_parents_3 = find.find_parents("3")
    found_parents_4 = find.find_parents("4")
    assert found_parents_3 == expected_parents
    assert found_parents_4 == expected_parents


def test_find_children():
    expected_children = [
        {"id": "8", "name": "family1_stepchild"},
        {"id": "6", "name": "family1_child4"},
        {"id": "5", "name": "family1_child3"},
        {"id": "4", "name": "family1_child2"},
        {"id": "3", "name": "family1_child1"},
    ]
    found_children = find.find_children("1")
    assert found_children == expected_children


def test_find_full_siblings():
    expected_siblings = [
        {"id": "6", "name": "family1_child4"},
        {"id": "5", "name": "family1_child3"},
        {"id": "4", "name": "family1_child2"},
    ]
    found_siblings = find.find_full_siblings("3")
    assert found_siblings == expected_siblings


def test_find_all_siblings():
    expected_siblings = [
        {"id": "6", "name": "family1_child4"},
        {"id": "5", "name": "family1_child3"},
        {"id": "4", "name": "family1_child2"},
        {"id": "8", "name": "family1_stepchild"},
    ]
    found_siblings = find.find_all_siblings("3")

    assert found_siblings == expected_siblings


def test_find_siblings():
    found_full_siblings = find.find_siblings("4", full_only=True)
    found_all_siblings = find.find_siblings("4", full_only=False)
    expected_full_siblings = [
        {"id": "6", "name": "family1_child4"},
        {"id": "5", "name": "family1_child3"},
        {"id": "3", "name": "family1_child1"},
    ]
    expected_all_siblings = [
        {"id": "6", "name": "family1_child4"},
        {"id": "5", "name": "family1_child3"},
        {"id": "3", "name": "family1_child1"},
        {"id": "8", "name": "family1_stepchild"},
    ]

    assert found_full_siblings == expected_full_siblings
    assert found_all_siblings == expected_all_siblings


def test_find_cousins():
    expected_cousins = [
        {
            "parent.id": "1",
            "parent.name": "family1_dad",
            "unc_aunt.name": "family2_dad",
            "unc_aunt.id": "9",
            "cousins.name": "family2_child2",
            "cousins.id": "12",
        },
        {
            "parent.id": "1",
            "parent.name": "family1_dad",
            "unc_aunt.name": "family2_dad",
            "unc_aunt.id": "9",
            "cousins.name": "family2_child1",
            "cousins.id": "11",
        },
    ]
    found_cousins = find.find_cousins("6")
    assert found_cousins == expected_cousins
