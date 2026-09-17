# Observation checklist

Score **behavior**, not satisfaction. Tick when you see it. A flag that fires in 3 of 8 sessions is enough to change the prototype.

Session: ________  Role: platform / managed / CI  Variants: exhaust ________  revoke ________

| Watch | Seen? | Notes / timestamp |
| --- | --- | --- |
| Hesitation or extra clicks before derive |  |  |
| Hesitation before revoke |  |  |
| Hesitation before leftover resources |  |  |
| Parent secret appears in harness / agent env |  |  |
| Child minted once and reused across tasks |  |  |
| Picked 1h or 24h expiry |  |  |
| Tried to extend the child |  |  |
| Reached for the parent on long task / sub-agent |  |  |
| Revoke treated as destroy-resources |  |  |
| After revoke, did **not** look for leftover droplets |  |  |
| Ceiling treated as a dollar spend cap |  |  |
| Tried to raise the ceiling from the agent |  |  |
| Decision record unused; went to billing |  |  |
| Revoked parent / all tokens (tenant B would die) |  |  |
| Noticed scopes were narrowed |  |  |
| Understood agent cannot raise its own ceiling |  |  |

Auto-flags in the moderator rail: `parentShownInHarness`, `pickedLongExpiry`, `derivedPerTask`, `triedToExtendChild`, `triedToRaiseCeilingFromAgent`, `usedDecisionRecord`, `wentToBillingFirst`, `childMintedOnceReused`.

**Did leftover resources still send them looking?** Yes / No  
**Variant note (exhaust):** pause understood? / terminate felt safer?  
**Variant note (revoke):** which string made them hunt droplets?
