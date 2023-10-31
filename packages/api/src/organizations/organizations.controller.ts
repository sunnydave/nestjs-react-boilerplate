import { Body, Controller, HttpException, Post } from "@nestjs/common";
import { OrganizationsService } from "./organizations.service";
import { Public } from "../auth/decorators/public.decorator";
import { CreateOrgDto } from "./dto/create-org.dto";

@Controller("organizations")
export class OrganizationsController {
  constructor(private service: OrganizationsService) {}

  @Public()
  @Post()
  async createOrganization(@Body() createOrgDto: CreateOrgDto) {
    const response = await this.service.createOrganization(createOrgDto);
    if (response) {
      return { status: response };
    } else {
      throw new HttpException("Cannot create organization", 500);
    }
  }
}
