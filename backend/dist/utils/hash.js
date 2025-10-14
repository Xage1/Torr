import bcrypt from 'bcrypt';
const SALT_ROUNDS = 12;
export async function hashPassword(plain) {
    const hash = await bcrypt.hash(plain, SALT_ROUNDS);
    return hash;
}
export async function comparePassword(plain, hash) {
    return bcrypt.compare(plain, hash);
}
//# sourceMappingURL=hash.js.map