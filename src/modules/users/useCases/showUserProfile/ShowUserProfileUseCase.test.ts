import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile Use Case", () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });

  it("should be able to show a user profile", async () => {
    const userDTO: ICreateUserDTO = {
      email: '95deal@gmail.com',
      name: 'Douglas',
      password: '123456789'
    };

    const user = await createUserUseCase.execute(userDTO);

    expect(user).toHaveProperty("id");

    const userProfile = await showUserProfileUseCase.execute(user.id);

    expect(userProfile).toHaveProperty("id");
    expect(userProfile.email).toEqual(user.email);
  });

  it("should not be able to show a non existing user profile", async () => {
    expect( async () => {
      await showUserProfileUseCase.execute('user_id_not_exists');
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  })

});
