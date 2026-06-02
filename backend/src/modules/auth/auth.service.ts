import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { mockUser } from '../../data/mockData';

const DEMO_PASSWORD = 'fleetai123';

export async function login(email: string, password: string) {
  if (email === 'admin@fleetai.com' && password === DEMO_PASSWORD) {
    const token = jwt.sign(
      { userId: mockUser.id, companyId: mockUser.companyId, email: mockUser.email, role: mockUser.role },
      env.jwt.secret,
      { expiresIn: '7d' }
    );
    return {
      token,
      user: { id: mockUser.id, email: mockUser.email, name: mockUser.name, role: mockUser.role, companyId: mockUser.companyId },
    };
  }
  throw new Error('Credenciais inválidas');
}

export async function getProfile(userId: number) {
  if (userId === mockUser.id) {
    return { ...mockUser, company: { id: 1, name: 'Logística Brasil S.A.' } };
  }
  throw new Error('Usuário não encontrado');
}
