// Contoso Sales – Lead Routing Engine
// Implements the routing policy from Version 2.4 | Q1 2025

const REPS = [
  {
    name: "Alex Rivera",
    territory: "Pacific NW",
    states: ["WA", "OR"],
    segment: "Enterprise",
    productFocus: ["Azure", "Copilot Studio"],
    capacity: 15,
    currentLeads: 0,
    isCopilotStudioSME: true,
    backupFor: [],
  },
  {
    name: "Jordan Lee",
    territory: "California",
    states: ["CA"],
    segment: "Enterprise",
    productFocus: ["Power Platform", "D365"],
    capacity: 15,
    currentLeads: 0,
    backupFor: [],
  },
  {
    name: "Morgan Chen",
    territory: "Southwest",
    states: ["AZ", "NM", "NV", "UT"],
    segment: "Mid-Market",
    productFocus: ["Microsoft 365", "Teams"],
    capacity: 20,
    currentLeads: 0,
    backupFor: [],
  },
  {
    name: "Taylor Brooks",
    territory: "Mountain West",
    states: ["CO", "WY", "MT", "ID"],
    segment: "Mid-Market",
    productFocus: ["Azure", "AI Services"],
    capacity: 20,
    currentLeads: 0,
    isAzureTrialPrimary: true,
    backupFor: [],
  },
  {
    name: "Casey Kim",
    territory: "Midwest",
    states: ["IL", "IN", "MN", "IA", "MO", "KS", "NE", "SD", "ND", "WI"],
    segment: "Mid-Market",
    productFocus: ["Power Platform"],
    capacity: 20,
    currentLeads: 0,
    isCopilotStudioBackup: true,
    backupFor: [],
  },
  {
    name: "Dana Nguyen",
    territory: "Great Lakes",
    states: ["MI", "OH"],
    segment: "Enterprise",
    productFocus: ["D365 Sales", "Customer Insights"],
    capacity: 15,
    currentLeads: 0,
    backupFor: [],
  },
  {
    name: "Riley Patel",
    territory: "Southeast",
    states: ["GA", "FL", "NC", "SC", "TN", "AL", "MS", "VA", "KY", "AR", "LA"],
    segment: "SMB",
    productFocus: ["Microsoft 365", "Teams"],
    capacity: 25,
    currentLeads: 0,
    isInboundCallPool: true,
    backupFor: [],
  },
  {
    name: "Quinn Torres",
    territory: "Mid-Atlantic",
    states: ["MD", "DE", "NJ", "PA", "DC"],
    segment: "SMB",
    productFocus: ["Power Platform", "Copilot"],
    capacity: 25,
    currentLeads: 0,
    isCopilotStudioBackup: true,
    isInboundCallPool: true,
    backupFor: [],
  },
  {
    name: "Avery Johnson",
    territory: "Northeast",
    states: ["NY", "MA", "CT", "RI", "NH", "VT", "ME"],
    segment: "Enterprise",
    productFocus: ["Azure", "Fabric", "Copilot"],
    capacity: 15,
    currentLeads: 0,
    isAzureTrialPrimary: true,
    isExecutiveReferralPrimary: true,
    isInboundCallPool: false,
    backupFor: [],
  },
  {
    name: "Skyler Williams",
    territory: "Texas",
    states: ["TX"],
    segment: "Mid-Market",
    productFocus: ["D365", "Power Platform"],
    capacity: 22,
    currentLeads: 0,
    isInboundCallPool: true,
    backupFor: [],
  },
];

// Named account list (demo data – in production this would come from D365)
const NAMED_ACCOUNTS = {
  "Contoso Ltd": "Avery Johnson",
  "Fabrikam Inc": "Jordan Lee",
  "Northwind Traders": "Dana Nguyen",
  "Adventure Works": "Alex Rivera",
  "Woodgrove Bank": "Quinn Torres",
};

// Round-robin state for inbound call/chat routing
let inboundCallIndex = 0;

function getSegmentFromSize(employees, arr) {
  // arr is in millions (e.g. 10 means $10M)
  if (employees >= 1000 || arr > 10) return "Enterprise";
  if (employees >= 100 || arr >= 1) return "Mid-Market";
  return "SMB";
}

function repAtCapacity(rep) {
  return rep.currentLeads >= rep.capacity;
}

function findNextBestRep(primaryRep) {
  // Find next available rep in same segment
  const candidates = REPS.filter(
    (r) => r.name !== primaryRep.name && r.segment === primaryRep.segment && !repAtCapacity(r)
  );
  if (candidates.length > 0) return candidates[0];

  // Fallback: any rep in same segment even if at capacity (soft ceiling)
  const softCandidates = REPS.filter(
    (r) => r.name !== primaryRep.name && r.segment === primaryRep.segment
  );
  return softCandidates.length > 0 ? softCandidates[0] : null;
}

