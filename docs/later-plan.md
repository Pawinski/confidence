# Confidence: Later plan

Plan only, no app code. Order: **(1) real sign-in on Quebec hosting** (with the share audit log), then **(2) FHIR R4 export**. Written by FlorianBot, Mon 2 Nov 2026. Lives next to the product docs (`PRODUCT.md`, `docs/PROGRAM_DESIGN.md`); the repo has no separate roadmap file yet. Not legal advice: every legal point below is marked **needs legal review** before launch.

Today the record (`confidence.record.v1`) lives only in the browser's localStorage and nothing is sent. Phase 1 changes that, which is what triggers the obligations below.

## Phase 1: real sign-in on Quebec / Canada hosting

### Candidates (2–4, all verified on the vendor's public page; no pricing quoted, check the vendor page at decision time)

| Option | Where data lives | Notes |
|---|---|---|
| **Supabase Auth + Postgres, region `ca-central-1`** | AWS Canada (Central), Montréal | Supabase states the primary Postgres database, Auth service and Storage objects stay in the chosen region ([Supabase regions](https://supabase.com/regions), [docs](https://supabase.com/docs/guides/platform/regions)). Supabase itself says region choice "is a data-location control, not proof of regulatory compliance". Supabase is a US company: the CLOUD Act / foreign-access question goes in the PIA. Fastest path; the team already has a Supabase connector. |
| **Amazon Cognito, `ca-central-1`** | AWS Canada (Central), Montréal | Cognito user pools are available in `ca-central-1` ([AWS endpoints](https://docs.aws.amazon.com/general/latest/gr/cognito.html)); the region is in Montréal ([AWS Public Sector blog](https://aws.amazon.com/blogs/publicsector/discover-the-aws-global-cloud-infrastructure-located-in-canada/)). Needs a separate datastore (e.g. RDS in the same region). More wiring than Supabase. |
| **Self-hosted Keycloak on OVHcloud Beauharnois (`ca-east-bhs`)** | OVHcloud, Beauharnois, Quebec | OVHcloud lists Beauharnois as a Canadian 1-AZ region with 8 data centres ([OVHcloud regions](https://www.ovhcloud.com/en-ca/about-us/global-infrastructure/expansion-regions-az/), [locations](https://us.ovhcloud.com/about/global-infrastructure/locations/)). Data physically in Quebec, which may shorten the outside-Quebec PIA, but we run patching, backups and uptime ourselves. |

**Recommendation:** Supabase in `ca-central-1` for speed, with the PIA written before launch. If the PIA or legal review says data must stay with a non-US-controlled provider, move to Keycloak on OVHcloud Beauharnois. Keep the client's localStorage mode as the default (privacy by default) and make sync opt-in.

### Quebec Law 25 obligations (Act respecting the protection of personal information in the private sector, P-39.1) — needs legal review

Source: [P-39.1 on LégisQuébec](https://www.legisquebec.gouv.qc.ca/en/document/cs/P-39.1) and [CAI guidance](https://www.cai.gouv.qc.ca/protection-renseignements-personnels/information-entreprises-privees/incidents-confidentialite-mesures-securite-entreprises).

- **Privacy officer** (s. 3.1): by default the person with the highest authority (Alexander) is responsible; it can be delegated in writing. Title and contact must be published on the site.
- **Privacy impact assessment (PIA)** for any project to build an information system that handles personal information (s. 3.3), and **before communicating or entrusting personal information outside Quebec** (s. 17: sensitivity, purpose, protection measures incl. contract, and the destination's legal framework; then a written agreement) ([s. 17 text](https://www.legisquebec.gouv.qc.ca/fr/version/lc/P-39.1?code=se%3A17&langCont=en), [CAI PIA guide](https://www.cai.gouv.qc.ca/uploads/pdfs/CAI_GU_EFVP.pdf?gt=guide)). Even with a Montréal region, a US-parent vendor and any support/backup access from outside Quebec should be assessed.
- **Consent:** health information is sensitive, so consent must be **express**, separate, and in clear language, per purpose (s. 12, s. 14). Sharing a record with a clinician is its own consent.
- **Confidentiality incidents:** keep a **register of every incident** (even low-risk), retained at least 5 years; if there is a risk of serious injury, **notify the CAI and the affected person** promptly ([CAI incidents page](https://www.cai.gouv.qc.ca/protection-renseignements-personnels/information-entreprises-privees/incidents-confidentialite-mesures-securite-entreprises), [regulation](https://www.cai.gouv.qc.ca/uploads/pdfs/CAI_REGL_Incid_Confid.pdf?v=1707771135)).
- **Privacy by default** (s. 9.1): the most protective settings on by default (local-only, no sharing, no analytics).
- Also in P-39.1: a published privacy policy, retention and destruction rules, and data portability on request (a FHIR export helps here).

### Law 5 (Act respecting health and social services information, R-22.1) — needs legal review

Source: [R-22.1 on LégisQuébec](https://www.legisquebec.gouv.qc.ca/en/document/cs/R-22.1).

- **Likely applies as a reference, maybe not directly.** R-22.1 regulates information *held by a health and social services body* (s. 5: "All information held by a body is confidential…"). Confidence is a personal health record the patient keeps; we are not a public institution, clinic or other listed body. So the Act's body-level duties (governance, network information officer, access-logging duties of bodies) most likely do **not** bind Confidence directly. **Uncertain — needs legal review**, especially if a clinic or a professional later uses Confidence to receive or store records.
- **What still matters:** its definition of health information (s. 2) matches what Confidence stores; anything we receive *from* a body (e.g. a clinic sends a record) carries that body's rules with it; and if a clinic ever becomes a customer, Confidence would likely be its technology provider and their R-22.1 duties would flow to us by contract.
- The citizen side (the person's access rights and right to limit access) is a good design model for sharing ([Protecteur du citoyen summary](https://protecteurducitoyen.qc.ca/en/advice/useful-tips/access-health-information)).

### Share audit log (design)

One append-only table, `share_events`, in the same region as the record:

| Field | Meaning |
|---|---|
| `id`, `record_id` | which record |
| `actor` | who acted (the record holder, or a delegate) |
| `grantee` | with whom (clinician name/role or a one-time link id; no extra personal data) |
| `scope` | what was shared (sections: allergies, medications, …, or "full card") |
| `granted_at`, `expires_at` | when, and for how long (default 24 h; max set by the user) |
| `revoked_at`, `revoked_by` | revocation |
| `accessed_at[]` | each view of the share, with coarse client info |

- **Revocation:** the user revokes any share at any time; the link stops working at once; the event stays in the log.
- **What the user sees:** a "Shared" screen listing every share (who, what, when, until when, how many views) with a Revoke button, in FR and EN.
- **Privacy by default:** no share exists until the user creates one; short default expiry; logs hold no record content, only scopes.
- Feeds the Law 25 incident register if a share is misused.

## Phase 2: FHIR R4 export

A one-tap export to a FHIR R4 **Bundle** (`type: document` or `collection`), JSON, generated client-side. Spec: [FHIR R4 resource list](https://hl7.org/fhir/R4/resourcelist.html).

| `confidence.record.v1` field | FHIR R4 resource and element |
|---|---|
| `display_name`, `preferred_lang` | [Patient](https://hl7.org/fhir/R4/patient.html) `name.text`, `communication.language` |
| `blood_abo`, `blood_rh`, `blood_source`, `blood_confirmed_on` | [Observation](https://hl7.org/fhir/R4/observation.html) (blood group, LOINC 882-1), `effectiveDateTime`, `note` for the source |
| `allergies[].name`, `.severity`, `.detail` | [AllergyIntolerance](https://hl7.org/fhir/R4/allergyintolerance.html) `code.text`, `criticality` / `reaction.severity`, `note` |
| `medications[].name`, `.dose`, `.schedule`, `.note` | [MedicationStatement](https://hl7.org/fhir/R4/medicationstatement.html) `medicationCodeableConcept.text`, `dosage.text`, `note` |
| `conditions[].name`, `.since`, `.note` | [Condition](https://hl7.org/fhir/R4/condition.html) `code.text`, `onsetDateTime`, `note` |
| `emergency_name`, `emergency_phone` | [RelatedPerson](https://hl7.org/fhir/R4/relatedperson.html) `name`, `telecom` (or `Patient.contact`) |
| `professionals[].name`, `.role`, `.phone` | [Practitioner](https://hl7.org/fhir/R4/practitioner.html) `name`, `telecom`, with role in a PractitionerRole |
| `hospitals[].name`, `.city`, `.phone` | [Organization](https://hl7.org/fhir/R4/organization.html) `name`, `address.city`, `telecom` |
| `updated_at` | `Bundle.timestamp`, `meta.lastUpdated` |
| everything | [Bundle](https://hl7.org/fhir/R4/bundle.html) |

Free text only at first (`.text`); coded values (SNOMED CT, RxNorm / Health Canada DPD) are a later step. Validate with the official FHIR validator in CI.

## Estimates (agent-work-estimates format, 1.5 calibration applied, all-in)

- Phase 1a, sign-in + sync on Supabase `ca-central-1` (opt-in, local-first): ~225k–450k tokens, ~4.5–9 agent hours, cap 500k tokens, ~$0.19 (blended $0.56/M)
- Phase 1b, share audit log + Shared screen + revocation: ~90k–180k tokens, ~1.5–3 agent hours, cap 200k tokens, ~$0.08 (blended $0.56/M)
- Phase 1c, Law 25 paperwork drafts (PIA, privacy policy, incident register template) for legal review: ~45k–90k tokens, ~0.75–1.5 agent hours, cap 100k tokens, ~$0.04 (blended $0.56/M)
- Phase 2, FHIR R4 export + validator in CI: ~75k–150k tokens, ~1.5–3 agent hours, cap 170k tokens, ~$0.06 (blended $0.56/M)
- Total: ~435k–870k tokens, ~8–16.5 agent hours, cap 970k tokens, ~$0.37 (blended $0.56/M)

Usage $ is the midpoint of the range at $0.56/M ([public price list](https://docs.x.ai/docs/models)); weekly share is calibration pending. Legal review itself is outside these numbers.
