# Activation

This is the activation definition and on-device counter contract for Confidence. It comes from [PEA-48](https://linear.app/peacock-grok/issue/PEA-48/write-the-activation-definition-and-a-privacy-safe-counter-fixture). Web and Expo will implement the counters later, against this definition and the fixture, at the same time.

This slice adds documentation and a fixture only. It does not add server analytics, a user interface, export, health content, or workflow changes.

## Definition

Activation is the share of new holders who save at least one durable fact within seven days of first opening an empty record.

That wording is the recommended definition in PEA-48. This document records it as the written spec. Points the ticket does not settle are listed under Open questions and are not decided here.

## What is counted

Counters live on the device. They record only:

- **Opens:** the first time a new holder opens an empty record, and a count of later opens of that empty record.
- **First durable fact saved:** the date a first durable fact is saved, when that happens.
- **Seven-day flag:** whether that first durable fact was saved within seven days of first opening the empty record.

The fixture at `tests/fixtures/activation-counters.json` shows the shape: aggregate counts and dates only.

## Privacy

- Counter data stays on the device. This slice does not send it anywhere and does not add a server.
- Do not store names, email addresses, or identifiers that map to people.
- Do not store allergen names, severity, fact text, or any other medical or health content.
- Do not invent product facts in the fixture or in later counter implementations.

## Open questions

These are left open on purpose. A later slice should settle them before implementation, not treat this document as the decision.

- What counts as a durable fact for this measure. [PRODUCT.md](../PRODUCT.md) describes durable facts first as blood type, allergies, meds, and conditions, and the first slice also lets a holder edit hospitals and clinicians. PEA-48 does not say which saved facts count toward activation.
- Whether “seven days” is seven calendar dates or 168 hours, and which time zone applies.
- What “opens” means in the product: first launch, first time the empty record is shown, or each return to it.
- Whether a fact that is saved and then deleted still counts as the first durable fact saved.
- How a holder with more than one record, including a later family record, is counted: once, or once per record.
- Who is a “new holder”: first-time use only, or also a returning person who opens an empty record.
- How the share is later added up if the counters stay on the device. This slice does not add export or a server path.

## Source

PEA-48, 20 Nov 2026. Asked because nothing was defined or counted, so we could not tell whether a new holder actually starts a record.