function getSLA(segment, leadSource) {
  if (leadSource === "Partner Referral") {
    return "Partner acknowledgment within 1 business hour; first contact within 4 business hours";
  }
  if (leadSource === "Executive Referral") {
    return "Same-day contact required; VP Sales notified";
  }
  if (segment === "Enterprise") return "First contact within 2 business hours";
  if (segment === "Mid-Market") return "First contact within 4 business hours";
  return "First contact within 1 business day";
}

function routeLead(lead) {
  const {
    companyName,
    state,
    employees,
    arr, // annual recurring revenue in $M
    productInterest,
    leadSource,
    azureTrialUsage, // monthly spend in $
    eventOwnerRep,
    isExistingAccount,
    existingAccountRep,
    arrForEscalation, // for inbound call/chat ARR check
  } = lead;

  let assignedRep = null;
  let reason = "";
  let escalation = "";
  let needsBackup = false;

  // ── Special source routing ──────────────────────────────────────────

  // Executive Referral → Avery Johnson
  if (leadSource === "Executive Referral") {
    const avery = REPS.find((r) => r.isExecutiveReferralPrimary);
    assignedRep = avery;
    reason = "Executive Referral: routed to Avery Johnson (Northeast Enterprise)";
    escalation = "VP Sales direct engagement";
    return buildResult(assignedRep, reason, escalation, lead);
  }

  // Copilot Studio POC Request → Alex Rivera first
  if (leadSource === "Copilot Studio POC") {
    const alex = REPS.find((r) => r.isCopilotStudioSME);
    if (!repAtCapacity(alex)) {
      assignedRep = alex;
      reason = "Copilot Studio POC: routed to Alex Rivera (national SME, first right of refusal)";
      escalation = "If Alex unavailable: Casey Kim or Quinn Torres";
    } else {
      const backup = REPS.find((r) => r.isCopilotStudioBackup && !repAtCapacity(r));
      assignedRep = backup || REPS.find((r) => r.isCopilotStudioBackup);
      reason = "Copilot Studio POC: Alex Rivera at capacity – routed to backup";
      escalation = "Casey Kim or Quinn Torres (Copilot Studio backups)";
      needsBackup = true;
    }
    return buildResult(assignedRep, reason, escalation, lead, needsBackup);
  }

  // Azure Trial Signup with usage > $500/mo
  if (leadSource === "Azure Trial Signup") {
    if (azureTrialUsage > 500) {
      const azurePrimaries = REPS.filter((r) => r.isAzureTrialPrimary);
      const available = azurePrimaries.find((r) => !repAtCapacity(r));
      assignedRep = available || azurePrimaries[0];
      reason = `Azure Trial Signup (usage $${azureTrialUsage}/mo > $500): routed to Azure specialist`;
      escalation = "Tech specialist overlay if needed";
    } else {
      // Low usage – treat as standard inbound
      reason = "Azure Trial Signup (usage ≤ $500/mo): applying standard territory routing";
    }
    if (assignedRep) {
      return buildResult(assignedRep, reason, escalation, lead);
    }
  }

  // Renewal / Upsell Signal → existing account owner
  if (leadSource === "Renewal/Upsell" && isExistingAccount && existingAccountRep) {
    const rep = REPS.find((r) => r.name === existingAccountRep);
    if (rep) {
      assignedRep = rep;
      reason = "Renewal/Upsell: routed to existing account owner";
      escalation = arr > 0.05 ? "CSM co-sell (deal > $50K)" : "";
      return buildResult(assignedRep, reason, escalation, lead);
    }
  }

  // Trade Show / Event
  if (leadSource === "Trade Show/Event" && eventOwnerRep) {
    const rep = REPS.find((r) => r.name === eventOwnerRep);
    if (rep) {
      assignedRep = rep;
      reason = `Trade Show/Event: routed to event sponsor rep (${eventOwnerRep})`;
      escalation = "Pool to regional rep if no claim within 24 hours";
      return buildResult(assignedRep, reason, escalation, lead);
    }
  }

  // Partner Referral
  if (leadSource === "Partner Referral") {
    // Named account takes priority
    if (companyName && NAMED_ACCOUNTS[companyName]) {
      const rep = REPS.find((r) => r.name === NAMED_ACCOUNTS[companyName]);
      if (rep) {
        assignedRep = rep;
        reason = "Partner Referral: routed to named account rep";
        escalation = "Partner Desk if unaligned";
        return buildResult(assignedRep, reason, escalation, lead);
      }
    }
    // Fall through to territory routing with partner escalation noted
    escalation = "Partner Desk if no aligned rep found";
  }

  // Inbound Call / Chat → round-robin among SMB pool, escalate if ARR > $25K
  if (leadSource === "Inbound Call/Chat") {
    // arrForEscalation and arr are in $M; $25K = 0.025M
    const arrValue = arrForEscalation || arr;
    if (arrValue > 0.025) {
      // Escalate to mid-market rep – find one by territory, else any available
      const stateUpper = state ? state.toUpperCase() : "";
      const midMarketByTerritory = REPS.find(
        (r) => r.states.includes(stateUpper) && r.segment === "Mid-Market" && !repAtCapacity(r)
      );
      const anyMidMarket = REPS.find(
        (r) => r.segment === "Mid-Market" && !repAtCapacity(r)
      );
      assignedRep = midMarketByTerritory || anyMidMarket || REPS.find((r) => r.segment === "Mid-Market");
      reason = "Inbound Call/Chat: ARR > $25K – escalating to Mid-Market rep";
      escalation = "Escalated from SMB inbound pool due to company ARR > $25K";
      return buildResult(assignedRep, reason, escalation, lead, false, "Mid-Market");
    } else {
      const pool = REPS.filter((r) => r.isInboundCallPool);
      assignedRep = pool[inboundCallIndex % pool.length];
      inboundCallIndex++;
      reason = "Inbound Call/Chat: round-robin among SMB pool (Riley / Quinn / Skyler)";
      escalation = "Escalate to Mid-Market rep if ARR > $25K";
      return buildResult(assignedRep, reason, escalation, lead);
    }
  }

  // ── Standard priority routing ────────────────────────────────────────

  const segment = getSegmentFromSize(employees, arr);

  // Step 1 – Named Account Match
  if (companyName && NAMED_ACCOUNTS[companyName]) {
    const rep = REPS.find((r) => r.name === NAMED_ACCOUNTS[companyName]);
    if (rep) {
      assignedRep = rep;
      reason = `Step 1 – Named Account Match: "${companyName}" is assigned to ${rep.name}`;
      escalation = "";
      return buildResult(assignedRep, reason, escalation, lead, false, segment);
    }
  }

  // Step 2 – Territory + Segment Match
  const stateUpper = state ? state.toUpperCase() : "";
  let territoryRep = REPS.find(
    (r) => r.states.includes(stateUpper) && r.segment === segment
  );

  if (!territoryRep) {
    // Try territory match regardless of segment (closest match)
    territoryRep = REPS.find((r) => r.states.includes(stateUpper));
  }

  if (territoryRep) {
    if (!repAtCapacity(territoryRep)) {
      assignedRep = territoryRep;
      reason = `Step 2 – Territory + Segment Match: ${state} → ${territoryRep.territory} (${territoryRep.segment})`;
    } else {
      // Step 4 – Capacity overflow
      const overflow = findNextBestRep(territoryRep);
      assignedRep = overflow || territoryRep;
      needsBackup = true;
      reason = `Step 4 – Capacity Overflow: ${territoryRep.name} is at capacity – routing to next best-fit rep`;
      escalation = `Original territory rep (${territoryRep.name}) at capacity`;
    }
    return buildResult(assignedRep, reason, escalation, lead, needsBackup, segment);
  }

  // Step 3 – Product Interest Match
  if (productInterest) {
    const productLower = productInterest.toLowerCase();
    const productRep = REPS.find(
      (r) =>
        !repAtCapacity(r) &&
        r.productFocus.some((p) => p.toLowerCase().includes(productLower) || productLower.includes(p.toLowerCase()))
    );
    if (productRep) {
      assignedRep = productRep;
      reason = `Step 3 – Product Interest Match: "${productInterest}" → ${productRep.name} (${productRep.productFocus.join(" / ")})`;
      return buildResult(assignedRep, reason, escalation, lead, false, segment);
    }
  }

  // Step 5 – SDR Pool
  reason = "Step 5 – No match found: lead entered SDR pool for manual assignment";
  escalation = "SDR Manager to assign within 4 business hours";
  return buildResult(null, reason, escalation, lead, false, segment);
}

function buildResult(rep, reason, escalation, lead, isOverflow = false, segmentOverride = null) {
  const segment =
    segmentOverride ||
    (rep ? rep.segment : getSegmentFromSize(lead.employees || 0, lead.arr || 0));
  const sla = getSLA(segment, lead.leadSource);

  return {
    assignedRep: rep ? rep.name : "SDR Pool",
    territory: rep ? rep.territory : "N/A",
    segment: rep ? rep.segment : segment,
    productFocus: rep ? rep.productFocus.join(" / ") : "—",
    reason,
    escalation: escalation || "",
    sla,
    isOverflow,
    isSDRPool: !rep,
  };
}

// Export for use in browser and Node environments
if (typeof module !== "undefined" && module.exports) {
  module.exports = { routeLead, REPS, NAMED_ACCOUNTS, getSegmentFromSize };
}
