import { Connection } from "typeorm";
import request from "supertest";

import connection  from "../../../../database";
import { app } from "../../../../app";

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
    const {body, status} = await request(app).post('/users').send({name: "Douglas", email: "95deal@gmail.com", password: "12345678"});
    console.log(body);
    expect(status).toBe(201);
  });

  it("should be able to return message", async () => {
    const {body, status, statusCode} = 
        await request(app).get("/test");
            
            console.log(body)

        expect(statusCode).toEqual(200);
        expect(body).toHaveProperty("message");
  });
});
