---
config:
  layout: fixed
---
flowchart TB
 subgraph HORIZ[" "]
    direction LR
        NR1["New Route in M1V2 for Resume"]
        NR2["New Route to SVC"]
  end
    SQ(["Saved Quotes Hub"]) --> QT{"Quote Type"}
    QT -.-> spacer1(["ACQ"]) & spacer2(["SVC"])
    spacer1 --> NR1
    spacer2 --> NR2
    NR1 --> HC1["Trigger resume<br>API from ACQ launcher exp<br>and show interstitial loading indicator"]
    HC1 --> DEC1{"If premium<br>Changed OR<br>COPI / Risk Code<br>changed"}
    DEC1 -- Yes --> SB1["Display Speed Bump<br>if conditions are met"]
    DEC1 -- No --> NSB1["Do Not Display<br>Speed Bump"]
    SB1 --> QD1{"If Quoted"}
    NSB1 --> QD1
    QD1 -- Yes --> CWQ1(["Continue with Quoted Flow"])
    QD1 -- No --> CWQH1(["Continue without Quoted Handling"])
    NR2 --> HC2["Other quote handling"]
    HC2 --> CWQH2(["Continue without Quoted Handling"])

     QT:::decision
     DEC1:::decision
     QD1:::decision
    classDef decision fill:#F6D776,stroke:#BB8F0B,stroke-width:2px
    style spacer1 color:#000000
