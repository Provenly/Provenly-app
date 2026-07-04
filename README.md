# Provenly

**Turn completed work into on-chain proof.**

Provenly is a quest platform built on Stellar. Teams post tasks, contributors complete them, and payment happens automatically through Soroban smart contracts the moment proof checks out. No invoices, no manual approvals sitting in a queue — just work, verification, and payout, all recorded on-chain.

---

## Why this exists

Distributed teams — open-source maintainers, DAOs, startups running bounty programs — all face the same problem: coordinating and paying contributors is slow, manual, and hard to trust at scale. Provenly fixes that by putting the whole lifecycle of a task (assignment → proof → verification → payment) on rails that don't need a human in the loop for every step.

Stellar is the settlement layer because it's built for exactly this kind of workload: cheap, fast, frequent, small-value transfers, with asset issuance and on/off-ramp support already built in. Soroban adds the programmability layer — contracts that hold funds in escrow and release them only when conditions are actually met.

---

## How it works

```
   quest created  →  contributor submits proof  →  verification runs  →  payout executes  →  reputation updates
        │                    │                          │                    │                     │
     (API + contract)    (webhook/API/attestation)  (on-chain check)    (Stellar asset)      (XP + badges)
```

1. **A quest gets posted.** Reward, deadline, and proof requirements are defined up front. Metadata lives off-chain; reward logic is registered on-chain.
2. **A contributor does the work and submits proof.** This could be a GitHub PR, an API-verifiable action, or a signed attestation.
3. **Verification happens.** Depending on the quest, this is an automated check, an API call, or multi-sig sign-off.
4. **The contract pays out.** Funds move in Stellar assets — stablecoins or a project's own token — straight to the contributor's wallet.
5. **Reputation compounds.** Every completed quest adds XP and badges to an on-chain record tied to the contributor's address.

---

## What's inside

| Capability | Description |
|---|---|
| Quest builder | Define criteria, rewards, deadlines, and required proof format |
| Verification layer | Mix and match webhooks, API checks, and multi-sig approval |
| Automated payouts | Rewards settle in Stellar assets with no manual transfer step |
| Escrow logic | Funds are locked until conditions are provably met |
| Reputation ledger | XP and badges accumulate on-chain, tied to a wallet address |
| Environment flexibility | Run against a local sandbox, testnet, or mainnet |

---

## Who's building on this

- **Open-source projects** paying contributors transparently, without a manual payroll process
- **DAOs** running bounty boards or recurring seasonal quest campaigns
- **Startups** incentivizing internal milestones, growth experiments, or community tasks
- **Education and talent platforms** issuing micro-grants or credentials for verified skill completion

---

## System design

Three layers, talking to each other over REST/GraphQL and Soroban RPC:

- **`apps/web`** — Next.js frontend. Quest browser, submission flow, wallet connection, dashboard.
- **`apps/api`** — NestJS backend. Owns auth, quest state, payout orchestration, and inbound webhooks. Backed by Postgres.
- **`contracts/`** — Soroban/Rust contracts. Own quest registration, proof submission events, verification logic, payout execution, and reputation state.

The backend is the coordinator: it persists metadata the chain doesn't need to store, and calls into the contract for anything that needs to be trust-minimized or provable.

---

## Repo layout

```
Provenly/
├── apps/
│   ├── web/                  Next.js app (App Router)
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── tests/
│   └── api/                  NestJS service
│       ├── src/modules/
│       │   ├── quests/
│       │   ├── users/
│       │   ├── payouts/
│       │   └── webhooks/
│       └── prisma/
├── contracts/
│   └── provenly-quest/       Soroban contract (Rust)
│       ├── src/lib.rs
│       └── tests/
├── infra/                    docker-compose, migrations
├── scripts/
└── .env.example
```

---

## Setting it up

**You'll need:** Node.js 18+, pnpm, Rust + Cargo, the Soroban CLI, and optionally Docker for local Postgres.

