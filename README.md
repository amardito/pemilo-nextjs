# Pemilo - Next.js Voting System

A modern online voting system frontend built with Next.js 15. Connects to your existing **Go REST API** backend.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Your Go REST API running

### Setup

```bash
# Install dependencies
npm install

# Configure API endpoint (edit .env.local)
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Run development server
npm run dev
```

**Or use setup script:** `.\setup.ps1`

Open http://localhost:3000

---

## 🔌 API Integration

### Required Endpoints

Your Go API should expose:

**Rooms:**
- `GET /api/rooms` - List all rooms
- `GET /api/rooms/:id` - Get room details
- `POST /api/rooms` - Create room
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room

**Votes:**
- `POST /api/votes` - Submit vote
  ```json
  { "roomId": "string", "candidateId": "string" }
  ```

**Stats:**
- `GET /api/stats` - Get statistics
  ```json
  {
    "totalRoomQuota": 50,
    "roomsCreated": 10,
    "totalVoterQuota": 1000,
    "votersUsed": 150,
    "activeRooms": 3
  }
  ```

### Configuration

Edit `lib/api-client.ts` to match your API structure.

---

## 📁 Project Structure

```
app/
  (admin)/         # Admin interface routes
  (voter)/         # Voter interface routes
components/
  admin/           # Admin components
  voter/           # Voter components
  ui/              # UI components (shadcn/ui)
lib/
  api-client.ts    # Go API client
  actions.ts       # Server Actions
```

---

## 🛠️ Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Radix UI + shadcn/ui
- Your Go REST API (backend)

---

## 🎯 Features

**Admin:**
- Dashboard with stats & live graphs
- Create/manage voting rooms
- 3 room types: Custom Tickets, Wild Limited, Wild Unlimited
- Quota tracking

**Voter:**
- Browse public rooms
- Join by room ID
- Vote with confirmation

---

## ⚙️ Environment Variables

`.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

---

## 🚀 Deployment

### Vercel
1. Push to GitHub
2. Import in Vercel
3. Set `NEXT_PUBLIC_API_URL` environment variable
4. Deploy

**Important:** Configure CORS on your Go API to allow requests from your frontend domain.

---

## 📝 Commands

```bash
npm run dev      # Development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Lint code
```

---

## 🔧 Expected Data Types

See `types.ts` for full TypeScript definitions. Your API should return:

```typescript
interface Room {
  id: string;
  name: string;
  description: string;
  type: 'custom_tickets' | 'wild_limited' | 'wild_unlimited';
  status: 'draft' | 'published' | 'closed';
  candidates: Candidate[];
  createdAt: string;
  // Optional: totalTickets, ticketsUsed, startDate, endDate
}

interface Candidate {
  id: string;
  name: string;
  description: string;
  photoUrl: string;
  voteCount: number;
  subCandidates?: SubCandidate[];
}
```

---

## 🐛 Troubleshooting

**API errors:**
- Check Go API is running
- Verify `NEXT_PUBLIC_API_URL`
- Check CORS configuration

**Build errors:**
- Run `npm install`
- Delete `.next` folder and rebuild

---

## 📄 License

MIT
