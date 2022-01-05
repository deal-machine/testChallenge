import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { IStatementsRepository } from "../../repositories/IStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { GetBalanceError } from "./GetBalanceError";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let statementsRepository: IStatementsRepository;
let usersRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance Use Case", () => {
  beforeEach(async () => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
    getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository);
  });

  it("should be able to get balance", async () => {
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

    const {balance, statement} = await getBalanceUseCase.execute({user_id: user.id});

    expect(balance).toEqual(30);
    expect(statement.length).toEqual(2);
    expect(statement).toHaveLength(2);
  });

  it("should not be able to get balance when user not exists", async () => {
    expect( async() => {
      await getBalanceUseCase.execute({user_id: "id_not_exists"});
    }).rejects.toBeInstanceOf(GetBalanceError);
  })
});