```bash
# Rust, if you don't already have it
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

**1. Clone and install**
```bash
git clone https://github.com/<your-org>/Provenly.git
cd Provenly
cd apps/web && pnpm install && cd ../api && pnpm install && cd ../..
```

**2. Build the contract**
```bash
cd contracts/provenly-quest && cargo build && cd ../..
```

**3. Configure environment variables**

Root `.env`:
```env
STELLAR_NETWORK=testnet
SOROBAN_RPC_URL=https://<testnet-rpc>
CONTRACT_ID=<set-after-deployment>
SOROBAN_SECRET_KEY=<server-key>
ISSUER_PUBLIC_KEY=<reward-asset-issuer>
DATABASE_URL=postgres://user:pass@localhost:5432/provenly
```

`apps/web/.env.local`:
```env
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_SOROBAN_RPC_URL=
NEXT_PUBLIC_CONTRACT_ID=
API_BASE_URL=http://localhost:3001
```

`apps/api/.env`:
```env
PORT=3001
DATABASE_URL=postgres://user:pass@localhost:5432/provenly
STELLAR_NETWORK=testnet
SOROBAN_RPC_URL=
CONTRACT_ID=
SOROBAN_SECRET_KEY=
JWT_SECRET=your_jwt_secret
```

**4. Bring up the stack**
```bash
docker compose -f infra/docker-compose.yml up -d   # Postgres
cd apps/api && pnpm prisma migrate dev             # migrations
pnpm start:dev                                     # backend, in one terminal
cd apps/web && pnpm dev                            # frontend, in another → localhost:3000
```

---

## The contract

`contracts/provenly-quest` is organized around five responsibilities:

- **QuestRegistry** — create and update quests: reward asset, amount, verifier
- **Submission** — accept proof, track status, emit events
- **Verifier** — evaluate completion conditions (role-based, multi-sig, or data-driven)
- **Payout** — move funds to the contributor once approved
- **Reputation** — maintain XP and badges per address

**Core entry points:**
```
register_task(id, reward_asset, amount, verifier)
submit_proof(id, proof_ref)
approve(id, address, amount)
claim_reward(id, amount)
get_user_stats(address)
get_task(id)
```

**Build and test:**
```bash
cd contracts/provenly-quest
cargo build --release
cargo test
```

**Deploy to testnet:**
```bash
export STELLAR_NETWORK=testnet
export SOROBAN_RPC_URL=<your-testnet-rpc>

soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/provenly_quest.wasm \
  --network $STELLAR_NETWORK \
  --secret-key $SOROBAN_SECRET_KEY \
  --rpc-url $SOROBAN_RPC_URL
# → copy the returned CONTRACT_ID into your .env files
```

**Invoke it directly:**
```bash
soroban contract invoke --id $CONTRACT_ID --fn register_task \
  --arg id=Q-001 --arg reward_asset=... --arg amount=100

soroban contract invoke --id $CONTRACT_ID --fn get_user_stats \
  --arg address=<stellar-address>
```

**Task runner shortcuts** (optional — `just` or `make`, both in `contracts/provenly-quest`):
```bash
just build   |   make build
just test    |   make test
SOROBAN_SECRET_KEY=... just deploy   |   SOROBAN_SECRET_KEY=... make deploy
```
Deploy targets expect `SOROBAN_SECRET_KEY`, `SOROBAN_RPC_URL` (or `STELLAR_NETWORK`), and `CONTRACT_ID` to already be set. Edit the invoke targets to match your actual deployment arguments.

---

## Running the test suites

```bash
# frontend
cd apps/web && pnpm test && pnpm lint && pnpm typecheck

# backend
cd apps/api && pnpm test && pnpm test:e2e && pnpm lint

# contracts
cd contracts/provenly-quest && cargo test
```

---

## Environments

| Environment | Purpose |
|---|---|
| Local | Fast iteration against a sandbox RPC with throwaway keys |
| Testnet | Public test environment, faucet-funded |
| Mainnet | Real assets, real fees — audit and monitor before shipping here |

To switch networks, update `STELLAR_NETWORK` and `SOROBAN_RPC_URL` in the deployment scripts, `apps/api/.env`, and `apps/web/.env.local`. Before running live payouts, confirm the reward asset exists and recipients have trustlines established — Stellar payments will fail silently otherwise.

---

## API reference

**Quests**
```
POST   /quests                 create a quest
GET    /quests                 list quests
POST   /quests/:id/submit      submit proof
POST   /quests/:id/approve     approve a submission
```

**Payouts**
```
POST   /payouts/claim          claim earned rewards
```

**Users**
```
GET    /users/:address/stats   reputation and earnings for an address
```

---

## Contributing

1. Fork the repo and branch off: `git checkout -b feat/your-feature`
2. Set up your environment per the steps above
3. Write tests for anything you add
4. Run lint and typecheck before opening a PR
5. Open the PR with a clear description of what changed and why

Commits follow **Conventional Commits**: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`.

---

## Security

Don't put secrets in pull requests. To report a vulnerability, contact the maintainers privately (contact details TBD).

---

## Reference links

- [Stellar Developers](https://developers.stellar.org)
- [Soroban Smart Contracts](https://soroban.stellar.org)
- [Next.js Docs](https://nextjs.org/docs)
- [NestJS Docs](https://docs.nestjs.com)
- [Rust & Cargo](https://doc.rust-lang.org/cargo/)

---

## License

MIT (or specify your chosen license)

Questions or ideas? Open an issue.