import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SignupEntity } from "./signup.entity";
import { Repository } from "typeorm";
import { OrganizationsService } from "../organizations/organizations.service";
import { UsersService } from "../users/users.service";
import { DomainCheckDto } from "./dto/domain-check.dto";
import { SignupDto } from "./dto/signup.dto";

@Injectable()
export class SignupService {
  constructor(
    @InjectRepository(SignupEntity)
    private signupRepository: Repository<SignupEntity>,
    private organizationService: OrganizationsService,
    private userService: UsersService,
  ) {}

  async checkSubDomainAvailable(domainCheck: DomainCheckDto): Promise<boolean> {
    return this.organizationService.checkSubDomainAvailable(
      domainCheck.subDomain,
    );
  }

  async checkEmailAvailable(signupDto: SignupDto): Promise<boolean> {
    return this.userService.checkEmailAvailable(signupDto.email);
  }
}
