import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { IStatementsRepository } from "../../repositories/IStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let statementsRepository: IStatementsRepository;
let usersRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("GEt Statement Operation Use Case", () => {
  beforeEach(async () => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementsRepository);
  });

  it("should be able to get statement operation", async () => {
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

    const statement = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: depositStatement.id
    });

    expect(statement).toHaveProperty("id");
    expect(statement.type).toEqual(depositStatement.type);
    expect(statement.user_id).toEqual(user.id);
    expect(statement.description).toEqual(depositStatement.description);
  });
});
