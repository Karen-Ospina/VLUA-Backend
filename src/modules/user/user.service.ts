import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './../../entities/user.entity';
import { Repository } from 'typeorm';
import { UserNameDto } from './dto/username.dto';


@Injectable()
export class UserService
{
  constructor(
    @InjectRepository(User)
    private readonly repository : Repository<User>
  ){}
    
  public async myProfile(userName : UserNameDto){
   return await this.repository
      .createQueryBuilder('user')
      .select("user.userName", "UserName")
      .addSelect("people.nameOne", "NameOne")
      .addSelect("people.nameTwo", "NameTwo")
      .addSelect("people.lastNameOne", "LastNameOne")
      .addSelect("people.lastNameTwo", "LastNameTwo")
      .addSelect("CONCAT(people.birthDate, '')", "BirthDate")
      .addSelect("people.identification", "Identification") 
      .addSelect("gender.gender", "Genders")
      .addSelect("typeDoc.typeDoc", "Document") 
      .innerJoin("user.people", "people")
      .innerJoin("people.typeDoc", "typeDoc")
      .innerJoin("people.gender", "gender")
      .where('user.userName = :userName', { userName : userName.userName})
      .andWhere("people.state = 'Activo'")
      .execute();
    ;
  }

  public async validUser(jwt: any): Promise<any> {
    console.log(jwt.idUser)
    let res = await this.repository
        .createQueryBuilder("user")
        .select("user.id", "idUser")
        .addSelect("user.UserName", "userName")
        .where("user.userName = :userName", { userName: jwt.userName })
        .getOne()
    ;
    return (res) ? jwt : false;
  }

}