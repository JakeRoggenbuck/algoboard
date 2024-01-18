import communicator


def test_pull_full_page():
    assert "html" in communicator.pull_full_page("jakeroggenbuck")


def test_get_json_data():
    full_page = communicator.pull_full_page("jakeroggenbuck")

    assert communicator.get_json_data(full_page)


def test_get_rank():
    full_page = communicator.pull_full_page("jakeroggenbuck")

    json_data = communicator.get_json_data(full_page)

    assert communicator.get_rank(json_data) > 1_000_000
