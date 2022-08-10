export const RandomString = (
  length?: number,
  uppercase?: boolean,
  lowercase?: boolean,
  number?: boolean,
): string => {
  let result = "";

  const uppercases = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercases = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";

  let characters = "";

  if (uppercase ?? true) characters = characters + uppercases;
  if (lowercase ?? true) characters = characters + lowercases;
  if (number ?? false) characters = characters + numbers;

  const _length = length ?? 10;

  for (let i = 0; i < _length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const GenerateId = RandomString;
export const RandomInt = (length: number): number => {
  return Number(GenerateId(length, false, false, true));
};
