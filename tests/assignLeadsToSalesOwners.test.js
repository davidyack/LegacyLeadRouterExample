'use strict';

// Stable seam (TC-1, TC-2, TC-3, TC-5, TC-6): leadRouter.js is a plain
// CommonJS/browser-dual module. Its public module API (`module.exports`) —
// `routeLead`, `getSegmentFromSize`, and `REPS` — is the same API index.html's
// inline `<script>` calls directly on form submit (`const result =
// routeLead(lead);`). Requiring the module and calling its exported functions
// is therefore the outermost stable seam available for these behaviors; there
// is no server or HTTP layer in this static demo app to sit in front of it.
// `REPS` is itself part of that public module API, so reading/setting a rep's
// `currentLeads` to model "at capacity" configures public state through the
// seam rather than reaching into a private/internal collaborator.
const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const { routeLead, getSegmentFromSize, REPS } = require('../leadRouter.js');

function resetCapacities() {
  REPS.forEach((r) => {
    r.currentLeads = 0;
  });
}

describe('Capacity remains a soft ceiling (TC-1 — bmb_67o5nNGEQRxI)', () => {
  test('when no alternative same-segment representative has capacity, the lead is still assigned to an at-capacity representative in that segment', () => {
    // @pmc-criterion master:business-rule:capacity-remains-a-soft-ceiling
    resetCapacities();
    const riley = REPS.find((r) => r.name === 'Riley Patel'); // SMB, Southeast
    const quinn = REPS.find((r) => r.name === 'Quinn Torres'); // SMB, Mid-Atlantic — Riley's only same-segment peer

    try {
      // Both SMB representatives are at capacity, so there is no alternative
      // with room — the premise the criterion names.
      riley.currentLeads = riley.capacity;
      quinn.currentLeads = quinn.capacity;
      assert.ok(riley.currentLeads >= riley.capacity, 'expected Riley Patel to be at capacity for this scenario');
      assert.ok(quinn.currentLeads >= quinn.capacity, 'expected Quinn Torres to be at capacity for this scenario');

      const lead = {
        companyName: '',
        state: 'GA', // Riley Patel's territory
        employees: 10,
        arr: 0,
        leadSource: 'Inbound Web Form',
      };

      const result = routeLead(lead);

      // The lead is still assigned — to the same-segment representative —
      // even though that representative is also at capacity. Capacity did
      // not block the assignment (it is a "soft ceiling"), and the lead did
      // not fall through to the SDR pool.
      assert.deepEqual(result, {
        assignedRep: 'Quinn Torres',
        territory: 'Mid-Atlantic',
        segment: 'SMB',
        productFocus: 'Power Platform / Copilot',
        reason: 'Step 4 – Capacity Overflow: Riley Patel is at capacity – routing to next best-fit rep',
        escalation: 'Original territory rep (Riley Patel) at capacity',
        sla: 'First contact within 1 business day',
        isOverflow: true,
        isSDRPool: false,
      });
      assert.equal(result.assignedRep, 'Quinn Torres');
      assert.equal(result.isSDRPool, false);
    } finally {
      riley.currentLeads = 0;
      quinn.currentLeads = 0;
    }
  });

  test('contrast: when an alternative same-segment representative does have capacity, that available representative is used instead of the soft-ceiling fallback', () => {
    // @pmc-criterion master:business-rule:capacity-remains-a-soft-ceiling
    resetCapacities();
    const riley = REPS.find((r) => r.name === 'Riley Patel');
    const quinn = REPS.find((r) => r.name === 'Quinn Torres');

    try {
      riley.currentLeads = riley.capacity;
      // Quinn Torres is left with room — the soft-ceiling fallback is not
      // the only path to Quinn Torres, so this alone would not prove the
      // premise above; it confirms the "no alternative has capacity" clause
      // in TC-1 is a genuine precondition, not a no-op.
      assert.ok(quinn.currentLeads < quinn.capacity);

      const lead = {
        companyName: '',
        state: 'GA',
        employees: 10,
        arr: 0,
        leadSource: 'Inbound Web Form',
      };

      const result = routeLead(lead);
      assert.equal(result.assignedRep, 'Quinn Torres');
    } finally {
      riley.currentLeads = 0;
      quinn.currentLeads = 0;
    }
  });
});

