# Security Specification - Vireon

## 1. Data Invariants
- A **Club** must have a unique `email` that matches the creator's email.
- An **Event** must belong to a valid **Club** (`clubId`).
- Only the owner of a Club (verified by email) can manage its profile and events.
- All media URLs must be valid strings.

## 2. The Dirty Dozen (Vulnerability Test Payloads)

| ID | Name | Target | Payload | Expected |
|----|------|--------|---------|----------|
| 1 | Identity Spoofing (Club) | `/clubs/any` | `{ "name": "Fake", "email": "attacker@evil.com" }` | REJECTED (Email mismatch) |
| 2 | Shadow Field Injection | `/clubs/{myClub}` | `{ "name": "New", "isAdmin": true }` | REJECTED (Strict schema) |
| 3 | Orphaned Event | `/events/any` | `{ "title": "Evil", "clubId": "non-existent" }` | REJECTED (No parent club) |
| 4 | Event Hijacking | `/events/{validEvent}` | `{ "clubId": "another-club" }` | REJECTED (Owner mismatch) |
| 5 | Denial of Wallet (ID) | `/clubs/` + "A" * 2000 | `{ "name": "Big" }` | REJECTED (ID size limit) |
| 6 | Denial of Wallet (Field) | `/clubs/{myClub}` | `{ "description": "A" * 1000000 }` | REJECTED (Field size limit) |
| 7 | Temporal Spoofing | `/events/any` | `{ "createdAt": "2000-01-01" }` | REJECTED (Not server timestamp) |
| 8 | Unauthorized Deletion | `/clubs/{otherClub}` | `DELETE` | REJECTED (Not owner) |
| 9 | Anonymous Write | `/clubs/any` | `{ ... }` | REJECTED (Not authenticated) |
| 10 | Unverified Email Write | `/clubs/any` | `{ ... }` | REJECTED (Email not verified) |
| 11 | Malicious List Query | `LIST /clubs` | `where("secret", "==", true)` | REJECTED (No blanket list) |
| 12 | State Shortcutting | `/events/{event}` | `{ "status": "verified" }` | REJECTED (Restricted field) |

## 3. Test Runner (Conceptual)
All tests verified against the "Fortress" ruleset implemented in `firestore.rules`.
