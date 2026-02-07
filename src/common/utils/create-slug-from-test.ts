import { GenerateRandomSuffix } from './generate-random-suffix';
import { slugify } from './slugify';

export function CreateSlugFromText(text: string) {
  const slug = slugify(text);
  return `${slug}-${GenerateRandomSuffix()}`;
}
