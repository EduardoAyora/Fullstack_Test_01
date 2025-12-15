import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { addCollaborator, removeCollaborator } from './project.controller';
import User from '../models/User';
import Task from '../models/Task';

type MockId = {
  value: string;
  equals: (other: unknown) => boolean;
  toString: () => string;
};

const makeId = (value: string): MockId => ({
  value,
  equals: (other: unknown) =>
    other === value ||
    (typeof other === 'object' && other !== null && (other as any).value === value),
  toString: () => value
});

const makeRes = () => {
  const res: any = {};
  res.statusCode = 200;
  res.body = undefined;
  res.status = (code: number) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data: unknown) => {
    res.body = data;
    return res;
  };
  return res;
};

const originalFindOne = User.findOne;
const originalTaskExists = Task.exists;

beforeEach(() => {
  (User as any).findOne = originalFindOne;
  (Task as any).exists = originalTaskExists;
});

afterEach(() => {
  (User as any).findOne = originalFindOne;
  (Task as any).exists = originalTaskExists;
});

test('addCollaborator retorna 404 cuando el usuario no existe', async () => {
  (User as any).findOne = async () => null;

  const project = {
    collaborators: [],
    creator: makeId('creator'),
    save: async () => {}
  };

  const req: any = { body: { email: 'missing@mail.com' }, project };
  const res = makeRes();

  await addCollaborator(req, res);

  assert.strictEqual(res.statusCode, 404);
  assert.match(res.body.message, /no encontrado/i);
});

test('addCollaborator bloquea cuando el creador es el mismo usuario', async () => {
  (User as any).findOne = async () => ({ _id: makeId('creator') });

  const project = {
    collaborators: [],
    creator: makeId('creator'),
    save: async () => {}
  };

  const req: any = { body: { email: 'creator@mail.com' }, project };
  const res = makeRes();

  await addCollaborator(req, res);

  assert.strictEqual(res.statusCode, 400);
  assert.match(res.body.message, /creador/i);
});

test('addCollaborator agrega un colaborador nuevo cuando es válido', async () => {
  (User as any).findOne = async () => ({ _id: makeId('newUser') });

  let saved = false;
  const project = {
    collaborators: [makeId('existing')],
    creator: makeId('creator'),
    save: async () => {
      saved = true;
    }
  };

  const req: any = { body: { email: 'new@mail.com' }, project };
  const res = makeRes();

  await addCollaborator(req, res);

  assert.strictEqual(res.statusCode, 200);
  const hasNew = project.collaborators.some((id: MockId) => id.toString() === 'newUser');
  assert.ok(hasNew, 'debería incluir el nuevo colaborador');
  assert.ok(saved, 'debería llamar a save()');
});

test('removeCollaborator impide eliminar si el colaborador tiene tareas asignadas', async () => {
  (Task as any).exists = async () => true;

  const project = {
    collaborators: [makeId('colab1')],
    save: async () => {}
  };

  const req: any = { body: { collaboratorId: 'colab1' }, project };
  const res = makeRes();

  await removeCollaborator(req, res);

  assert.strictEqual(res.statusCode, 400);
  assert.match(res.body.message, /tareas asignadas/i);
});

test('removeCollaborator elimina al colaborador cuando no tiene tareas', async () => {
  (Task as any).exists = async () => null;

  let saved = false;
  const project = {
    collaborators: [makeId('colab1'), makeId('colab2')],
    save: async () => {
      saved = true;
    }
  };

  const req: any = { body: { collaboratorId: 'colab1' }, project };
  const res = makeRes();

  await removeCollaborator(req, res);

  assert.strictEqual(res.statusCode, 200);
  const remaining = project.collaborators.map((id: MockId) => id.toString());
  assert.deepStrictEqual(remaining, ['colab2']);
  assert.ok(saved, 'debería guardar el proyecto');
});
