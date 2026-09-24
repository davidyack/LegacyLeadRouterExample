'use strict';

// Stable seam: leadRouter.js is a plain CommonJS/browser-dual module. Its public
// module API (`module.exports`) is the same `routeLead` / `getSegmentFromSize`
// functions that index.html's inline `<script>` calls directly on form submit
// (see index.html's `leadForm` submit handler: `const result = routeLead(lead);`).
// Requiring the module and calling its exported functions is therefore the
// outermost stable seam available for these behaviors — there is no server
// or HTTP layer in this static demo app to sit in front of it. `REPS` is also
// part of that same public module API (`module.exports`), so reading/setting
// a rep's `currentLeads` to model "at capacity" is configuring public state
// through the seam, not reaching into a private/internal collaborator.
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { routeLead, getSegmentFromSize, REPS } = require('../leadRouter.js');

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

describe('Route leads to best rep (TC-1 — bmb_aRD9TxRgCruJ)', () => {
  test('inbound leads, partner referrals, and event-sourced opportunities route by account/geography/segment/product-interest/source rules, and a full or unmatched preferred rep overflows to the next-best rep or the SDR pool', () => {
    // @pmc-criterion master:use-case:route-leads-to-best-rep
    //
    // Each phase below pins one rule the criterion names, through the same
    // public `routeLead` seam index.html's submit handler calls, and asserts
    // the full observable result (assignment, territory/segment/product
    // shown to the rep, reason, escalation, SLA, and overflow/SDR flags) so
    // the test fails if any of these rule outcomes is changed.

    // Phase 1 — Account rule: a named account is assigned to its named rep
    // even though the lead's own state (TX → Skyler Williams' territory) and
    // company-size profile (SMB) point elsewhere. This proves the account
    // rule outranks geography and segment for the assigned rep, territory,
    // and product focus shown — while the SLA still reflects the lead's own
    // SMB profile, the current (if surprising) behavior of this rule.
    const namedAccountLead = {
      companyName: 'Adventure Works',
      state: 'TX',
      employees: 50,
      arr: 0.2,
      leadSource: 'Inbound Web Form',
    };
    assert.deepEqual(routeLead(namedAccountLead), {
      assignedRep: 'Alex Rivera',
      territory: 'Pacific NW',
      segment: 'Enterprise',
      productFocus: 'Azure / Copilot Studio',
      reason: 'Step 1 – Named Account Match: "Adventure Works" is assigned to Alex Rivera',
      escalation: '',
      sla: 'First contact within 1 business day',
      isOverflow: false,
      isSDRPool: false,
    });

    // Phase 2 — Geography + segment rule: an unnamed Mid-Market lead in
    // Arizona is assigned to the Southwest Mid-Market rep, not merely by
    // state and not merely by segment, but by the combination of both.
    const territorySegmentLead = {
      companyName: '',
      state: 'AZ',
      employees: 300,
      arr: 0,
      leadSource: 'Inbound Web Form',
    };
    assert.deepEqual(routeLead(territorySegmentLead), {
      assignedRep: 'Morgan Chen',
      territory: 'Southwest',
      segment: 'Mid-Market',
      productFocus: 'Microsoft 365 / Teams',
      reason: 'Step 2 – Territory + Segment Match: AZ → Southwest (Mid-Market)',
      escalation: '',
      sla: 'First contact within 4 business hours',
      isOverflow: false,
      isSDRPool: false,
    });

    // Phase 3 — Product-interest rule: a lead from a state with no covering
    // territory rep (Hawaii) still finds an owner by matching stated product
    // interest against reps' product focus.
    const productInterestLead = {
      companyName: '',
      state: 'HI',
      employees: 10,
      arr: 0,
      leadSource: 'Inbound Web Form',
      productInterest: 'Power Platform',
    };
    assert.deepEqual(routeLead(productInterestLead), {
      assignedRep: 'Jordan Lee',
      territory: 'California',
      segment: 'Enterprise',
      productFocus: 'Power Platform / D365',
      reason: 'Step 3 – Product Interest Match: "Power Platform" → Jordan Lee (Power Platform / D365)',
      escalation: '',
      sla: 'First contact within 1 business day',
      isOverflow: false,
      isSDRPool: false,
    });

    // Phase 4 — Source rule (partner referral, named account): a Partner
    // Referral for a named account gets the named-account rep and the
    // partner-specific escalation/SLA, distinct from the plain named-account
    // path in Phase 1.
    const partnerNamedLead = {
      companyName: 'Fabrikam Inc',
      state: 'NY',
      employees: 20,
      arr: 0,
      leadSource: 'Partner Referral',
    };
    assert.deepEqual(routeLead(partnerNamedLead), {
      assignedRep: 'Jordan Lee',
      territory: 'California',
      segment: 'Enterprise',
      productFocus: 'Power Platform / D365',
      reason: 'Partner Referral: routed to named account rep',
      escalation: 'Partner Desk if unaligned',
      sla: 'Partner acknowledgment within 1 business hour; first contact within 4 business hours',
      isOverflow: false,
      isSDRPool: false,
    });

    // Phase 5 — Source rule (partner referral, unnamed account): with no
    // named-account match, the partner referral still falls through to
    // territory + segment routing, but keeps its partner-specific
    // escalation note and SLA — proving source rules combine with
    // geography/segment rules rather than being replaced by them.
    const partnerUnnamedLead = {
      companyName: 'Unnamed Partner Co',
      state: 'CO',
      employees: 300,
      arr: 0,
      leadSource: 'Partner Referral',
    };
    assert.deepEqual(routeLead(partnerUnnamedLead), {
      assignedRep: 'Taylor Brooks',
      territory: 'Mountain West',
      segment: 'Mid-Market',
      productFocus: 'Azure / AI Services',
      reason: 'Step 2 – Territory + Segment Match: CO → Mountain West (Mid-Market)',
      escalation: 'Partner Desk if no aligned rep found',
      sla: 'Partner acknowledgment within 1 business hour; first contact within 4 business hours',
      isOverflow: false,
      isSDRPool: false,
    });

    // Phase 6 — Source rule (event-sourced opportunity): a Trade Show/Event
    // lead with a claimed event-owner rep is assigned directly to that rep.
    const eventLead = {
      companyName: '',
      state: 'GA',
      employees: 50,
      arr: 0,
      leadSource: 'Trade Show/Event',
      eventOwnerRep: 'Riley Patel',
    };
    assert.deepEqual(routeLead(eventLead), {
      assignedRep: 'Riley Patel',
      territory: 'Southeast',
      segment: 'SMB',
      productFocus: 'Microsoft 365 / Teams',
      reason: 'Trade Show/Event: routed to event sponsor rep (Riley Patel)',
      escalation: 'Pool to regional rep if no claim within 24 hours',
      sla: 'First contact within 1 business day',
      isOverflow: false,
      isSDRPool: false,
    });

    // Phase 7 — Overflow to the next-best rep: when the preferred
    // territory+segment rep (Casey Kim, the only Illinois-covering rep) is
    // full, an Illinois Mid-Market lead overflows to the next-best
    // Mid-Market rep instead of staying with — or being silently dropped
    // by — the full preferred rep, and ownership of the overflow is
    // observable (`isOverflow: true`, an escalation naming the original
    // full rep, and a distinct assignedRep).
    const casey = REPS.find((r) => r.name === 'Casey Kim');
    const originalCaseyLeads = casey.currentLeads;
    try {
      casey.currentLeads = casey.capacity;
      const overflowLead = {
        companyName: '',
        state: 'IL',
        employees: 300,
        arr: 0,
        leadSource: 'Inbound Web Form',
      };
      const overflowResult = routeLead(overflowLead);
      assert.deepEqual(overflowResult, {
        assignedRep: 'Morgan Chen',
        territory: 'Southwest',
        segment: 'Mid-Market',
        productFocus: 'Microsoft 365 / Teams',
        reason: 'Step 4 – Capacity Overflow: Casey Kim is at capacity – routing to next best-fit rep',
        escalation: 'Original territory rep (Casey Kim) at capacity',
        sla: 'First contact within 4 business hours',
        isOverflow: true,
        isSDRPool: false,
      });
      assert.notEqual(overflowResult.assignedRep, 'Casey Kim');
    } finally {
      casey.currentLeads = originalCaseyLeads;
    }

    // Phase 8 — Overflow to the SDR pool: a lead with no territory match and
    // no product-interest match keeps ownership clear by explicitly landing
    // in the SDR pool for manual assignment, rather than being silently
    // dropped or misassigned.
    const sdrPoolLead = {
      companyName: '',
      state: 'HI',
      employees: 10,
      arr: 0,
      leadSource: 'Inbound Web Form',
    };
    assert.deepEqual(routeLead(sdrPoolLead), {
      assignedRep: 'SDR Pool',
      territory: 'N/A',
      segment: 'SMB',
      productFocus: '—',
      reason: 'Step 5 – No match found: lead entered SDR pool for manual assignment',
      escalation: 'SDR Manager to assign within 4 business hours',
      sla: 'First contact within 1 business day',
      isOverflow: false,
      isSDRPool: true,
    });
  });
});

