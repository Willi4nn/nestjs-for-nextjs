import * as bcrypt from 'bcryptjs';
import { HashingService } from './hashing.service';

export class BcryptHashingService extends HashingService {
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashedData = await bcrypt.hash(password, salt);
    return hashedData;
  }

  async compare(data: string, hashed: string): Promise<boolean> {
    const isValid = await bcrypt.compare(data, hashed);
    return isValid;
  }
}
