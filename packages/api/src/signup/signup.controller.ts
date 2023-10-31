import { Body, Controller, Post } from "@nestjs/common";
import { SignupService } from "./signup.service";
import { Public } from "../auth/decorators/public.decorator";
import { DomainCheckDto } from "./dto/domain-check.dto";
import { SignupDto } from "./dto/signup.dto";

@Controller("signup")
export class SignupController {
  constructor(private service: SignupService) {}

  @Public()
  @Post("/checkSubDomainAvailable")
  async checkSubDomainAvailable(@Body() domainCheck: DomainCheckDto) {
    const checkIfAvailable =
      await this.service.checkSubDomainAvailable(domainCheck);
    return { isSubDomainAvailable: checkIfAvailable };
  }

  @Public()
  @Post("/checkUserEmailAvailable")
  async checkUserEmailAvailable(@Body() signupDto: SignupDto) {
    const checkIfAvailable = await this.service.checkEmailAvailable(signupDto);
    return { isEmailAvailable: checkIfAvailable };
  }
}
