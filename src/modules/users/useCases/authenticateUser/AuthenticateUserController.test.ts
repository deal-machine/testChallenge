import request from "supertest";

import { app } from "../../../../app";

import connection  from "../../../../database";
import { Connection, getRepository, Repository } from "typeorm";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { User } from "../../entities/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { UsersRepository } from "../../repositories/UsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";

let conn: Connection;
let user: User;
let usersRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User Controller", () => {
  beforeAll(async () => {
    conn = await connection();

    await conn.runMigrations();

    usersRepository = new UsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);

    user = await createUserUseCase.execute({
      name: 'Douglas',
      email: '95deal@gmail.com',
      password: '123456789'
    });

  });

  afterAll(async () => {
    await conn.dropDatabase();
    await conn.close();
  });

  it('should be able to authenticate a user', async () => {
    const { body, statusCode } =
      await request(app)
        .post('/api/v1/sessions')
        .send({
          email: user.email,
          password: '123456789'
        });

        expect(statusCode).toEqual(200);
        expect(body).toHaveProperty("user");
        expect(body).toHaveProperty("token");

  });

  it('should not be able to authenticate a user when email not exists', async () => {
    const { body, statusCode } =
      await request(app)
        .post('/api/v1/sessions')
        .send({
          email: 'emailNotExists@gmail.com',
          password: '123456789'
        });

    expect(statusCode).toEqual(401)
    expect(body).toHaveProperty("message");
    expect(body.message).toEqual("Incorrect email or password");

  });

  it('should not be able to authenticate a user when password do not match', async () => {
    const { body, statusCode } =
      await request(app)
        .post('/api/v1/sessions')
        .send({
          email: user.email,
          password: '123456789X'
        });

    expect(statusCode).toEqual(401)
    expect(body).toHaveProperty("message");
    expect(body.message).toEqual("Incorrect email or password");

  });
});
