"""E2E del simulatore a tempo su mobile e desktop."""
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import pytest

sync_api = pytest.importorskip("playwright.sync_api")
WEB = Path(__file__).resolve().parent.parent
VIEWPORTS = {"mobile": {"width": 390, "height": 844}, "desktop": {"width": 1440, "height": 900}}


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


@pytest.fixture(scope="module")
def base_url():
    import subprocess
    subprocess.run(["sh", str(WEB / "build.sh")], check=True, capture_output=True)
    server = ThreadingHTTPServer(("127.0.0.1", 0), partial(Quiet, directory=str(WEB)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    yield f"http://127.0.0.1:{server.server_address[1]}/"
    server.shutdown()


@pytest.fixture(scope="module")
def browser():
    with sync_api.sync_playwright() as p:
        instance = p.chromium.launch()
        yield instance
        instance.close()


@pytest.mark.parametrize("viewport", list(VIEWPORTS))
def test_simulatore_due_ore_salvataggio_pausa_e_soluzioni(browser, base_url, viewport):
    context = browser.new_context(viewport=VIEWPORTS[viewport], is_mobile=viewport == "mobile", has_touch=viewport == "mobile")
    page = context.new_page()
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto(base_url)
    page.wait_for_selector("#module-nav a[href='#/simulatore']")
    page.click("#module-nav a[href='#/simulatore']")
    page.wait_for_selector("#sim-titolo")
    page.click("#sim-inizia")
    page.wait_for_selector("#sim-timer")
    assert page.inner_text("#sim-timer") == "02:00:00"
    assert page.locator("textarea.sim-input").count() > 0
    page.locator("textarea.sim-input").first.fill("Risposta di prova salvata.")
    page.click("#sim-pause")
    frozen = page.inner_text("#sim-timer")
    page.wait_for_timeout(1100)
    assert page.inner_text("#sim-timer") == frozen
    page.reload()
    page.wait_for_selector("textarea.sim-input")
    assert "Risposta di prova salvata." in page.locator("textarea.sim-input").first.input_value()
    page.click("#sim-consegna")
    page.wait_for_selector(".sim-soluzione-testo")
    assert page.locator(".sim-soluzione-testo").first.inner_text().strip()
    assert "nessun voto" in page.inner_text("#sim-riepilogo").lower()
    assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1")
    assert not errors, errors
    context.close()
