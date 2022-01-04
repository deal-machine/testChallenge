import request from "supertest";

import { app } from "../../../../app";

import connection  from "../../../../database";
import { Connection } from "typeorm";
import { ICreateUserDTO } from "./ICreateUserDTO";

let conn: Connection;
let user: ICreateUserDTO;

describe("Create User Controller", () => {
  beforeAll(async () => {
    conn = await connection();
    await conn.runMigrations();

    user = {
      name: 'Douglas',
      email: '95deal@gmail.com',
      password: '123456789'
    };
  });

  afterAll(async () => {
    await conn.dropDatabase();
    await conn.close();
  });

  it("should be able to create a new user", async () => {
    const { status } =
      await request(app)
        .post('/api/v1/users')
        .send(user);

    expect(status).toBe(201);
  });

  it("should not be able to create a new user when email already exists", async () => {
    const { body, statusCode } =
      await request(app)
        .post('/api/v1/users')
        .send(user);

    expect(statusCode).toBe(400);
    expect(body).toHaveProperty("message");
    expect(body.message).toEqual("User already exists");
  });

});
