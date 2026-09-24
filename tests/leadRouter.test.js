'use strict';

// Stable seam: leadRouter.js is a plain CommonJS/browser-dual module. Its public
// module API (`module.exports`) is the same `routeLead` / `getSegmentFromSize`
// functions that index.html's inline `<script>` calls directly on form submit
// (see index.html's `leadForm` submit handler: `const result = routeLead(lead);`).
// Requiring the module and calling its exported functions is therefore the
// outermost stable seam available for these two behaviors — there is no server
// or HTTP layer in this static demo app to sit in front of it.
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { routeLead, getSegmentFromSize } = require('../leadRouter.js');

describe('Executive referral routing (TC-1 — bmb_e_O9SGVZ3Vot)', () => {
  test('an Executive Referral lead is assigned to Avery Johnson and escalated for VP Sales engagement', () => {
    // @pmc-criterion master:business-rule:executive-referrals-go-to-avery
    const lead = {
      companyName: 'Unnamed Prospect Co',
      state: 'CA',
      employees: 40,
      arr: 0.3,
      leadSource: 'Executive Referral',
    };

    const result = routeLead(lead);

    // Pin every observable field of the routed result for this scenario so
    // the test fails on ANY deviation in the assignment or escalation
    // outcome, not only on the two fields checked individually below.
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

    // Outcome-focused assertions restated explicitly: this is the behavior
    // the criterion pins — assignment to Avery Johnson, plus VP Sales
    // escalation — so these must fail independently of the deepEqual above
    // if either outcome is removed or changed.
    assert.equal(result.assignedRep, 'Avery Johnson');
    assert.equal(result.territory, 'Northeast');
    assert.equal(result.escalation, 'VP Sales direct engagement');
    assert.equal(result.sla, 'Same-day contact required; VP Sales notified');
    assert.equal(result.isSDRPool, false);

    // Contrast within the same test: a lead whose state, size, and company
    // profile would normally route to a completely different rep and
    // segment under standard territory/segment rules (Skyler Williams,
    // Mid-Market, Texas) must still be overridden to Avery Johnson with the
    // VP Sales escalation once the source is an Executive Referral. This
    // proves the assignment is driven by the Executive Referral source
    // itself, not a coincidental territory/segment match on the first lead.
    const overrideLead = {
      companyName: 'Some Other Prospect LLC',
      state: 'TX',
      employees: 50,
      arr: 0.1,
      leadSource: 'Executive Referral',
    };

    const overrideResult = routeLead(overrideLead);

    assert.equal(overrideResult.assignedRep, 'Avery Johnson');
    assert.equal(overrideResult.territory, 'Northeast');
    assert.equal(overrideResult.escalation, 'VP Sales direct engagement');
    assert.equal(overrideResult.sla, 'Same-day contact required; VP Sales notified');
  });

  test('contrast: a non-executive-referral lead with the same company profile is routed elsewhere and is not escalated to VP Sales', () => {
    // @pmc-criterion master:business-rule:executive-referrals-go-to-avery
    const lead = {
      companyName: 'Unnamed Prospect Co',
      state: 'CA',
      employees: 40,
      arr: 0.3,
      leadSource: 'Inbound Web Form',
    };

    const result = routeLead(lead);

    assert.notEqual(result.assignedRep, 'Avery Johnson');
    assert.notEqual(result.escalation, 'VP Sales direct engagement');
  });
});

describe('Lead segmentation thresholds (TC-3 — bmb_zjwI1dzbe_z2)', () => {
  test('1,000 or more employees classifies a lead as Enterprise', () => {
    // @pmc-criterion master:business-rule:enterprise-thresholds-determine-lead-segment
    assert.equal(getSegmentFromSize(1000, 0), 'Enterprise');
    assert.equal(getSegmentFromSize(5000, 0), 'Enterprise');
  });

  test('ARR above $10M classifies a lead as Enterprise even below the employee threshold', () => {
    // @pmc-criterion master:business-rule:enterprise-thresholds-determine-lead-segment
    assert.equal(getSegmentFromSize(10, 10.01), 'Enterprise');
  });

  test('boundary: 999 employees alone does not qualify as Enterprise', () => {
    // @pmc-criterion master:business-rule:enterprise-thresholds-determine-lead-segment
    assert.equal(getSegmentFromSize(999, 0), 'Mid-Market');
  });

  test('boundary: exactly $10M ARR alone does not qualify as Enterprise (threshold is "above" $10M)', () => {
    // @pmc-criterion master:business-rule:enterprise-thresholds-determine-lead-segment
    // Contrast case for the Enterprise ARR condition: $10M exactly must fall
    // through to the Mid-Market check, not the Enterprise one.
    assert.equal(getSegmentFromSize(999, 10), 'Mid-Market');
  });

  test('100 or more employees classifies a non-Enterprise lead as Mid-Market', () => {
    // @pmc-criterion master:business-rule:enterprise-thresholds-determine-lead-segment
    assert.equal(getSegmentFromSize(100, 0), 'Mid-Market');
    assert.equal(getSegmentFromSize(500, 0), 'Mid-Market');
  });

  test('ARR of at least $1M classifies a non-Enterprise lead as Mid-Market', () => {
    // @pmc-criterion master:business-rule:enterprise-thresholds-determine-lead-segment
    assert.equal(getSegmentFromSize(10, 1), 'Mid-Market');
    assert.equal(getSegmentFromSize(10, 5), 'Mid-Market');
  });

  test('boundary: 99 employees and $0.99M ARR together do not qualify as Mid-Market', () => {
    // @pmc-criterion master:business-rule:enterprise-thresholds-determine-lead-segment
    // Contrast case for the Mid-Market conditions: just under both thresholds
    // must fall through to SMB.
    assert.equal(getSegmentFromSize(99, 0.99), 'SMB');
  });

  test('a lead meeting neither the Enterprise nor Mid-Market thresholds is classified as SMB', () => {
    // @pmc-criterion master:business-rule:enterprise-thresholds-determine-lead-segment
    assert.equal(getSegmentFromSize(0, 0), 'SMB');
    assert.equal(getSegmentFromSize(10, 0.1), 'SMB');
  });

  test('the segmentation rule surfaces through routeLead\'s observable result, not just the isolated helper', () => {
    // @pmc-criterion master:business-rule:enterprise-thresholds-determine-lead-segment
    const enterpriseLead = {
      companyName: '',
      state: 'NY',
      employees: 1000,
      arr: 0,
      leadSource: 'Inbound Web Form',
    };

    const result = routeLead(enterpriseLead);

    assert.equal(result.segment, 'Enterprise');
    assert.equal(result.assignedRep, 'Avery Johnson');
  });
});
