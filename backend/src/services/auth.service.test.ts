import test from 'node:test';
import assert from 'node:assert/strict';
import { loginUser, registerUser } from './auth.service';

test('registerUser rechaza correos inválidos antes de consultar la base', async () => {
  await assert.rejects(
    () => registerUser('Tester', 'correo-invalido', 'password123'),
    {
      message: 'Email inválido'
    }
  );
});

test('loginUser rechaza correos inválidos antes de consultar la base', async () => {
  await assert.rejects(
    () => loginUser('correo-invalido', 'password123'),
    {
      message: 'Email inválido'
    }
  );
});
