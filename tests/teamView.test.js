'use strict';

// Stable seam: the actual rendered page. This test loads the real index.html
// (with the real leadRouter.js inlined verbatim in place of the external
// <script src="leadRouter.js"> tag, since jsdom does not fetch local file://
// resources by default) into jsdom and drives it exactly like a browser would:
// reading the rendered team table, and dispatching a real form submit event.
// No internal class is instantiated and no collaborator is mocked — this is
// the outermost page-level seam available for a static HTML/JS/CSS demo app
// with no server or component framework.
const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const REPO_ROOT = path.join(__dirname, '..');

function loadPage() {
  const html = fs.readFileSync(path.join(REPO_ROOT, 'index.html'), 'utf8');
  const leadRouterSource = fs.readFileSync(path.join(REPO_ROOT, 'leadRouter.js'), 'utf8');
  const inlinedHtml = html.replace(
    '<script src="leadRouter.js"></script>',
    `<script>${leadRouterSource}</script>`
  );
  const dom = new JSDOM(inlinedHtml, {
    runScripts: 'dangerously',
    url: 'http://localhost/',
  });
  // jsdom does not implement layout, so browser-only methods like
  // scrollIntoView (called by index.html's own result-panel handler) are
  // absent. Stub it as a no-op, matching real-browser behavior for a purely
  // visual scroll effect that has no bearing on any observable assertion here.
  dom.window.HTMLElement.prototype.scrollIntoView = () => {};
  return dom;
}

function getTeamRows(document) {
  return Array.from(document.querySelectorAll('#teamTableBody tr'));
}

function rowFor(document, repName) {
  const id = `rep-row-${repName.replace(/\s+/g, '-')}`;
  return document.getElementById(id);
}

describe('Sales operations team view (TC-2 — bmb_PKO7Pv4DWm07)', () => {
  let dom;
  let document;

  before(() => {
    dom = loadPage();
    document = dom.window.document;
  });

  after(() => {
    dom.window.close();
  });

  test('the team directory table renders each representative with territory, segment, product focus, and capacity together in one view', () => {
    // @pmc-criterion master:use-case:balance-territory-coverage
    const expectedReps = [
      { name: 'Alex Rivera', territory: 'Pacific NW', segment: 'Enterprise', product: 'Azure · Copilot Studio', capacity: 15 },
      { name: 'Jordan Lee', territory: 'California', segment: 'Enterprise', product: 'Power Platform · D365', capacity: 15 },
      { name: 'Morgan Chen', territory: 'Southwest', segment: 'Mid-Market', product: 'Microsoft 365 · Teams', capacity: 20 },
      { name: 'Taylor Brooks', territory: 'Mountain West', segment: 'Mid-Market', product: 'Azure · AI Services', capacity: 20 },
      { name: 'Casey Kim', territory: 'Midwest', segment: 'Mid-Market', product: 'Power Platform', capacity: 20 },
      { name: 'Dana Nguyen', territory: 'Great Lakes', segment: 'Enterprise', product: 'D365 Sales · Customer Insights', capacity: 15 },
      { name: 'Riley Patel', territory: 'Southeast', segment: 'SMB', product: 'Microsoft 365 · Teams', capacity: 25 },
      { name: 'Quinn Torres', territory: 'Mid-Atlantic', segment: 'SMB', product: 'Power Platform · Copilot', capacity: 25 },
      { name: 'Avery Johnson', territory: 'Northeast', segment: 'Enterprise', product: 'Azure · Fabric · Copilot', capacity: 15 },
      { name: 'Skyler Williams', territory: 'Texas', segment: 'Mid-Market', product: 'D365 · Power Platform', capacity: 22 },
    ];

    const rows = getTeamRows(document);
    assert.equal(rows.length, expectedReps.length);

    for (const rep of expectedReps) {
      const row = rowFor(document, rep.name);
      assert.ok(row, `expected a team-table row for ${rep.name}`);
      const text = row.textContent;
      assert.match(text, new RegExp(rep.name));
      assert.match(text, new RegExp(rep.territory));
      assert.match(text, new RegExp(rep.segment));
      assert.match(text, new RegExp(escapeRegExp(rep.product)));
      // Current routing load and configured capacity are shown together as "load/capacity".
      assert.match(text, new RegExp(`0\\/${rep.capacity}`));
    }
  });

  test('routing a new lead updates the same representative\'s current routing load alongside their unchanged capacity, territory, and segment', () => {
    // The declared protection binding for the balance-territory-coverage
    // criterion lives on the team-view rendering test above so the criterion
    // keeps a single, unambiguous declared binding.
    document.getElementById('state').value = 'NY';
    document.getElementById('leadSource').value = 'Inbound Web Form';
    document.getElementById('employees').value = '1500';
    document.getElementById('arr').value = '0';

    const form = document.getElementById('leadForm');
    const submitEvent = new dom.window.Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(submitEvent);

    const averyRow = rowFor(document, 'Avery Johnson');
    assert.ok(averyRow, 'expected Avery Johnson to still have a team-table row after routing');
    const text = averyRow.textContent;

    // Territory, segment, and product focus (capacity planning inputs) stay put...
    assert.match(text, /Northeast/);
    assert.match(text, /Enterprise/);
    assert.match(text, /Azure · Fabric · Copilot/);
    // ...while current routing load increments against the same configured capacity.
    assert.match(text, /1\/15/);

    const resultBody = document.getElementById('result-body');
    assert.match(resultBody.textContent, /Avery Johnson/);
  });
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
