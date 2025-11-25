## tp2ai
This is a honeypot (T-Pot) secuirty agent project.

## How to Start
This project has 2 directry.
`./client
./server`
Each dir, you can start with
`npm i
npm update
npm run dev`

## Concepts
AI analyze honeypot data by ElasticSearch DSL.
### Steps
- Human instructions to AI on natural language.
- AI think strategy for audience.
- AI create ElasticSearch DSL.
- ProxyServer exection DSL, and response result.
- AI receive result, and think next strategy. (EVALUATE MY REPORT)
- If AI satisfy created report, AI show the report to human.

### Problems
This Project has big problem.
- Need Long Contexts (Tech Problems)
- Need Big Input tokens (Tech and Cost Problems)
- Need to keep attacker privacy (Moral (Legal) Problems)
- Need to make graph (Tech Problems)
- some problem... if I come up, I'll write

This project has 4 phase.
- Phase1 Use LLM to analyze ElasticSearch (PoC) 
- Phase2 Use LLM and Local LLM to analyze ElasticSearch (PoC)
  - Resolve Cost Problems, and Privacy Problems (PIIMASK)
- Phase3 Use Graph Server, and make report cleary (Production1)
  - Resolve Tech Problems, and customize
- Phase4 Develop own model, or try to new way to analyze more efficiently. (PoC)
- Phase5 Exec OS command and, link with OS or software level

