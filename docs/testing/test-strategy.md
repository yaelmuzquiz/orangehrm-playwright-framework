# QA Automation Test Strategy

## Testing Objectives
This framework aims to achieve the following objectives:
- **Reliability**: Establish a stable, maintainable automated testing approach suitable for continuous integration
- **Coverage**: Provide progressive test coverage across UI interactions, API functionality, and end-to-end business workflows
- **Maintainability**: Implement industry best practices (Page Object Model, fixtures, abstraction layers) to ensure long-term code quality
- **Documentation**: Create a reusable reference implementation for senior-level QA automation practices
- **Scalability**: Design the framework to easily accommodate new test cases and modules as the product evolves

## Planned Test Suites

### 1. Smoke Tests
- **Purpose**: Quick validation of critical paths and system availability
- **Scope**: Login, basic navigation, key module accessibility
- **Execution**: Fast, minimal setup, suitable for pre-release gates
- **Examples**: User login, dashboard load, navigation to main modules

### 2. Functional UI Tests
- **Purpose**: Comprehensive validation of user-facing features and workflows
- **Scope**: CRUD operations, form submissions, user interactions within each module
- **Execution**: Moderate duration, detailed validations, suitable for regression testing
- **Examples**: Employee data creation/update, leave request submission, recruitment workflow

### 3. API Tests
- **Purpose**: Validate backend functionality and data integrity independent of UI
- **Scope**: API endpoint behavior, data persistence, error handling
- **Execution**: Fast, isolated, suitable for CI/CD integration
- **Examples**: REST endpoint responses, payload validation, state verification

### 4. End-to-End (E2E) Tests
- **Purpose**: Validate complete business workflows across multiple modules
- **Scope**: Multi-step user journeys spanning UI and API interactions
- **Execution**: Comprehensive, longer duration, suitable for quality gates
- **Examples**: Employee onboarding workflow, leave request approval chain, recruitment pipeline

## Testing Principles

### Page Object Model (POM)
- Each page/modal is represented as a dedicated class
- Locators are centralized and reusable
- Methods abstract user interactions and validations
- Enables maintainability and reduces duplication

### API Clients
- Dedicated client classes for API interactions
- Encapsulate HTTP request/response logic
- Support fixtures for test data creation and cleanup
- Maintain separation from UI test logic

### Fixtures and Test Data
- Use Playwright fixtures for setup and teardown
- Manage test data through environment variables or configuration files
- Never hardcode credentials or sensitive information in source code
- Implement data cleanup to ensure test independence

### Assertions
- Assert only what is necessary to validate test objectives
- Use semantic assertions that clearly document expected behavior
- Combine multiple related assertions when validating complex state
- Avoid over-assertion that increases maintenance burden

### Traces, Screenshots, and Reporting
- Retain traces, screenshots, and videos for failed runs in CI.
- Use the HTML report to review failures and attachments.

### CI/CD Integration
- Tests execute in parallel when possible (configured by browser and test suite)
- Retries configured for CI environments to reduce flakiness
- Results published to HTML reports and CI dashboards
- Performance metrics and trend tracking included

## Current Project Status

The UI suite covers successful login, invalid credentials, missing username, and missing password through Login and Dashboard page objects. API and E2E suites are planned.

### Chromium Baseline

On 2026-11-27, all four authentication scenarios passed in 20.6 seconds against the OrangeHRM public demo using Node.js 24.19.0, Playwright 1.60.0, and one Chromium worker. This is a single-run baseline. Firefox and WebKit were outside this run.

To reproduce from PowerShell with dependencies and Chromium installed, load the public demo settings from `.env.example` into the current process and run the authentication suite:

```powershell
Get-Content .env.example | Where-Object { $_ -match '^ORANGEHRM_' } | ForEach-Object {
  $demoSetting = $_ -split '=', 2
  [Environment]::SetEnvironmentVariable($demoSetting[0], $demoSetting[1], 'Process')
}
npm run test:ui -- --project=chromium --workers=1 --reporter=list
```

### Architecture Pilot

Use the shared demo for authentication and other flows that leave shared business records unchanged. Run scenarios that create or modify persistent business data in an authorized, controlled environment with synthetic data and cleanup fixtures.

Load and validate environment settings before Playwright builds its configuration. Resolve relative routes through Playwright's `baseURL`. In the login smoke test, use the Dashboard URL and visible heading as readiness checks.

Start CI with one Chromium worker. Use static checks as required PR checks and report the external demo run independently. Review whether smoke can become a required check once a controlled environment is available. Upload the HTML report and configure traces, screenshots and videos for failed runs with limited retention and access. Keep authenticated browser state out of Git and uploaded artifacts.

The updated authentication suite passed all four cases in Chromium in 15.2 seconds against the public demo. Type checking and lint passed locally. A separate diagnostic run with CI settings used an invalid loopback port and confirmed that a failing smoke test produces an HTML report, trace, screenshot, and video. The GitHub Actions workflow still needs its first hosted run and independent review before the pilot is closed.
