import crypto from 'node:crypto';

export function hashUserPassword(password:string) {
  const salt = crypto.randomBytes(16).toString('hex');

  const hashedPassword = crypto.scryptSync(password, salt, 64);
  return hashedPassword.toString('hex') + ':' + salt;
}

export function verifyPassword(
  storedPassword: string,
  suppliedPassword: string
) {
  if (!storedPassword?.includes(":")) {
    return false;
  }

  const [hashedPassword, salt] = storedPassword.split(":");

  if (!hashedPassword || !salt) {
    return false;
  }

  const hashedPasswordBuf = Buffer.from(hashedPassword, "hex");
  const suppliedPasswordBuf = crypto.scryptSync(suppliedPassword, salt, 64);
  return crypto.timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
}
