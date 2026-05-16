# Analytics Setup for Seloice Tools

## Overview
This document describes how to configure Google Tag Manager (GTM) and Google Analytics 4 (GA4) for the project.
The codebase now includes a global analytics provider and observer to handle page views, tool opens, button clicks, form submits, search usage, outbound links, scroll depth, performance metrics, and runtime errors.

## Required GTM Variables
- `GTM Container ID`: `NEXT_PUBLIC_GTM_ID`
- `GA4 Measurement ID`: `NEXT_PUBLIC_GA_ID`

### Required Data Layer Variables
Create the following Data Layer variables inside GTM:
- `event`
- `page_path`
- `page_location`
- `page_referrer`
- `tool_name`
- `blog_slug`
- `category`
- `button_text`
- `element_id`
- `classes`
- `form_id`
- `form_action`
- `search_term`
- `destination_url`
- `anchor_text`
- `depth`
- `metric_name`
- `metric_value`
- `metric_id`
- `message`
- `stack`

## Recommended GA4 Event Tags
Create GA4 event tags for the following event names:
- `page_view`
- `tool_open`
- `blog_read`
- `generate_click`
- `download_click`
- `copy_click`
- `share_click`
- `submit_click`
- `login`
- `signup`
- `try_now_click`
- `form_submit`
- `search_used`
- `outbound_click`
- `scroll_depth`
- `performance_metric`
- `site_error`

### Example GA4 event tag configuration
1. Trigger: Custom Event → Event name equals `tool_open`
2. Event name in GA4 tag: `tool_open`
3. Event parameters: select from Data Layer variables, such as `tool_name`, `pathname`, `category`.

## Trigger Setup
Create custom triggers for each event type:
- `page_view`: Custom event `page_view`
- `tool_open`: Custom event `tool_open`
- `blog_read`: Custom event `blog_read`
- `form_submit`: Custom event `form_submit`
- `search_used`: Custom event `search_used`
- `outbound_click`: Custom event `outbound_click`
- `scroll_depth`: Custom event `scroll_depth`
- `performance_metric`: Custom event `performance_metric`
- `site_error`: Custom event `site_error`
- Button click events: `generate_click`, `download_click`, `copy_click`, `share_click`, `submit_click`, `login`, `signup`, `try_now_click`

## Custom Dimensions
Recommended dimension names:
- `tool_name`
- `blog_slug`
- `page_path`
- `category`
- `button_text`
- `element_id`
- `classes`
- `form_id`
- `form_action`
- `search_term`
- `destination_url`
- `anchor_text`
- `depth`
- `metric_name`
- `metric_value`
- `message`
- `stack`

## Setup Instructions
1. Add `NEXT_PUBLIC_GTM_ID` and `NEXT_PUBLIC_GA_ID` to environment variables.
2. Verify `src/app/layout.tsx` includes the GTM provider via `@next/third-parties/google`.
3. Confirm `src/providers/AnalyticsProvider.tsx` is mounted at the app root.
4. Configure GTM container tags to send events to GA4 using the custom event triggers above.
5. In GA4, enable DebugView and verify events appear when you navigate the site.

## Testing Steps
1. Open the site and confirm GTM container loads without duplicate scripts.
2. Navigate between pages and verify `page_view` events fire in DebugView.
3. Visit a tool page under `/tools/` and verify `tool_open` is tracked.
4. Visit a blog page under `/blogs/` and verify `blog_read` is tracked.
5. Click buttons containing `Generate`, `Download`, `Copy`, `Share`, `Submit`, `Login`, `Signup`, or `Try Now` and verify corresponding click events.
6. Submit a form and verify `form_submit` triggers.
7. Use a search field and verify `search_used` triggers.
8. Click an external link and verify `outbound_click` triggers.
9. Scroll the page to 25%, 50%, 75%, and 100% and verify `scroll_depth` events.
10. Trigger a JS error or rejected promise and verify `site_error` is reported.
11. Verify Core Web Vitals events `LCP`, `CLS`, `INP`, `FCP`, and `TTFB` appear if supported.

## GA4 DebugView Verification
- Open GA4 and navigate to DebugView.
- Use the browser extension or developer tools to set `debug_mode` if needed.
- Perform site navigation and action tests in the same browser session.
- Confirm each event name appears with the expected parameters.
- Verify `page_view`, `tool_open`, `blog_read`, `form_submit`, `search_used`, `outbound_click`, `scroll_depth`, `performance_metric`, and `site_error` are all received.
