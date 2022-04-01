export function uuid(): string{
  const s:string[] = [];
  const hexDigits = "0123456789abcdef";
  for (let i = 0; i < 16; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  return s.join("");
}
