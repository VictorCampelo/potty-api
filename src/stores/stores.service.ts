import { FilesService } from './../files/files.service';
import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from './store.entity';
import { StoreRepository } from './stores.repository';
import * as _ from 'lodash';
import { CategoriesService } from 'src/categories/categories.service';
import { getRepository } from 'typeorm';
import { FindStoreDto } from './dto/find-store.dto';
import { PaymentsService } from 'src/payments/payments.service';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(StoreRepository)
    private storeRepository: StoreRepository,
    private usersService: UsersService,
    private filesService: FilesService,
    private categoriesService: CategoriesService,
    private paymentsService: PaymentsService,
  ) { }

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const store = await this.storeRepository.createStore(createStoreDto);

    const storeNameAlreadyExists = await this.storeRepository.findOne({
      where: {
        formatedName: store.formatedName,
      },
    });

    if (storeNameAlreadyExists) {
      throw new HttpException(
        'Já existe uma Loja com esse nome',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (createStoreDto.avatar) {
      const avatar = await this.filesService.uploadSingleFileToS3(
        createStoreDto.avatar,
        store.name,
      );

      store.avatar = avatar;

      await this.filesService.saveFile(avatar);
    }

    return store;
  }

  async save(store: Store) {
    return this.storeRepository.save(store);
  }

  async saveAll(stores: Store[]) {
    return this.storeRepository.save(stores);
  }

  findAll() {
    return this.storeRepository.find({
      join: {
        alias: 'store',
        leftJoinAndSelect: {
          user: 'store.avatar',
          background: 'store.background',
        },
      },
    });
  }

  async findAllByIds(ids: string[]) {
    return this.storeRepository.findByIds(ids, {
      relations: ['paymentMethods'],
    });
  }

  async findOne(id: string) {
    const store = await this.storeRepository.findOne(id, {
      join: {
        alias: 'store',
        leftJoinAndSelect: {
          user: 'store.avatar',
          background: 'store.background',
          categories: 'store.categories'
        },
      },
    });
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    return store;
  }

  async findOneByUser(userId: string) {
    const store = await this.usersService.myStore(userId);
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    return store;
  }

  async findStoreMe(owner_id: string) {
    const user = await this.usersService.findUserMe(owner_id);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOneByName(formatedName: string) {
    const store = await this.storeRepository.findOne({
      where: { formatedName: formatedName },
      join: {
        alias: 'store',
        leftJoinAndSelect: {
          user: 'store.avatar',
          background: 'store.background',
        },
      },
    });
    if (!store) {
      throw new NotFoundException('Store not found');
    }

    return store;
  }

  async update(
    id: string,
    updateStoreDto: UpdateStoreDto,
    files: Express.Multer.File[],
  ) {
    const storeCheck = await this.storeRepository.findOne({
      where: { formatedName: updateStoreDto.formatedName },
    });

    if (storeCheck) {
      throw new HttpException(
        'Store URL name already taken',
        HttpStatus.BAD_GATEWAY,
      );
    }

    const store = await this.findOne(id);

    if (updateStoreDto.paymentMethods && updateStoreDto.paymentMethods.length) {
      const lowerPms = updateStoreDto.paymentMethods.map((pm) => {
        return pm.toLowerCase();
      });

      const paymentsFound = await this.paymentsService.findByName(lowerPms);

      store.paymentMethods = paymentsFound;

      if (!paymentsFound.length) {
        throw new HttpException(
          'Payment methods not found',
          HttpStatus.NOT_FOUND,
        );
      }

      updateStoreDto = _.omit(updateStoreDto, 'paymentMethods');
    }

    if (updateStoreDto.name) {
      if (!/^[A-Za-z0-9_-]+$/g.test(updateStoreDto.name.replace(/ /g, '-'))) {
        throw new HttpException(
          'Nome da Loja contém caracteres inválidos',
          HttpStatus.BAD_REQUEST,
        );
      }

      updateStoreDto['formatedName'] = updateStoreDto.name
        .replace(/ /g, '-')
        .toLowerCase();
    }

    if (files && files[0]) {
      const avatar = await this.filesService.uploadSingleFileToS3(
        files[0],
        store.name,
      );

      store.avatar = avatar;
      await this.filesService.saveFile(avatar);
    }

    if (files && files[1]) {
      console.log(files);
      const background = await this.filesService.uploadSingleFileToS3(
        files[1],
        store.name,
      );

      store.background = background;

      await this.filesService.saveFile(background);
    }


    if (updateStoreDto.categoriesIds) {
      store.categories = await this.categoriesService.findAllByIdsTypeStore(
        updateStoreDto.categoriesIds,
      );
    }
    updateStoreDto = _.omit(updateStoreDto, 'categoriesIds');

    Object.assign(store, updateStoreDto);

    return store.save();
  }

  remove(id: number) {
    return `This action removes a #${id} store`;
  }

  async addLike(user: User, name: string): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: {
        formatedName: name,
      },
      relations: ['usersWhoLiked'],
    });

    if (!user || !store) {
      throw new NotFoundException('User or Store not found.');
    }

    store.usersWhoLiked.forEach((userInFavorites) => {
      if (userInFavorites.id === user.id) {
        throw new UnauthorizedException(
          "User can't favorite the same store twice.",
        );
      }
    });

    return this.storeRepository.addLike(user, store);
  }

  async findOnSearch(findStoreDto: FindStoreDto) {
    const productsFound = [];
    const storesFound = [];
    const searchResults = await getRepository(Store)
      .createQueryBuilder('store')
      .leftJoinAndSelect('store.avatar', 'avatar')
      .leftJoinAndSelect('store.background', 'background')
      .leftJoinAndSelect('store.products', 'p')
      .leftJoinAndSelect('p.files', 'files')
      .leftJoinAndSelect('p.categories', 'pc')
      .leftJoinAndSelect('store.categories', 'sc')
      .leftJoinAndSelect('store.productCategories', 'c')
      .where('city ILIKE :parameter', {
        parameter: `%${findStoreDto.parameter}%`,
      })
      .orWhere('store.name ILIKE :parameter', {
        parameter: `%${findStoreDto.parameter}%`,
      })
      .orWhere('p.title ILIKE :parameter', {
        parameter: `%${findStoreDto.parameter}%`,
      })
      .orWhere('p.description ILIKE :parameter', {
        parameter: `%${findStoreDto.parameter}%`,
      })
      .orWhere('c.name ILIKE :parameter', {
        parameter: `%${findStoreDto.parameter}%`,
      })
      .skip(findStoreDto.skip)
      .take(findStoreDto.take)
      .getMany();

    searchResults.forEach((result) => {
      const { products, ...store } = result;
      productsFound.push(...products);
      storesFound.push(store);
    });

    return { productsFound, storesFound };
  }

  async findFromCategory(categoryId: string) {
    return this.storeRepository.createQueryBuilder('stores')
      .innerJoinAndSelect('stores.categories', 'categories')
      .leftJoinAndSelect('stores.avatar', 'avatar')
      .leftJoinAndSelect('stores.background', 'background')
      .where('categories.id = :category', {
        category: categoryId,
      })
      .getMany();
  }

}