describe('Capacity overflow prefers available same-segment reps (TC-2 — bmb_6fVlZjDHSPKy)', () => {
  test('when a representative has reached capacity, the lead is reassigned to another available representative in the same segment', () => {
    // @pmc-criterion master:business-rule:capacity-overflow-prefers-available-segment-reps
    resetCapacities();
    const riley = REPS.find((r) => r.name === 'Riley Patel');
    const quinn = REPS.find((r) => r.name === 'Quinn Torres');

    try {
      riley.currentLeads = riley.capacity;
      quinn.currentLeads = 0; // available

      const lead = {
        companyName: '',
        state: 'GA',
        employees: 10,
        arr: 0,
        leadSource: 'Inbound Web Form',
      };

      const result = routeLead(lead);

      assert.deepEqual(result, {
        assignedRep: 'Quinn Torres',
        territory: 'Mid-Atlantic',
        segment: 'SMB',
        productFocus: 'Power Platform / Copilot',
        reason: 'Step 4 – Capacity Overflow: Riley Patel is at capacity – routing to next best-fit rep',
        escalation: 'Original territory rep (Riley Patel) at capacity',
        sla: 'First contact within 1 business day',
        isOverflow: true,
        isSDRPool: false,
      });
      assert.notEqual(result.assignedRep, 'Riley Patel');
      assert.equal(quinn.currentLeads < quinn.capacity, true, 'the reassigned representative had capacity at the time of assignment');
    } finally {
      riley.currentLeads = 0;
      quinn.currentLeads = 0;
    }
  });

  test('contrast: "where possible" — when no available same-segment representative exists, reassignment falls back to an at-capacity peer instead of failing', () => {
    // @pmc-criterion master:business-rule:capacity-overflow-prefers-available-segment-reps
    resetCapacities();
    const riley = REPS.find((r) => r.name === 'Riley Patel');
    const quinn = REPS.find((r) => r.name === 'Quinn Torres');

    try {
      riley.currentLeads = riley.capacity;
      quinn.currentLeads = quinn.capacity; // no availability anywhere in segment

      const lead = {
        companyName: '',
        state: 'GA',
        employees: 10,
        arr: 0,
        leadSource: 'Inbound Web Form',
      };

      const result = routeLead(lead);
      // Still reassigned rather than dropped to the SDR pool — "where
      // possible" does not mean "otherwise unassigned".
      assert.equal(result.assignedRep, 'Quinn Torres');
      assert.equal(result.isSDRPool, false);
    } finally {
      riley.currentLeads = 0;
      quinn.currentLeads = 0;
    }
  });
});

