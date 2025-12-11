// Password encryption utility - Implements OpenSSL EVP_BytesToKey compatible encryption
// Matches Go backend implementation for secure password handling

import crypto from 'crypto';

function evpBytesToKey(
  password: string,
  salt: Buffer,
  keyLen: number,
  ivLen: number
): { key: Buffer; iv: Buffer } {
  let concat = Buffer.alloc(0);
  let lastHash = Buffer.alloc(0);
  const totalLen = keyLen + ivLen;

  while (concat.length < totalLen) {
    const hash = crypto.createHash('md5');
    hash.update(lastHash);
    hash.update(password, 'utf8');
    hash.update(salt);
    lastHash = hash.digest();
    concat = Buffer.concat([concat, lastHash]);
  }

  return {
    key: concat.slice(0, keyLen),
    iv: concat.slice(keyLen, keyLen + ivLen),
  };
}

function pkcs7Pad(data: Buffer, blockSize: number): Buffer {
  const padding = blockSize - (data.length % blockSize);
  const padBuffer = Buffer.alloc(padding, padding);
  return Buffer.concat([data, padBuffer]);
}

export function encryptPassword(password: string): string {
  const encryptionKey =
    process.env.NEXT_PUBLIC_ENCRYPTION_KEY ||
    'yV9!pZt8@Q1mH!s4Xj^2bGkEw&uLrN0C';
  const saltFront =
    process.env.NEXT_PUBLIC_ENCRYPTION_SALT_FRONT || 'frontSalt1234';
  const saltBack =
    process.env.NEXT_PUBLIC_ENCRYPTION_SALT_BACK || 'backSalt5678';

  // Create deterministic salt from environment values (8 bytes)
  // Match Go implementation: combine salts, convert to bytes, take first 8
  const combinedSalt = saltFront + saltBack;
  let salt = Buffer.from(combinedSalt, 'utf8');
  
  if (salt.length > 8) {
    salt = salt.slice(0, 8);
  } else if (salt.length < 8) {
    const padding = Buffer.alloc(8 - salt.length, 0);
    salt = Buffer.concat([salt, padding]);
  }

  // Derive key and IV using EVP_BytesToKey equivalent
  const { key, iv } = evpBytesToKey(encryptionKey, salt, 32, 16);

  // Create AES-256-CBC cipher
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  
  // Disable automatic padding - we'll handle PKCS7 manually
  cipher.setAutoPadding(false);

  // Add PKCS7 padding to plaintext
  const plaintextBuffer = Buffer.from(password, 'utf8');
  const paddedPlaintext = pkcs7Pad(plaintextBuffer, 16);

  // Encrypt (should return exactly same length as input for manual padding)
  let ciphertext = cipher.update(paddedPlaintext);
  ciphertext = Buffer.concat([ciphertext, cipher.final()]);

  // Prepend "Salted__" and salt, then base64 encode
  const result = Buffer.concat([Buffer.from('Salted__'), salt, ciphertext]);

  return result.toString('base64');
}
