import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let usersRepository: IUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe('Authenticate User Use Case', () => {
  beforeAll(() => {
    usersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it('should be able to authenticate a user', async () => {
    const user: ICreateUserDTO = {
      email: '95deal@gmail.com',
      name: 'Douglas',
      password: '123456789'
    };

    const newUser = await createUserUseCase.execute(user);

    expect(newUser).toHaveProperty("id");
    expect(newUser.email).toEqual(user.email);

    const userToken = await authenticateUserUseCase.execute({ email: user.email, password: user.password});

    expect(userToken).toHaveProperty("user");
    expect(userToken).toHaveProperty("token");
    expect(userToken.user).toHaveProperty("email");
    expect(userToken.user).toHaveProperty("id");
    expect(userToken.user.email).toEqual(user.email);
  });
})
