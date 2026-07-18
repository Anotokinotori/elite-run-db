from pathlib import Path

from playwright.sync_api import expect, sync_playwright


def attach_error_collectors(page, console_errors, page_errors):
    page.on(
        "console",
        lambda msg: console_errors.append(msg.text)
        if msg.type == "error" and not msg.text.startswith("Failed to load resource:")
        else None,
    )
    page.on("pageerror", lambda error: page_errors.append(str(error)))


def check_layout(page, screenshot_name):
    page.goto("http://127.0.0.1:5173/#library")
    page.wait_for_load_state("networkidle")

    title = page.get_by_role("heading", name="RECORDS SEARCH")
    expect(title).to_be_visible()
    expect(page.locator(".entrance-plus")).to_have_count(5)

    title_box = title.bounding_box()
    viewport_width = page.viewport_size["width"]
    if not title_box:
        raise AssertionError("Missing title bounding box")
    if title_box["x"] < 0 or title_box["x"] + title_box["width"] > viewport_width:
        raise AssertionError(f"Title overflows viewport: {title_box}, viewport={viewport_width}")

    screenshot_path = Path(f".tmp_qa/{screenshot_name}")
    page.screenshot(path=str(screenshot_path), full_page=True)
    return screenshot_path


def check_filter_scroll(page):
    page.goto("http://127.0.0.1:5173/#library")
    page.wait_for_load_state("networkidle")

    filter_button = page.locator(".library-filter-submit")
    expect(filter_button).to_have_count(0)

    tag_card = page.locator(".entrance-plus").nth(4).locator("xpath=ancestor::button[1]")
    tag_card.click()
    expect(page.locator(".fixed.inset-x-0")).to_be_visible()
    page.locator(".fixed.inset-x-0 button").filter(has_text="#").first.click()
    page.locator(".fixed.inset-x-0 footer button").nth(1).click()

    expect(filter_button).to_be_visible()
    before_scroll = page.evaluate("window.scrollY")
    filter_button.click()
    page.wait_for_function("window.scrollY > 500")
    after_scroll = page.evaluate("window.scrollY")
    if after_scroll <= before_scroll:
        raise AssertionError(f"Expected filter button to scroll down, before={before_scroll}, after={after_scroll}")


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        console_errors = []
        page_errors = []
        screenshots = []

        for viewport, screenshot_name in [
            ({"width": 1440, "height": 1200}, "library_search_title_scale_desktop.png"),
            ({"width": 390, "height": 1200}, "library_search_title_scale_mobile.png"),
        ]:
            page = browser.new_page(viewport=viewport)
            attach_error_collectors(page, console_errors, page_errors)
            screenshots.append(check_layout(page, screenshot_name))
            page.close()

        page = browser.new_page(viewport={"width": 1440, "height": 1000})
        attach_error_collectors(page, console_errors, page_errors)
        check_filter_scroll(page)
        page.close()

        browser.close()

        if console_errors or page_errors:
            raise AssertionError("Browser errors:\n" + "\n".join(console_errors + page_errors))

        print("Library search title scale check passed. Screenshots: " + ", ".join(str(path) for path in screenshots))


if __name__ == "__main__":
    main()
