import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, UpdateResult, Like } from 'typeorm';

import { Author } from './../../entities/author.entity';
import { AuthorDto } from './dto/author.dto';
import { State } from './../../entities/enums/state.enum';

@Injectable()
export class AuthorService {

  constructor(
    @InjectRepository(Author)
    private readonly repository : Repository<Author>
  ){}

  public async createAuthor(author : AuthorDto) : Promise<boolean> {
    const res : Author = await this.repository.findOne({
      name : author.name,
      lastName: author.lastName
    });
    if( !res ){
      const op = await this.repository.insert({
        name : author.name,
        lastName: author.lastName,
        dateBirth: author.dateBirth,
        state: State.Active,
        gender : author.gender
      });
      return op.raw.affectedRows > 0;
    }
    return false;
  }

  public async findAll(): Promise<Author[]> {
    return await this.repository
      .createQueryBuilder('author')
      .select('author.id', 'idAuthor')
      .addSelect('author.name', 'nameAuthor')
      .addSelect('author.lastName', 'lastNameAuthor')
      .addSelect('gender.gender', 'genderAuthor')
      .addSelect('author.state', 'state')
      .innerJoin('author.gender', 'gender')
      .where("author.state = 'Activo'")
      .orderBy('author.name', 'ASC')
      .execute()
    ;
  }

  public async updateAuthor(author : AuthorDto, id : string): Promise<boolean> {
    const exist: Author =  await this.repository.findOne({
      where : { id : id }
    });
    if( exist ){
      const res : UpdateResult = await this.repository.update(
        { id : id },
        {
          name: author.name,
          lastName: author.lastName,
          dateBirth: author.dateBirth,
          gender : author.gender
        }
      );
      return res.raw.affectedRows > 0;
    }
    return false;
  }

  public async deleteAuthor(id : string): Promise<boolean> {
    const exist: Author =  await this.repository.findOne({
      where : { id : id }
    });
    if( exist ) {
      const res : DeleteResult = await this.repository.delete({  
        id : id
      });
      return res.affected > 0 ;
    }
    return false;
  }

  public async findByName(name : string): Promise<Author[]> { //case or where x = y or y =x
    return await this.repository
      .createQueryBuilder('author')
      .select('author.id', 'idAuthor')
      .addSelect('author.name', 'nameAuthor')
      .addSelect('author.lastName', 'lastNameAuthor')
      .addSelect('gender.gender', 'genderAuthor')
      .addSelect('author.state', 'state')
      .innerJoin('author.gender', 'gender')
      .where("author.state = 'Activo' AND author.name LIKE :name", { name : '%' + name + '%' })
      .orWhere("author.lastName LIKE :name AND author.state = 'Activo'", { name : '%' + name + '%' })
      .orderBy('author.name', 'ASC')
      .execute()
    ;
  }
}