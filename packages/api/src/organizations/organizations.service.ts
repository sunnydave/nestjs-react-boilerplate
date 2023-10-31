import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Organization } from "./organization.entity";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { CreateOrgDto } from "./dto/create-org.dto";
import { User } from "../users/user.entity";
import { Role } from "../users/role.enum";

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    private userService: UsersService,
  ) {}

  async checkSubDomainAvailable(subDomain: string): Promise<boolean> {
    try {
      const organizationCount = await this.organizationRepository.count({
        where: {
          subDomain: subDomain,
        },
      });
      return !(organizationCount && organizationCount > 0);
    } catch (e) {
      console.error("Error check sub domain", e);
      return false;
    }
  }

  async createOrganization(createOrgDto: CreateOrgDto): Promise<boolean> {
    try {
      let organization = new Organization();
      organization.name = createOrgDto.name;
      organization.subDomain = createOrgDto.subDomain;
      organization = await this.organizationRepository.save(organization);
      const user = new User();
      user.firstName = createOrgDto.firstName;
      user.lastName = createOrgDto.lastName;
      user.email = createOrgDto.email;
      user.password = createOrgDto.password;
      user.organization = organization;
      user.role = Role.Org_Admin;
      const isUserCreated = await this.userService.createUser(user);
      return isUserCreated;
    } catch (e) {
      console.error("Error creating org", e);
      return false;
    }
  }
}
