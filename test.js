1. Saved Quote Entry

GW will not send pre-empted servicing quotes to Quote Hub

The flow starts from Saved Quotes Hub

2. Quote Type Check

If the Quote Type = ACQ

Proceed with Resume flow

3. Resume Route

A new route in M1V2 is used for resume with the following parameters:

policyEffectiveDate = 2025-11-26

location = WV

companyOfPlacement = GARB

businessProcessDate = 2025-11-25

resumeQuoteId = pcXXXX

4. Hook Change (Resume Handling)

Hook changes are applied to:

Pull resume end-point from ACQ launcher

After resume, show interstitial screen

5. Premium / Risk Change Decision

System checks:

Has premium changed?

Has COPI / Risk Code changed?

If YES

Display Speed Bump

Display is based on speed bump conditions

If NO

Do NOT display Speed Bump

6. Quoted Check

After speed bump decision:

Check if quoted
