import request from "supertest";

import { app } from "../../../../app";

import connection  from "../../../../database";
import { Connection } from "typeorm";

let conn: Connection;

describe("Create User Controller", () => {
  beforeAll(async () => {
    conn = await connection();
    await conn.runMigrations();
  });

  afterAll(async () => {
    await conn.dropDatabase();
    await conn.close();
  });

  it("should be able to create a new user", async () => {
    const { status } =
      await request(app)
        .post('/api/v1/users')
        .send({
          name: "Douglas",
          email: "95deal@gmail.com",
          password: "12345678"
        });

    expect(status).toBe(201);
  });

});
