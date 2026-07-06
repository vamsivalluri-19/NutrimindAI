import request from 'supertest';
import app from '../src/app';
import { User } from '../src/models/User';

jest.mock('../src/services/mail.service');

describe('Authentication API Endpoint Tests', () => {
  const mockUserPayload = {
    email: 'test@nutrimind.ai',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    role: 'USER'
  };

  let findOneSpy: jest.SpyInstance;
  let saveSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    // Spy on Mongoose methods directly to bypass real database actions
    findOneSpy = jest.spyOn(User, 'findOne');
    saveSpy = jest.spyOn(User.prototype, 'save');
  });

  afterEach(() => {
    findOneSpy.mockRestore();
    saveSpy.mockRestore();
  });

  it('should register a new user successfully', async () => {
    findOneSpy.mockResolvedValue(null);
    saveSpy.mockResolvedValue({
      _id: 'mockuser123',
      ...mockUserPayload,
      isEmailVerified: false
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send(mockUserPayload);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body.user.email).toEqual(mockUserPayload.email);
  });

  it('should return 400 validation error if email is invalid', async () => {
    const invalidPayload = { ...mockUserPayload, email: 'invalid-email' };
    const res = await request(app)
      .post('/api/auth/register')
      .send(invalidPayload);

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toContain('Validation failed');
  });

  it('should log in an existing user and return tokens', async () => {
    const mockUser = {
      _id: 'mockuser123',
      ...mockUserPayload,
      comparePassword: jest.fn().mockResolvedValue(true)
    };
    findOneSpy.mockResolvedValue(mockUser);

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@nutrimind.ai',
        password: 'password123'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body.message).toEqual('Login successful');
  });
});
