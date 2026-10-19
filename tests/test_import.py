def test_import():
    from app.main import app
    assert app.title == "GraphIntel API"
