import brcrypt from 'bcrypt';
import { BcryptAdapter } from './bcypt-adapter';

describe('Bcrypt Adapter', () => {
  test('Should call encrypt with correct value', async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);
    const hashSpy = jest.spyOn(brcrypt, 'hash');
    await sut.encrypt('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });
});
