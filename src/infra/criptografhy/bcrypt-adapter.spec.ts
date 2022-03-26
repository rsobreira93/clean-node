import brcrypt from 'bcrypt';
import { BcryptAdapter } from './bcypt-adapter';

jest.mock('bcrypt', () => ({
  async hash(value: string, salt: number): Promise<string> {
    return Promise.resolve('hashed_value');
  },
}));

const salt = 12;
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};

describe('Bcrypt Adapter', () => {
  test('Should call encrypt with correct value', async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(brcrypt, 'hash');
    await sut.encrypt('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  test('Should return a hash on sucess', async () => {
    const sut = makeSut();
    const hash = await sut.encrypt('any_value');
    expect(hash).toBe('hashed_value');
  });
});
