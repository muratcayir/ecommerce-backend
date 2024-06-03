import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

const mockUsersService = () => ({
  findUserByEmail: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(),
});

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useFactory: mockUsersService },
        { provide: JwtService, useFactory: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return the user if validation is successful', async () => {
      const user = {
        id: 1,
        email: 'test@test.com',
        password: 'hashedPassword',
      };

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));

      const result = await service.validateUser('test@test.com', 'password');

      expect(usersService.findUserByEmail).toHaveBeenCalledWith(
        'test@test.com',
      );
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword');
      expect(result).toEqual({ id: 1, email: 'test@test.com' });
    });

    it('should return null if validation fails', async () => {
      const user = {
        id: 1,
        email: 'test@test.com',
        password: 'hashedPassword',
      };

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      (usersService.findUserByEmail as jest.Mock).mockResolvedValue(user);

      const result = await service.validateUser(
        'test@test.com',
        'wrongPassword',
      );

      expect(usersService.findUserByEmail).toHaveBeenCalledWith(
        'test@test.com',
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'wrongPassword',
        'hashedPassword',
      );
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return a JWT token', async () => {
      const user = { id: 1, email: 'test@test.com' };
      const token = 'jwtToken';

      jest.spyOn(jwtService, 'sign').mockReturnValue(token);
      
      const result = await service.login(user);

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: 'test@test.com',
        sub: 1,
      });
      expect(result).toEqual({ access_token: token });
    });
  });
});
