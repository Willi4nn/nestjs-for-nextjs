import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from 'src/common/hashing/hashing.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService
  ) {}

  async failIfEmailExists(email: string) {
    const emailExists = await this.userRepository.existsBy({
      email,
    });

    if (emailExists) {
      throw new ConflictException('User with this email already exists');
    }
  }

  async findOneByOrFail(userData: Partial<User>) {
    const user = await this.userRepository.findOneBy(userData);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(dto: CreateUserDto) {
    await this.failIfEmailExists(dto.email);

    const hashedPassword = await this.hashingService.hash(dto.password);
    const user: CreateUserDto = {
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    };

    const newUser = await this.userRepository.save(user);
    return newUser;
  }

  findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  findById(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  async update(id: string, dto: UpdateUserDto) {
    if (!dto.name && !dto.email) {
      throw new BadRequestException(
        'At least one field (name or email) must be provided for update'
      );
    }

    const user = await this.findOneByOrFail({ id });

    user.name = dto.name ?? user.name;

    if (dto.email && dto.email !== user.email) {
      await this.failIfEmailExists(dto.email);
      user.email = dto.email;
      user.forceLogout = true;
    }

    return this.save(user);
  }

  async updatePassword(id: string, dto: UpdatePasswordDto) {
    const user = await this.findOneByOrFail({ id });

    const isCurrentPasswordValid = await this.hashingService.compare(
      dto.currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    user.password = await this.hashingService.hash(dto.newPassword);
    user.forceLogout = true;

    return this.save(user);
  }

  async remove(id: string) {
    const user = await this.findOneByOrFail({ id });
    await this.userRepository.delete({ id });
    return user;
  }

  save(user: User) {
    return this.userRepository.save(user);
  }
}
