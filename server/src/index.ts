import express from 'express';
import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Server, type Socket } from 'socket.io';
import { RoomStore, isCardValue, isTheme, type Room } from './rooms.js';

const PORT = Number(process.env.PORT ?? 3000);
/** Grace period before removing a disconnected participant (page reloads, flaky wifi). */
const DISCONNECT_GRACE_MS = Number(process.env.DISCONNECT_GRACE_MS ?? 15_000);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: process.env.CORS_ORIGIN ? { origin: process.env.CORS_ORIGIN.split(',') } : undefined,
});
const store = new RoomStore();

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Serve the Angular build (single deployable unit).
const here = path.dirname(fileURLToPath(import.meta.url));
const staticDir = path.resolve(process.env.STATIC_DIR ?? path.join(here, '../public'));
if (existsSync(staticDir)) {
  app.use(express.static(staticDir));
  app.get('/{*splat}', (_req, res) => res.sendFile(path.join(staticDir, 'index.html')));
}

const channel = (roomId: string) => `room:${roomId}`;

async function broadcast(room: Room): Promise<void> {
  const sockets = await io.in(channel(room.id)).fetchSockets();
  for (const s of sockets) {
    s.emit('state', store.view(room, s.data.clientId));
  }
}

const cleanString = (v: unknown, max: number) =>
  typeof v === 'string' ? v.trim().slice(0, max) : '';

io.on('connection', (socket: Socket) => {
  let room: Room | undefined;
  let clientId = '';

  socket.on('join', (payload: unknown, ack?: (res: { ok: boolean; error?: string }) => void) => {
    const p = (payload ?? {}) as Record<string, unknown>;
    const roomId = cleanString(p.roomId, 64).toLowerCase().replace(/[^a-z0-9-]/g, '');
    const name = cleanString(p.name, 30);
    const id = cleanString(p.clientId, 64);
    if (!roomId || !name || !id) {
      ack?.({ ok: false, error: 'Paramètres invalides.' });
      return;
    }
    try {
      room = store.join(roomId, id, name, socket.id, isTheme(p.theme) ? p.theme : undefined);
    } catch (e) {
      ack?.({ ok: false, error: (e as Error).message });
      return;
    }
    clientId = id;
    socket.data.clientId = id;
    socket.join(channel(roomId));
    ack?.({ ok: true });
    void broadcast(room);
  });

  socket.on('vote', (value: unknown) => {
    if (!room || (value !== null && !isCardValue(value))) return;
    store.vote(room, clientId, value);
    void broadcast(room);
  });

  socket.on('reveal', () => {
    if (!room) return;
    store.reveal(room);
    void broadcast(room);
  });

  socket.on('clear', () => {
    if (!room) return;
    store.clear(room);
    void broadcast(room);
  });

  socket.on('setTheme', (theme: unknown) => {
    if (!room || !isTheme(theme)) return;
    store.setTheme(room, theme);
    void broadcast(room);
  });

  socket.on('disconnect', () => {
    const r = room;
    if (!r) return;
    if (store.detach(r, clientId, socket.id)) {
      setTimeout(() => {
        store.removeIfGone(r, clientId);
        if (store.get(r.id)) void broadcast(r);
      }, DISCONNECT_GRACE_MS);
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`Poker planning server listening on http://localhost:${PORT}`);
});
