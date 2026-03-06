# LegacyLeadRouterExample

Contoso Sales
Lead Routing Policy & Territory Guide
Version 2.4  |  Effective: Q1 2025  |  Owner: VP Sales Operations
1. Purpose & Scope
This document defines Contoso's lead routing rules, territory assignments, and escalation procedures for the North America commercial sales team. All inbound leads, partner referrals, and event-sourced opportunities are governed by these policies to ensure fast follow-up, fair distribution, and clear ownership.
These rules apply to all 10 quota-carrying Account Executives (AEs) across Enterprise, Mid-Market, and SMB segments.
2. Sales Team & Territory Assignments
The table below maps each AE to their primary territory, target segment, product specialization, and monthly lead capacity.

Rep Name	Territory	Segment	Product Focus	Capacity (leads/mo)
Alex Rivera	Pacific NW	Enterprise	Azure / Copilot Studio	15
Jordan Lee	California	Enterprise	Power Platform / D365	15
Morgan Chen	Southwest	Mid-Market	Microsoft 365 / Teams	20
Taylor Brooks	Mountain West	Mid-Market	Azure / AI Services	20
Casey Kim	Midwest	Mid-Market	Power Platform	20
Dana Nguyen	Great Lakes	Enterprise	D365 Sales / Customer Insights	15
Riley Patel	Southeast	SMB	Microsoft 365 / Teams	25
Quinn Torres	Mid-Atlantic	SMB	Power Platform / Copilot	25
Avery Johnson	Northeast	Enterprise	Azure / Fabric / Copilot	15
Skyler Williams	Texas	Mid-Market/SMB	D365 / Power Platform	22

Notes:
•	Capacity limits are soft ceilings; overflow leads route to the next best-fit rep in the same segment.
•	Enterprise reps (capacity 15) carry larger deal sizes (target ACV > $75K); SMB reps carry higher volume.
•	Alex Rivera serves as the national Copilot Studio SME and has first right of refusal on any Copilot Studio POC request regardless of territory.

3. Lead Routing Rules
3.1 Primary Routing Logic
All leads are scored and routed through Dynamics 365 Sales using the following priority order:
•	Step 1 — Named Account Match: If the lead's company is in an AE's named account list, route directly to that AE.
•	Step 2 — Territory + Segment Match: Match lead geography (state/region) and company size (employees / ARR) to rep territory and segment.
•	Step 3 — Product Interest Match: If no clear territory match, route to the rep whose product focus aligns with the lead's expressed interest.
•	Step 4 — Capacity Check: If the best-fit rep is at capacity, route to the next rep in the same region/segment.
•	Step 5 — SDR Pool: Unmatched or overflow leads enter the SDR queue for manual assignment within 4 business hours.

3.2 Routing Rules by Lead Source

Lead Signal	Routing Criteria	Primary Rep	Escalation Path
Inbound Web Form	Territory + Segment match	Assigned by geo lookup	SDR reviews unmatched leads daily
Trade Show / Event	Event sponsor rep gets first right	Event owner rep	Pool to regional rep if no claim in 24h
Partner Referral	Referring partner's aligned rep	Named account rep	Partner Desk if unaligned
Azure Trial Signup	Usage > $500/mo in trial	Taylor Brooks or Avery Johnson	Tech specialist overlay
Copilot Studio POC Request	Any segment	Alex Rivera (primary)	Casey Kim or Quinn Torres as backup
Renewal / Upsell Signal	Existing account owner	Current account rep	CSM co-sell if deal > $50K
Inbound Call / Chat	Real-time round-robin (SMB)	Riley / Quinn / Skyler	Escalate to mid-market rep if ARR > $25K
Executive Referral	Named account or strategic	Avery Johnson	VP Sales direct engagement

4. SLA & Response Requirements
All routed leads must meet the following follow-up SLAs:
•	Enterprise leads: First contact within 2 business hours of routing.
•	Mid-Market leads: First contact within 4 business hours.
•	SMB leads: First contact within 1 business day.
•	Partner referrals: Acknowledgment to partner within 1 business hour; first contact with lead within 4 hours.
•	Executive referrals: Same-day contact, VP Sales notified.

5. Lead Reassignment & Disputes
Leads may be reassigned in the following circumstances:
•	Rep is on approved leave exceeding 3 business days — leads route to backup rep listed in D365.
•	Rep has not met SLA for contact — SDR Manager may reassign after 1 missed SLA with manager notification.
•	Territory or segment dispute — escalate to VP Sales Operations within 24 hours; decision is final.
•	Duplicate leads across reps — the rep with the earlier creation timestamp retains ownership.

6. Key Definitions
•	Enterprise: Companies with 1,000+ employees or > $10M ARR.
•	Mid-Market: Companies with 100–999 employees or $1M–$10M ARR.
•	SMB: Companies with < 100 employees or < $1M ARR.
•	Named Account: An account explicitly assigned to an AE in D365 Sales, overriding territory rules.
•	POC Request: A prospect-initiated request for a Proof of Concept engagement; requires AE + Technical Specialist assignment.
