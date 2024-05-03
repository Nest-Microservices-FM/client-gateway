import { IsEmail, IsEnum, IsString, IsStrongPassword } from "class-validator";
import { Role, RoleUserList } from "./enum/role.enum";

export class RegisterUserDto {
  
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword()
  password: string;

  @IsEnum(RoleUserList, {
    message: `Valid role are ${ RoleUserList}`
  })
  role: Role;

}