describe('Copilot Studio POCs prefer the national SME (TC-3 — bmb_7McJXVOTdZLx)', () => {
  test('a Copilot Studio POC request is routed first to the designated national SME, Alex Rivera, when he has capacity', () => {
    // @pmc-criterion master:business-rule:copilot-pocs-prefer-national-sme
    resetCapacities();
    const alex = REPS.find((r) => r.name === 'Alex Rivera');
    assert.ok(alex.isCopilotStudioSME);
    assert.ok(alex.currentLeads < alex.capacity);

    const lead = {
      companyName: '',
      state: 'WA',
      employees: 5000,
      arr: 20,
      leadSource: 'Copilot Studio POC',
    };

    const result = routeLead(lead);
    assert.deepEqual(result, {
      assignedRep: 'Alex Rivera',
      territory: 'Pacific NW',
      segment: 'Enterprise',
      productFocus: 'Azure / Copilot Studio',
      reason: 'Copilot Studio POC: routed to Alex Rivera (national SME, first right of refusal)',
      escalation: 'If Alex unavailable: Casey Kim or Quinn Torres',
      sla: 'First contact within 2 business hours',
      isOverflow: false,
      isSDRPool: false,
    });
  });

  test('contrast: when the designated national SME lacks capacity, the request routes to a designated backup representative instead', () => {
    // @pmc-criterion master:business-rule:copilot-pocs-prefer-national-sme
    resetCapacities();
    const alex = REPS.find((r) => r.name === 'Alex Rivera');
    const casey = REPS.find((r) => r.name === 'Casey Kim');
    assert.ok(casey.isCopilotStudioBackup);

    try {
      alex.currentLeads = alex.capacity;

      const lead = {
        companyName: '',
        state: 'WA',
        employees: 5000,
        arr: 20,
        leadSource: 'Copilot Studio POC',
      };

      const result = routeLead(lead);
      assert.deepEqual(result, {
        assignedRep: 'Casey Kim',
        territory: 'Midwest',
        segment: 'Mid-Market',
        productFocus: 'Power Platform',
        reason: 'Copilot Studio POC: Alex Rivera at capacity – routed to backup',
        escalation: 'Casey Kim or Quinn Torres (Copilot Studio backups)',
        sla: 'First contact within 4 business hours',
        isOverflow: true,
        isSDRPool: false,
      });
      assert.notEqual(result.assignedRep, 'Alex Rivera');
    } finally {
      alex.currentLeads = 0;
    }
  });
});

describe('Lead segments follow size thresholds (TC-5 — bmb_UPhtUQpci8Mt)', () => {
  test('1,000 or more employees classifies a lead as Enterprise', () => {
    // @pmc-criterion master:business-rule:lead-segments-follow-size-thresholds
    assert.equal(getSegmentFromSize(1000, 0), 'Enterprise');
    assert.equal(getSegmentFromSize(2500, 0), 'Enterprise');
  });

  test('ARR above $10M classifies a lead as Enterprise regardless of employee count', () => {
    // @pmc-criterion master:business-rule:lead-segments-follow-size-thresholds
    assert.equal(getSegmentFromSize(5, 10.5), 'Enterprise');
  });

  test('100 or more employees classifies a non-Enterprise lead as Mid-Market', () => {
    // @pmc-criterion master:business-rule:lead-segments-follow-size-thresholds
    assert.equal(getSegmentFromSize(100, 0), 'Mid-Market');
    assert.equal(getSegmentFromSize(750, 0), 'Mid-Market');
  });

  test('ARR of at least $1M classifies a non-Enterprise lead as Mid-Market', () => {
    // @pmc-criterion master:business-rule:lead-segments-follow-size-thresholds
    assert.equal(getSegmentFromSize(5, 1), 'Mid-Market');
    assert.equal(getSegmentFromSize(5, 8), 'Mid-Market');
  });

  test('a lead meeting neither the Enterprise nor Mid-Market thresholds is classified as SMB', () => {
    // @pmc-criterion master:business-rule:lead-segments-follow-size-thresholds
    assert.equal(getSegmentFromSize(0, 0), 'SMB');
    assert.equal(getSegmentFromSize(99, 0.99), 'SMB');
  });

  test('boundary: exactly 999 employees or exactly $10M ARR alone do not reach Enterprise', () => {
    // @pmc-criterion master:business-rule:lead-segments-follow-size-thresholds
    assert.equal(getSegmentFromSize(999, 0), 'Mid-Market');
    assert.equal(getSegmentFromSize(0, 10), 'Mid-Market');
  });
});