describe('Copilot Studio POC routing (TC-2 — bmb_TJKIzmg_E3WC)', () => {
  test('a Copilot Studio POC request is assigned to Alex Rivera while he has capacity, then overflows to Casey Kim, and to Quinn Torres when Casey is also full', () => {
    // @pmc-criterion master:business-rule:copilot-pocs-prioritize-alex-rivera
    const alex = REPS.find((r) => r.name === 'Alex Rivera');
    const casey = REPS.find((r) => r.name === 'Casey Kim');
    const quinn = REPS.find((r) => r.name === 'Quinn Torres');
    const originalAlexLeads = alex.currentLeads;
    const originalCaseyLeads = casey.currentLeads;
    const originalQuinnLeads = quinn.currentLeads;

    const copilotLead = {
      companyName: '',
      state: 'WA',
      employees: 5000,
      arr: 20,
      leadSource: 'Copilot Studio POC',
    };

    try {
      // Phase 1 — Alex Rivera has capacity: the request stays with him as
      // national SME, with no overflow flagged.
      alex.currentLeads = 0;
      assert.deepEqual(routeLead(copilotLead), {
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

      // Phase 2 — Alex Rivera is full: the request overflows to backup
      // Casey Kim, with clear overflow ownership (`isOverflow: true`) and an
      // escalation naming both eligible backups.
      alex.currentLeads = alex.capacity;
      casey.currentLeads = 0;
      const caseyBackupResult = routeLead(copilotLead);
      assert.deepEqual(caseyBackupResult, {
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
      assert.notEqual(caseyBackupResult.assignedRep, 'Alex Rivera');

      // Phase 3 — Alex Rivera AND Casey Kim are both full: the request
      // overflows to the other named backup, Quinn Torres, proving both
      // backups named by the criterion are genuinely reachable, not just
      // the first one in the rep list.
      casey.currentLeads = casey.capacity;
      quinn.currentLeads = 0;
      const quinnBackupResult = routeLead(copilotLead);
      assert.deepEqual(quinnBackupResult, {
        assignedRep: 'Quinn Torres',
        territory: 'Mid-Atlantic',
        segment: 'SMB',
        productFocus: 'Power Platform / Copilot',
        reason: 'Copilot Studio POC: Alex Rivera at capacity – routed to backup',
        escalation: 'Casey Kim or Quinn Torres (Copilot Studio backups)',
        sla: 'First contact within 1 business day',
        isOverflow: true,
        isSDRPool: false,
      });
      assert.notEqual(quinnBackupResult.assignedRep, 'Casey Kim');
    } finally {
      alex.currentLeads = originalAlexLeads;
      casey.currentLeads = originalCaseyLeads;
      quinn.currentLeads = originalQuinnLeads;
    }
  });
});
