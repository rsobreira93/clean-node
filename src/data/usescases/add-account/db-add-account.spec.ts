import {
  Encrypter,
  AccountModel,
  AddAccountModel,
  AddAccountRepository,
} from './db-add-account-protocols';
import { DbAddAccount } from './db-add-account';

interface SutTypes {
  sut: DbAddAccount;
  encryptStub: Encrypter;
  addAccountRepositoryStub: AddAccountRepository;
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'hashed_password',
      };
      return new Promise((resolve) => resolve(fakeAccount));
    }
  }
  return new AddAccountRepositoryStub();
};

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(password: string): Promise<string> {
      return new Promise((resolve) => resolve('hashed_password'));
    }
  }
  return new EncrypterStub();
};

const makeSut = (): SutTypes => {
  const encryptStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(encryptStub, addAccountRepositoryStub);

  return {
    sut,
    encryptStub,
    addAccountRepositoryStub,
  };
};

describe('DbAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { encryptStub, sut } = makeSut();
    const encryptSpy = jest.spyOn(encryptStub, 'encrypt');
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    };
    await sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });

  test('Should throw Encrypter if thowrs', async () => {
    const { encryptStub, sut } = makeSut();
    jest
      .spyOn(encryptStub, 'encrypt')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    };
    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });

  test('Should call AddAccountRepository with correct values', async () => {
    const { addAccountRepositoryStub, sut } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    };
    await sut.add(accountData);
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password',
    });
  });
});