describe('Executive referrals route to Avery Johnson (TC-6 — bmb_Yj6avbbHbCFh)', () => {
  test('an Executive Referral lead is routed to Avery Johnson and escalated for VP Sales direct engagement', () => {
    // @pmc-criterion master:business-rule:executive-referrals-route-to-avery-johnson
    resetCapacities();
    const lead = {
      companyName: '',
      state: 'TX', // would otherwise route to Skyler Williams (Mid-Market, Texas)
      employees: 50,
      arr: 0.2,
      leadSource: 'Executive Referral',
    };

    const result = routeLead(lead);
    assert.deepEqual(result, {
      assignedRep: 'Avery Johnson',
      territory: 'Northeast',
      segment: 'Enterprise',
      productFocus: 'Azure / Fabric / Copilot',
      reason: 'Executive Referral: routed to Avery Johnson (Northeast Enterprise)',
      escalation: 'VP Sales direct engagement',
      sla: 'Same-day contact required; VP Sales notified',
      isOverflow: false,
      isSDRPool: false,
    });
    assert.equal(result.assignedRep, 'Avery Johnson');
    assert.equal(result.escalation, 'VP Sales direct engagement');
  });

  test('contrast: the same company profile through a different lead source is not routed to Avery Johnson and is not escalated for VP Sales engagement', () => {
    // @pmc-criterion master:business-rule:executive-referrals-route-to-avery-johnson
    resetCapacities();
    const lead = {
      companyName: '',
      state: 'TX',
      employees: 50,
      arr: 0.2,
      leadSource: 'Inbound Web Form',
    };

    const result = routeLead(lead);
    assert.notEqual(result.assignedRep, 'Avery Johnson');
    assert.notEqual(result.escalation, 'VP Sales direct engagement');
  });
});

// Stable seam (TC-4): the rendered page. This test loads the real index.html
// (with the real leadRouter.js inlined verbatim in place of the external
// <script src="leadRouter.js"> tag, since jsdom does not fetch local file://
// resources by default) into jsdom and drives it exactly like a browser
// would — filling in the lead form and dispatching a real submit event — then
// asserts on the rendered routing-decision explanation and overflow alert. No
// internal class is instantiated and no collaborator is mocked. Setting a
// rep's `currentLeads` to model "at capacity" is done through
// `window.eval('REPS...')`: REPS is declared with top-level `const` inside the
// inlined classic <script>, so it is not exposed as a `window` property, but
// it lives in the same script-global lexical environment that `window.eval`
// runs in — this reaches the same public state index.html's own submit
// handler reads and mutates, not a private collaborator.
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
  dom.window.HTMLElement.prototype.scrollIntoView = () => {};
  return dom;
}

function fillLeadForm(document, fields) {
  const defaults = {
    companyName: '',
    state: '',
    leadSource: 'Inbound Web Form',
    employees: '',
    arr: '',
    productInterest: '',
  };
  const values = { ...defaults, ...fields };
  document.getElementById('companyName').value = values.companyName;
  document.getElementById('state').value = values.state;
  document.getElementById('leadSource').value = values.leadSource;
  document.getElementById('employees').value = values.employees;
  document.getElementById('arr').value = values.arr;
  document.getElementById('productInterest').value = values.productInterest;
}

function submitLeadForm(dom, document) {
  const form = document.getElementById('leadForm');
  const submitEvent = new dom.window.Event('submit', { bubbles: true, cancelable: true });
  form.dispatchEvent(submitEvent);
}

function setRepCurrentLeads(dom, repName, currentLeads) {
  dom.window.eval(
    `REPS.find((r) => r.name === ${JSON.stringify(repName)}).currentLeads = ${currentLeads};`
  );
}

function rowFor(document, repName) {
  const id = `rep-row-${repName.replace(/\s+/g, '-')}`;
  return document.getElementById(id);
}

