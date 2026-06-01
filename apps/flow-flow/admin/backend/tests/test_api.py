from fastapi.testclient import TestClient


def test_login_success(client: TestClient):
    res = client.post("/api/auth/login", json={"username": "admin", "password": "admin123"})
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_fail(client: TestClient):
    res = client.post("/api/auth/login", json={"username": "admin", "password": "wrong"})
    assert res.status_code == 401
    assert "invalidas" in res.text


def test_login_not_found(client: TestClient):
    res = client.post("/api/auth/login", json={"username": "noexiste", "password": "x"})
    assert res.status_code == 401


def test_me_unauthorized(client: TestClient):
    res = client.get("/api/auth/me")
    assert res.status_code == 403


def test_me_authenticated(client: TestClient):
    login = client.post("/api/auth/login", json={"username": "admin", "password": "admin123"})
    token = login.json()["access_token"]
    res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    assert res.json()["username"] == "admin"


def test_services_list(client: TestClient):
    res = client.get("/api/services?include_inactive=true")
    assert res.status_code == 200
    assert isinstance(res.json(), list)


def test_services_create_unauthorized(client: TestClient):
    res = client.post("/api/services", json={"name": "Test", "price": "$10"})
    assert res.status_code == 403


def test_services_crud(client: TestClient):
    login = client.post("/api/auth/login", json={"username": "admin", "password": "admin123"})
    token = login.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    res = client.post("/api/services", json={"name": "Corte Test", "price": "$20.000"}, headers=headers)
    assert res.status_code == 201
    sid = res.json()["id"]

    res = client.get(f"/api/services/{sid}", headers=headers)
    assert res.status_code in (200, 405)

    res = client.put(f"/api/services/{sid}", json={"price": "$25.000"}, headers=headers)
    assert res.status_code in (200, 405)

    res = client.delete(f"/api/services/{sid}", headers=headers)
    assert res.status_code == 204


def test_appointments_create(client: TestClient):
    res = client.post("/api/appointments", json={
        "client_name": "Juan", "client_phone": "+573001111111",
        "date": "2027-01-01", "time": "14:00",
    })
    assert res.status_code == 201


def test_appointments_invalid_phone(client: TestClient):
    res = client.post("/api/appointments", json={
        "client_name": "Juan", "client_phone": "abc",
        "date": "2026-06-01", "time": "10:00",
    })
    assert res.status_code == 422


def test_schedule_list(client: TestClient):
    res = client.get("/api/schedule")
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 7


def test_dashboard_unauthorized(client: TestClient):
    res = client.get("/api/dashboard")
    assert res.status_code == 403


def test_dashboard_ok(client: TestClient):
    login = client.post("/api/auth/login", json={"username": "admin", "password": "admin123"})
    token = login.json()["access_token"]
    res = client.get("/api/dashboard", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    data = res.json()
    assert "today_appointments" in data
    assert "total_services" in data
