import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserM, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';
import { User } from 'src/decorator/customize';
import aqp from 'api-query-params';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { USER_ROLE } from 'src/databases/sample';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserM.name)
    private userModel: SoftDeleteModel<UserDocument>,

    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>,
  ) { }

  hashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);

    return hash;
  }

  isValidPassword = (password: string, hashedPassword: string) => {
    return compareSync(password, hashedPassword);
  }

  async create(createUserDto: CreateUserDto, @User() user: IUser) {
    const { name, email, password, age, gender, address, role, company } = createUserDto;
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = this.hashPassword(createUserDto.password);
    let newUser = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      age,
      gender,
      address,
      role,
      company,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return newUser;
  }

  async register(user: RegisterUserDto) {
    const { name, email, password, age, gender, address } = user;
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException('Email already exists');
    }

    const userRole = await this.roleModel.findOne({ name: USER_ROLE })

    const hashedPassword = this.hashPassword(password);
    let newUser = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      age,
      gender,
      address,
      role: userRole?._id,
    });

    return newUser;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (currentPage - 1) * limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select('-password')
      .populate(population)
      .exec()

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems
      },
      result
    };
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `not found`;
    }

    return this.userModel.findOne({ _id: id })
      .select('-password')
      .populate({ path: 'roles', select: { name: 1, _id: 1 } });
  }

  findOnByUsername(email: string) {
    return this.userModel.findOne({ email: email })
      .populate({ path: 'role', select: { name: 1 } });
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    return await this.userModel.updateOne(
      { _id: updateUserDto._id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        }
      });
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `not found`;
    }

    const foundUser = await this.userModel.findById(id)
    if (foundUser && foundUser.email === 'admin@gmail.com') {
      throw new BadRequestException("Action not allow")
    }

    await this.userModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        }
      });
    return this.userModel.softDelete({ _id: id });
  }

  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne(
      { _id },
      {
        refreshToken
      });
  }

  findUserByToken = async (refreshToken: string) => {
    return (await this.userModel.findOne({ refreshToken })).populate({
      path: 'role',
      select: { name: 1 }
    });
  }
}
