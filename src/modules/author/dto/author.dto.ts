import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsISO8601,
  IsUUID,
} from 'class-validator';
import {
  IsStr,
  IsNE,
  MinL,
  MaxL,
  IsDt,
  IsUUIDKey,
} from '../../common/const/messages.const';

export class AuthorDto {
  @IsString({ message: IsStr })
  @IsNotEmpty({ message: IsNE })
  @MinLength(4, {
    message: `El nombre ${MinL(4)}`,
  })
  @MaxLength(120, {
    message: `El nombre ${MaxL(120)}`,
  })
  public readonly name: string;

  @IsString({ message: IsStr })
  @IsNotEmpty({ message: IsNE })
  @MinLength(4, {
    message: `EL apellido ${MinL(4)}`,
  })
  @MaxLength(120, {
    message: `El apellido ${MaxL(120)}`,
  })
  public readonly lastName: string;

  @IsNotEmpty({ message: IsNE })
  @IsISO8601({ message: IsDt })
  public readonly dateBirth: string;

  @IsString({ message: IsStr })
  @IsNotEmpty({ message: IsNE })
  @IsUUID('4', { message: IsUUIDKey(4) })
  public readonly gender: any;
}
