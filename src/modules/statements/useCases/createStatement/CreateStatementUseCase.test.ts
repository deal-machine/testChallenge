import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { IStatementsRepository } from "../../repositories/IStatementsRepository"
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { CreateStatementError } from "./CreateStatementError";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let statementsRepository: IStatementsRepository;
let usersRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement Use Case", () => {
  beforeEach(async () => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
  });

  it("should be able to create statements", async() => {
    const user = await createUserUseCase.execute({
       name: 'Douglas',
       email: '95deal@gmail.com',
       password: '123456789'
    });

    expect(user).toHaveProperty("id");

    const depositStatement = await createStatementUseCase.execute({
      user_id: user.id,
      type: 'deposit' as OperationType,
      amount: 50,
      description: 'Criado deposito'
    });

    expect(depositStatement).toHaveProperty("id");
    expect(depositStatement.amount).toEqual(50);

    const withdrawStatement = await createStatementUseCase.execute({
      user_id: user.id,
      type: 'withdraw' as OperationType,
      amount: 20,
      description: 'Criado Saque'
    });

    expect(withdrawStatement).toHaveProperty("id");
    expect(withdrawStatement.amount).toEqual(20);

    const { balance } = await statementsRepository.getUserBalance({user_id: user.id});

    expect(balance).toBeTruthy();
    expect(balance).toEqual(30);
  });

  it("should not be able to create statements when user not exists", async () => {
    expect( async () => {
      await createStatementUseCase.execute({
        user_id: 'id_not_exists',
        type: 'deposit' as OperationType,
        amount: 50,
        description: 'Criado deposito'
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to create statements with insufficient funds", async () => {
    const user = await createUserUseCase.execute({
      name: 'Douglas',
      email: '95deal@gmail.com',
      password: '123456789'
   });

   expect(user).toHaveProperty("id");

   expect(async () => {
    await createStatementUseCase.execute({
        user_id: user.id,
        type: 'withdraw' as OperationType,
        amount: 1,
        description: 'Criado Saque'
    });
   }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);

  });
})
