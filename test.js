flowchart LR

A[Saved Quotes Hub] --> B{Quote Type}
B -->|ACQ| C[New Route in M1V2 for Resume]

C --> D[Resume Params\npolicyEffectiveDate\nlocation\ncompanyOfPlacement\nbusinessProcessDate\nresumeQuoteId]

D --> E[Hook changes:\n• Pull resume endpoint from ACQ launcher\n• Show interstitial after resume]

E --> F{Premium changed\nOR\nCOPI / Risk Code changed?}

F -->|Yes| G[Display Speed Bump\nbased on speed bump conditions]
F -->|No| H[Do Not Display\nSpeed Bump]

G --> I{Is Quoted?}
H --> I

I -->|Yes| J[Continue with Quoted Flow]
I -->|No| K[Continue without\nQuoted Handling]
