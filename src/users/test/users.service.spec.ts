import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

const mockUserRepository = () => ({
  save: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UsersService', () => {
  let service: UsersService;
  let repository: MockRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<MockRepository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should hash the password and save the user', async () => {
      const user: Partial<User> = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
        orders: [],
      };

      const hashedPassword: string = 'hashedPassword'; 
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);

      repository.save.mockResolvedValue({ ...user, password: hashedPassword } as User); 

      const result = await service.createUser(user as User); 

      expect(bcrypt.hash).toHaveBeenCalledWith('password', expect.any(Number));
      expect(repository.save).toHaveBeenCalledWith({ ...user, password: hashedPassword });
      expect(result).toEqual({ ...user, password: hashedPassword });
    });
  });

  describe('findUserByEmail', () => {
    it('should return the user if found', async () => {
      const user: User = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
        orders: [],
      };

      repository.findOne.mockResolvedValue(user);

      const result = await service.findUserByEmail('john.doe@example.com');

      expect(repository.findOne).toHaveBeenCalledWith({ where: { email: 'john.doe@example.com' } });
      expect(result).toEqual(user);
    });

    it('should return undefined if user not found', async () => {
      repository.findOne.mockResolvedValue(undefined);

      const result = await service.findUserByEmail('not.found@example.com');

      expect(repository.findOne).toHaveBeenCalledWith({ where: { email: 'not.found@example.com' } });
      expect(result).toBeUndefined();
    });
  });
});
