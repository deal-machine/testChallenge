import { compare, hash } from "bcryptjs";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository"
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";

let usersRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User Use Case", () => {
    beforeEach(async() => {
        usersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(usersRepository);
    });

    it("should be able to create a new user.", async () => {
        const userDTO: ICreateUserDTO = {
            name: "Douglas",
            email:"95deal@gmail.com", 
            password:"12345678" 
        };

        const user = await createUserUseCase.execute(userDTO);
    
        expect(user).toHaveProperty("id");
        expect(user.email).toEqual("95deal@gmail.com");
        expect(user.name).toEqual("Douglas");
        expect(user.password).not.toEqual("12345678");
    });

    it("should not be able to create a new user when email already exists.", async () => {
        const userDTO: ICreateUserDTO = {
            name: "Douglas",
            email:"95deal@gmail.com", 
            password:"12345678" 
        };
        
        await createUserUseCase.execute(userDTO);

        expect(async () => {
            await createUserUseCase.execute(userDTO);
        }).rejects.toBeInstanceOf(CreateUserError);
       
    });

    it("should be able to generate password hash", async () => {
        const passwordString: string = "12345678";
        const passwordHash = await hash(passwordString, 8);

        expect(passwordHash).not.toEqual(passwordString);
        expect(passwordHash.length).toBeGreaterThan(passwordString.length);

        const isTheSamePassword = await compare(passwordString, passwordHash);

        expect(isTheSamePassword).toBeTruthy();
    });
})