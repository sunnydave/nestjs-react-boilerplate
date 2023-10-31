import { IsString } from "class-validator";

export class DomainCheckDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly subDomain: string;
}
