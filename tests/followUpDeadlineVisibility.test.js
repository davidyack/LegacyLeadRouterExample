'use strict';

// Stable seam: the actual rendered page. This test loads the real index.html
// (with the real leadRouter.js inlined verbatim in place of the external
// <script src="leadRouter.js"> tag, since jsdom does not fetch local file://
// resources by default) into jsdom and drives it exactly like a browser would:
// filling the lead form and dispatching a real form submit event, then reading
// the rendered "Response SLA" row in the routing-result panel that Sales teams
// see. No internal class is instantiated and no collaborator is mocked — this
// is the outermost page-level seam available for a static HTML/JS/CSS demo
// app with no server or component framework. The SLA text is static per
// segment/source (no real-time business-hour arithmetic happens today), so no
// clock needs to be mocked either.
const { test, describe, beforeEach, afterEach } = require('node:test');
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

function submitLead(document, dom, { state, employees, arr, leadSource, companyName }) {
  document.getElementById('companyName').value = companyName || '';
  document.getElementById('state').value = state;
  document.getElementById('employees').value = String(employees);
  document.getElementById('arr').value = String(arr);
  document.getElementById('productInterest').value = '';
  document.getElementById('leadSource').value = leadSource;

  const form = document.getElementById('leadForm');
  const submitEvent = new dom.window.Event('submit', { bubbles: true, cancelable: true });
  form.dispatchEvent(submitEvent);
}

function slaRowText(document) {
  const rows = Array.from(document.querySelectorAll('#result-body .info-row'));
  const slaRow = rows.find((row) => /Response SLA/.test(row.textContent));
  return slaRow ? slaRow.textContent : null;
}

describe('Routed-lead follow-up deadline visibility (TC-2 — bmb_0MD5gqHqchVh)', () => {
  let dom;
  let document;

  beforeEach(() => {
    dom = loadPage();
    document = dom.window.document;
  });

  afterEach(() => {
    dom.window.close();
  });

  test('an Enterprise lead\'s rendered result shows a first-contact deadline of 2 business hours', () => {
    // @pmc-criterion master:use-case:track-lead-follow-up-expectations
    submitLead(document, dom, { state: 'WA', employees: 1500, arr: 0, leadSource: 'Inbound Web Form' });

    const text = slaRowText(document);
    assert.ok(text, 'expected a Response SLA row in the rendered result panel');
    assert.match(text, /First contact within 2 business hours/);
  });

  test('a Mid-Market lead\'s rendered result shows a first-contact deadline of 4 business hours', () => {
    // @pmc-criterion master:use-case:track-lead-follow-up-expectations
    submitLead(document, dom, { state: 'AZ', employees: 200, arr: 0, leadSource: 'Inbound Web Form' });

    const text = slaRowText(document);
    assert.ok(text, 'expected a Response SLA row in the rendered result panel');
    assert.match(text, /First contact within 4 business hours/);
  });

  test('an SMB lead\'s rendered result shows a first-contact deadline of 1 business day', () => {
    // @pmc-criterion master:use-case:track-lead-follow-up-expectations
    submitLead(document, dom, { state: 'GA', employees: 10, arr: 0, leadSource: 'Inbound Web Form' });

    const text = slaRowText(document);
    assert.ok(text, 'expected a Response SLA row in the rendered result panel');
    assert.match(text, /First contact within 1 business day/);
  });

  test('a Partner Referral lead\'s rendered result shows the accelerated partner deadline regardless of segment', () => {
    // @pmc-criterion master:use-case:track-lead-follow-up-expectations
    submitLead(document, dom, {
      state: 'AZ',
      employees: 200,
      arr: 0.5,
      leadSource: 'Partner Referral',
      companyName: 'Unnamed Partner Co',
    });

    const text = slaRowText(document);
    assert.ok(text, 'expected a Response SLA row in the rendered result panel');
    assert.match(
      text,
      /Partner acknowledgment within 1 business hour; first contact within 4 business hours/
    );
  });

  test('an Executive Referral lead\'s rendered result shows the same-day contact deadline regardless of segment', () => {
    // @pmc-criterion master:use-case:track-lead-follow-up-expectations
    submitLead(document, dom, { state: 'NY', employees: 1200, arr: 0, leadSource: 'Executive Referral' });

    const text = slaRowText(document);
    assert.ok(text, 'expected a Response SLA row in the rendered result panel');
    assert.match(text, /Same-day contact required; VP Sales notified/);
  });
});
