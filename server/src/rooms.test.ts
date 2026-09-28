import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RoomStore } from './rooms.js';

test('votes stay hidden until revealed', () => {
  const store = new RoomStore();
  const room = store.join('r1', 'alice', 'Alice', 's1');
  store.join('r1', 'bob', 'Bob', 's2');
  store.vote(room, 'alice', '5');

  const bobView = store.view(room, 'bob');
  const alice = bobView.participants.find((p) => p.id === 'alice')!;
  assert.equal(alice.hasVoted, true);
  assert.equal(alice.vote, null);
  assert.equal(bobView.myVote, null);
  assert.equal(store.view(room, 'alice').myVote, '5');

  store.reveal(room);
  assert.equal(store.view(room, 'bob').participants.find((p) => p.id === 'alice')!.vote, '5');
});

test('clear resets votes and hides again', () => {
  const store = new RoomStore();
  const room = store.join('r1', 'alice', 'Alice', 's1');
  store.vote(room, 'alice', '8');
  store.reveal(room);
  store.clear(room);
  const view = store.view(room, 'alice');
  assert.equal(view.revealed, false);
  assert.equal(view.myVote, null);
  assert.equal(view.participants[0].hasVoted, false);
});

test('reconnecting with the same clientId does not duplicate the participant', () => {
  const store = new RoomStore();
  const room = store.join('r1', 'alice', 'Alice', 's1');
  store.join('r1', 'alice', 'Alice', 's2');
  assert.equal(room.participants.size, 1);
  assert.equal(store.detach(room, 'alice', 's1'), false);
  assert.equal(store.detach(room, 'alice', 's2'), true);
  store.removeIfGone(room, 'alice');
  assert.equal(store.get('r1'), undefined);
});
