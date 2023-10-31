import { Column, Entity } from "typeorm";
import { BaseEntity } from "../common/base/entity/base.entity";
import { CreateOrgDto } from "./dto/create-org.dto";

@Entity()
export class Organization extends BaseEntity {
  @Column()
  name: string;

  @Column({
    unique: true,
    nullable: true,
  })
  customDomain: string;

  @Column({
    unique: true,
  })
  subDomain: string;
}
