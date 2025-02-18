export const wait = (millis: number) =>
  new Promise((resolve) => setTimeout(resolve, millis));

export const matchAll = <Ret>(
  str: string,
  regexp: RegExp,
  cb: (v: RegExpMatchArray, index: number) => Ret = (v) => v as Ret,
) => {
  const arr: Ret[] = [];
  let i = 0;
  for (const m of str.matchAll(regexp)) {
    arr.push(cb(m, i));
    i++;
  }
  return arr;
};
