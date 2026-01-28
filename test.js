flowchart LR

A[Saved Quotes Hub]
A --> B{Quote Type}

B -->|ACQ| C[New Route in M1V2 for Resume]

C --> D[Hook changes to\npull resume End Point\nfrom ACQ launcher\nand show interstitial]

D --> E{If premium changed\nOR\nCOPI / Risk Code changed}

E -->|Yes| F[Display Speed Bump\nbased on speed bump conditions]

E -->|No| G[Do Not Display\nSpeed Bump]

F --> H{If Quoted}
G --> H

H -->|Yes| I[Continue with\nQuoted Flow]
H -->|No| J[Continue without\nQuoted Handling]
