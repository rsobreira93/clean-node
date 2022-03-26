import { Encrypter } from '../../protocols/encypter';
import { DbAddAccount } from './db-add-account';

interface SutTypes {
  sut: DbAddAccount;
  encryptStub: Encrypter;
}

const makeSut = (): SutTypes => {
  class EncrypterStub {
    async encrypt(password: string): Promise<string> {
      return new Promise((resolve) => resolve('hashed_password'));
    }
  }
  const encryptStub = new EncrypterStub();
  const sut = new DbAddAccount(encryptStub);

  return {
    sut,
    encryptStub,
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
});
