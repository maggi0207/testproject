flowchart LR

%% ================= LEFT SECTION =================
A[Saved Quotes<br/>Hub]

B{Quote Type}

A --> B

B -->|ACQ| C[New Route in<br/>M1V2 for Resume]

C --> D[Hook changes to<br/>
pull resume End<br/>
Point from ACQ<br/>
launcher exp and<br/>
show interstitial]

%% ================= DECISION =================
D --> E{If premium<br/>
Changed OR<br/>
COPI / Risk Code<br/>
changed}

%% ================= YES PATH (UP) =================
E -->|Yes| F[Display Speed<br/>
Bump based on<br/>
Speed bump<br/>
conditions]

%% ================= NO PATH (RIGHT) =================
E -->|No| G[Do Not Display<br/>
Speed Bump]

%% ================= ALIGNMENT HELPERS =================
F --> H{If Quoted}
G --> H

%% ================= OUTCOMES =================
H -->|Yes| I[Continue with<br/>
Quoted Flow]

H -->|No| J[Continue without<br/>
Quoted Handling]
