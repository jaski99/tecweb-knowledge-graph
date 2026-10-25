"""Screenshot di home, grafo, lettore e percorso, più un controllo di overflow a 360px.
Saltato se Playwright non è installato. Le immagini finite stanno in docs/screens/."""
import json
import os
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import pytest

sync_api = pytest.importorskip("playwright.sync_api")
WEB = Path(__file__).resolve().parent.parent
ROOT = WEB.parent
GRAPH = json.loads((ROOT / "graph" / "graph.json").read_text(encoding="utf-8"))
LESSON = next(n["id"] for n in GRAPH["nodi"] if n.get("lezione", {}).get("spiegazione"))
SHOTS = Path(os.environ.get("KG_SHOTS", "/tmp/tecweb-kg-shots"))
VIEWPORTS = {
    "mobile": {"width": 390, "height": 844},
    "desktop": {"width": 1440, "height": 900},
}


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


@pytest.fixture(scope="module")
def base_url():
    import subprocess
    subprocess.run(["sh", str(WEB / "build.sh")], check=True, capture_output=True)
    srv = ThreadingHTTPServer(("127.0.0.1", 0), partial(Quiet, directory=str(WEB)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    yield f"http://127.0.0.1:{srv.server_address[1]}/"
    srv.shutdown()


@pytest.fixture(scope="module")
def browser():
    with sync_api.sync_playwright() as p:
        b = p.chromium.launch()
        yield b
        b.close()


def overflow(page):
    return page.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")


def shot(page, name):
    SHOTS.mkdir(parents=True, exist_ok=True)
    page.screenshot(path=str(SHOTS / name), full_page=False)


def wait_for_app(page, selector, errors, timeout=30000):
    try:
        page.wait_for_selector(selector, timeout=timeout)
    except Exception as error:
        status = page.locator('#status').inner_text() if page.locator('#status').count() else '(senza stato)'
        graph = page.locator('#cy').inner_text() if page.locator('#cy').count() else '(senza grafo)'
        raise AssertionError(f"Timeout su {selector}; stato={status!r}; pannello grafo={graph!r}; errori JS={errors!r}") from error


@pytest.mark.parametrize("vp", list(VIEWPORTS))
def test_schermate(browser, base_url, vp):
    ctx = browser.new_context(viewport=VIEWPORTS[vp], device_scale_factor=1, is_mobile=vp == "mobile", has_touch=vp == "mobile")
    page = ctx.new_page()
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto(base_url)
    wait_for_app(page, "#resume:not([hidden])", errors)
    if vp == "desktop":
        wait_for_app(page, "#cy canvas", errors)
    else:
        wait_for_app(page, "#graph-mobile-list .graph-mobile-item", errors)
    page.wait_for_timeout(400)
    assert overflow(page) <= 1
    shot(page, f"home-{vp}.png")
    if vp == "desktop":
        page.click("#zoom-fit")
        page.wait_for_timeout(300)
    graph_target = ".graph-wrap" if vp == "desktop" else "#graph-mobile-list"
    page.locator(graph_target).screenshot(path=str(SHOTS / f"grafo-{vp}.png"))
    page.click("#tab-percorso")
    wait_for_app(page, "#view-percorso:not([hidden]) .path li", errors)
    assert overflow(page) <= 1
    shot(page, f"percorso-{vp}.png")
    page.goto(f"{base_url}#/lezione/{LESSON}")
    wait_for_app(page, "#lesson-title", errors)
    wait_for_app(page, ".toc, .section-progress", errors)
    wait_for_app(page, "pre.mermaid, pre.code", errors, timeout=20000)
    page.wait_for_timeout(300)
    assert overflow(page) <= 1
    shot(page, f"lezione-{vp}.png")
    assert not [e for e in errors if "favicon" not in e], errors
    ctx.close()


def test_niente_scroll_orizzontale_a_360(browser, base_url):
    ctx = browser.new_context(viewport={"width": 360, "height": 740}, is_mobile=True, has_touch=True)
    page = ctx.new_page()
    page.goto(base_url)
    page.wait_for_selector("#graph-mobile-list .graph-mobile-item")
    assert overflow(page) <= 1
    page.goto(f"{base_url}#/lezione/{LESSON}")
    page.wait_for_selector("#lesson-title")
    page.wait_for_selector(".code-copy, pre.code", timeout=20000)
    assert overflow(page) <= 1
    ctx.close()
