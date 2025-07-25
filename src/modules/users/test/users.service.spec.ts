import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users.service';
import { Users, UserType } from 'src/models/users/entities/user.entities';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<Users>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<Users>>(getRepositoryToken(Users));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new owner user', async () => {
    const mockUser = {
      name: 'tester',
      email: 'tester@gmail.com',
      type_user: UserType.OWNER,
    };

    const savedUser = { id: 1, ...mockUser };

    jest
      .spyOn(repo, 'create')
      .mockReturnValue(Object.assign(new Users(), mockUser));
    jest
      .spyOn(repo, 'save')
      .mockResolvedValue(Object.assign(new Users(), savedUser));

    const result = await service.create(mockUser as Users);

    expect(result).toEqual(savedUser);
  });
});