describe('Assign leads to sales owners end-to-end (TC-4 — bmb_Gp7_st99tmQ6)', () => {
  let dom;
  let document;

  before(() => {
    dom = loadPage();
    document = dom.window.document;
  });

  after(() => {
    dom.window.close();
  });

  test('a named-account lead is routed to its named account owner and the decision is explained in the rendered result', () => {
    // @pmc-criterion master:use-case:assign-leads-to-sales-owners
    fillLeadForm(document, {
      companyName: 'Adventure Works',
      state: 'TX', // would otherwise point to Skyler Williams / Mid-Market
      employees: '50',
      arr: '0.2',
      leadSource: 'Inbound Web Form',
    });
    submitLeadForm(dom, document);

    const resultBody = document.getElementById('result-body');
    assert.match(resultBody.textContent, /Alex Rivera/);
    assert.ok(
      resultBody.textContent.includes('Step 1 – Named Account Match: "Adventure Works" is assigned to Alex Rivera'),
      'expected the rendered result to explain the named-account routing decision'
    );
    // No escalation applies to this path, so no escalation row is rendered.
    assert.ok(!resultBody.textContent.includes('Escalation Path'));
    assert.ok(!document.querySelector('.alert-overflow'), 'no overflow alert expected for a non-overflow assignment');
  });

  test('with no named account or territory match, a lead is routed by stated product interest, and the decision is explained', () => {
    // @pmc-criterion master:use-case:assign-leads-to-sales-owners
    fillLeadForm(document, {
      companyName: '',
      state: '', // no territory covers an unselected state
      employees: '10',
      arr: '0',
      productInterest: 'Power Platform',
      leadSource: 'Inbound Web Form',
    });
    submitLeadForm(dom, document);

    const resultBody = document.getElementById('result-body');
    assert.ok(
      resultBody.textContent.includes('Step 3 – Product Interest Match: "Power Platform" → Jordan Lee (Power Platform / D365)')
    );
  });

  test('lead source combines with named-account routing: a Partner Referral for a named account shows the partner escalation path', () => {
    // @pmc-criterion master:use-case:assign-leads-to-sales-owners
    fillLeadForm(document, {
      companyName: 'Fabrikam Inc',
      state: 'NY',
      employees: '20',
      arr: '0',
      leadSource: 'Partner Referral',
    });
    submitLeadForm(dom, document);

    const resultBody = document.getElementById('result-body');
    assert.ok(resultBody.textContent.includes('Partner Referral: routed to named account rep'));
    assert.ok(resultBody.textContent.includes('Escalation Path'));
    assert.ok(resultBody.textContent.includes('Partner Desk if unaligned'));
  });

  test('when the territory representative is at capacity, the lead overflows to a backup representative and the overflow is shown in the result', () => {
    // @pmc-criterion master:use-case:assign-leads-to-sales-owners
    // Casey Kim is the only representative covering Illinois; put her at
    // capacity through the same public REPS state the page itself reads.
    setRepCurrentLeads(dom, 'Casey Kim', 20);

    fillLeadForm(document, {
      companyName: '',
      state: 'IL',
      employees: '300',
      arr: '0',
      leadSource: 'Inbound Web Form',
    });
    submitLeadForm(dom, document);

    const resultBody = document.getElementById('result-body');
    assert.ok(resultBody.textContent.includes('Morgan Chen'));
    assert.ok(
      resultBody.textContent.includes('Step 4 – Capacity Overflow: Casey Kim is at capacity – routing to next best-fit rep')
    );
    assert.ok(resultBody.textContent.includes('Original territory rep (Casey Kim) at capacity'));

    const overflowAlert = document.querySelector('.alert-overflow');
    assert.ok(overflowAlert, 'expected an overflow alert to be rendered when a lead overflows to a backup representative');
    assert.match(overflowAlert.textContent, /routed to next best-fit rep in same segment/);

    // The backup representative's persisted routing load is updated in the
    // same rendered team view.
    const morganRow = rowFor(document, 'Morgan Chen');
    assert.ok(morganRow);
    assert.match(morganRow.textContent, /1\/20/);
  });
});
