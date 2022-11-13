import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredtionalsDto {
    @IsString()
    @MaxLength(20)
    @MinLength(4)
    username: string;

    @IsString()
    @MaxLength(20)
    @MinLength(4)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: "The password is very weak"})
    password: string;
}