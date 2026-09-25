'use strict';

// Stable seam: leadRouter.js is a plain CommonJS/browser-dual module. Its public
// module API (`module.exports.routeLead`) is the exact function index.html's
// inline <script> calls on form submit (`const result = routeLead(lead);`).
// Requiring the module and calling its exported `routeLead` is therefore the
// outermost stable seam available for these behaviors — there is no server or
// HTTP layer in this static demo app to sit in front of it. No internal class
// is instantiated and no internal collaborator is mocked. These SLA statements
// are static text derived from segment/source (no real-time business-hour
// arithmetic happens in the code today), so no clock needs to be mocked either
// — the assertions below pin the observable `sla`/`escalation` fields exactly
// as the module returns them today.
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { routeLead } = require('../leadRouter.js');

describe('Partner referral accelerated follow-up SLA (TC-1 — bmb_0KqMN8Mw_1RG)', () => {
  test('a Partner Referral lead carries acknowledgment within 1 business hour and first contact within 4 business hours', () => {
    // @pmc-criterion master:business-rule:partner-referrals-require-accelerated-response
    const lead = {
      companyName: 'Unnamed Partner Co',
      state: 'AZ',
      employees: 200,
      arr: 0.5,
      productInterest: '',
      leadSource: 'Partner Referral',
    };

    const result = routeLead(lead);

    assert.equal(
      result.sla,
      'Partner acknowledgment within 1 business hour; first contact within 4 business hours'
    );
  });

  test('contrast: the same lead profile without a Partner Referral source does not carry the accelerated partner SLA', () => {
    // @pmc-criterion master:business-rule:partner-referrals-require-accelerated-response
    const lead = {
      companyName: 'Unnamed Partner Co',
      state: 'AZ',
      employees: 200,
      arr: 0.5,
      productInterest: '',
      leadSource: 'Inbound Web Form',
    };

    const result = routeLead(lead);

    assert.notEqual(
      result.sla,
      'Partner acknowledgment within 1 business hour; first contact within 4 business hours'
    );
    assert.equal(result.sla, 'First contact within 4 business hours');
  });
});

describe('Segment-based follow-up SLAs (TC-3 — bmb_Xeq4-rFpWPQ2)', () => {
  test('an Enterprise lead carries a first-contact deadline of 2 business hours', () => {
    // @pmc-criterion master:business-rule:segment-based-follow-up-slas-apply
    const lead = {
      companyName: '',
      state: 'WA',
      employees: 1500,
      arr: 0,
      productInterest: '',
      leadSource: 'Inbound Web Form',
    };

    const result = routeLead(lead);

    assert.equal(result.segment, 'Enterprise');
    assert.equal(result.sla, 'First contact within 2 business hours');
  });

  test('a Mid-Market lead carries a first-contact deadline of 4 business hours', () => {
    // @pmc-criterion master:business-rule:segment-based-follow-up-slas-apply
    const lead = {
      companyName: '',
      state: 'AZ',
      employees: 200,
      arr: 0,
      productInterest: '',
      leadSource: 'Inbound Web Form',
    };

    const result = routeLead(lead);

    assert.equal(result.segment, 'Mid-Market');
    assert.equal(result.sla, 'First contact within 4 business hours');
  });

  test('an SMB lead carries a first-contact deadline of 1 business day', () => {
    // @pmc-criterion master:business-rule:segment-based-follow-up-slas-apply
    const lead = {
      companyName: '',
      state: 'GA',
      employees: 10,
      arr: 0,
      productInterest: '',
      leadSource: 'Inbound Web Form',
    };

    const result = routeLead(lead);

    assert.equal(result.segment, 'SMB');
    assert.equal(result.sla, 'First contact within 1 business day');
  });
});

describe('Executive referral same-day contact and VP Sales notification (TC-4 — bmb_XhWQnTnjBEjH)', () => {
  test('an Executive Referral lead requires same-day contact and records VP Sales notification', () => {
    // @pmc-criterion master:business-rule:executive-referrals-require-same-day-contact
    const lead = {
      companyName: '',
      state: 'NY',
      employees: 1200,
      arr: 0,
      productInterest: '',
      leadSource: 'Executive Referral',
    };

    const result = routeLead(lead);

    // The module has no separate notification service — the `escalation`
    // field returned by this public seam IS the observable record of the
    // VP Sales notification for this static demo app, alongside the
    // same-day contact requirement carried in `sla`.
    assert.equal(result.sla, 'Same-day contact required; VP Sales notified');
    assert.equal(result.escalation, 'VP Sales direct engagement');
  });

  test('contrast: the same company profile without an Executive Referral source does not require same-day contact or notify VP Sales', () => {
    // @pmc-criterion master:business-rule:executive-referrals-require-same-day-contact
    const lead = {
      companyName: '',
      state: 'NY',
      employees: 1200,
      arr: 0,
      productInterest: '',
      leadSource: 'Inbound Web Form',
    };

    const result = routeLead(lead);

    assert.notEqual(result.sla, 'Same-day contact required; VP Sales notified');
    assert.notEqual(result.escalation, 'VP Sales direct engagement');
    assert.equal(result.sla, 'First contact within 2 business hours');
  });
});
