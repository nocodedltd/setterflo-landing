/**
 * OAuth Token Encryption/Decryption
 * 
 * Encrypts OAuth tokens before storing in database
 * Uses AES-256-GCM encryption with a secret key
 */

import crypto from 'crypto';

// Get encryption key from environment variable
const ENCRYPTION_KEY = process.env.OAUTH_ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
  console.warn('⚠️  OAUTH_ENCRYPTION_KEY not set. OAuth tokens will not be encrypted.');
}

// Algorithm for encryption
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // For AES, this is always 16
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const TAG_POSITION = SALT_LENGTH + IV_LENGTH;
const ENCRYPTED_POSITION = TAG_POSITION + TAG_LENGTH;

/**
 * Derive a key from the encryption key using PBKDF2
 */
function getKey(salt: Buffer): Buffer {
  if (!ENCRYPTION_KEY) {
    throw new Error('OAUTH_ENCRYPTION_KEY environment variable is not set');
  }
  return crypto.pbkdf2Sync(ENCRYPTION_KEY, salt, 100000, 32, 'sha512');
}

/**
 * Encrypt a token string
 * @param token - Plain text token to encrypt
 * @returns Encrypted token as base64 string
 */
export function encryptToken(token: string): string {
  if (!ENCRYPTION_KEY) {
    console.warn('⚠️  Encryption key not set, storing token unencrypted');
    return token;
  }

  try {
    // Generate random salt and IV
    const salt = crypto.randomBytes(SALT_LENGTH);
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = getKey(salt);

    // Create cipher
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    // Encrypt the token
    const encrypted = Buffer.concat([
      cipher.update(token, 'utf8'),
      cipher.final(),
    ]);

    // Get authentication tag
    const tag = cipher.getAuthTag();

    // Combine salt + iv + tag + encrypted data
    const result = Buffer.concat([salt, iv, tag, encrypted]);

    // Return as base64 string
    return result.toString('base64');
  } catch (error) {
    console.error('❌ Token encryption failed:', error);
    throw new Error('Failed to encrypt token');
  }
}

/**
 * Decrypt a token string
 * @param encryptedToken - Encrypted token as base64 string
 * @returns Decrypted plain text token
 */
export function decryptToken(encryptedToken: string): string {
  if (!ENCRYPTION_KEY) {
    console.warn('⚠️  Encryption key not set, assuming token is unencrypted');
    return encryptedToken;
  }

  try {
    // Convert from base64 to buffer
    const buffer = Buffer.from(encryptedToken, 'base64');

    // Extract components
    const salt = buffer.subarray(0, SALT_LENGTH);
    const iv = buffer.subarray(SALT_LENGTH, TAG_POSITION);
    const tag = buffer.subarray(TAG_POSITION, ENCRYPTED_POSITION);
    const encrypted = buffer.subarray(ENCRYPTED_POSITION);

    // Derive key from salt
    const key = getKey(salt);

    // Create decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    // Decrypt the token
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    return decrypted.toString('utf8');
  } catch (error) {
    console.error('❌ Token decryption failed:', error);
    throw new Error('Failed to decrypt token');
  }
}

/**
 * Generate a random encryption key (for initial setup)
 * Use this to generate OAUTH_ENCRYPTION_KEY
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Verify that encryption/decryption works correctly
 */
export function testEncryption(): boolean {
  if (!ENCRYPTION_KEY) {
    console.warn('⚠️  Cannot test encryption: OAUTH_ENCRYPTION_KEY not set');
    return false;
  }

  try {
    const testToken = 'test_token_' + Math.random();
    const encrypted = encryptToken(testToken);
    const decrypted = decryptToken(encrypted);
    
    if (testToken === decrypted) {
      console.log('✅ Encryption test passed');
      return true;
    } else {
      console.error('❌ Encryption test failed: decrypted value does not match');
      return false;
    }
  } catch (error) {
    console.error('❌ Encryption test failed:', error);
    return false;
  }
}
