import { json } from "express";
import { generateOTP } from "../common/index.js";
import { redisClient } from "./rides.connection.js";

class RedisRepository {
  constructor(redisClient = redisClient) {
    this.redisClient = redisClient;
  }
  async set(key, value, options = {}) {
    await this.redisClient.set(key, JSON.stringify(value), options);
  }
  async get(key) {
    const value = await this.redisClient.get(key);
    return JSON.parse(value);
  }
  async increment(key) {
    await this.redisClient.incr(key);
  }
  async expire(key, seconds) {
    await this.redisClient.expire(key, seconds);
  }
  async del(key) {
    await this.redisClient.del(key);
  }
  async genAccVarficationOTP(email, EX = 60 * 60) {
    const otp = generateOTP();
    await this.redisClient.set(`otp:${email}`, otp, { EX });
    await this.redisClient.set(`otp:${email}:used`, "0", { EX });
    return otp;
  }
  // Check if OTP is correct and count how many times it has been used
  async verifyAccVarficationOTP(email, otp) {
    const storedOTP = await this.redisClient.get(`otp:${email}`);
    if (!storedOTP) {
      return { used: false, varified: false };
    }
    // use the OTP and increase the used count
    let used = await this.redisClient.get(`otp:${email}:used`);
    used = +used + 1;
    used = used.toString();
    await this.redisClient.set(`otp:${email}:used`, used, { EX: 60 * 60 });

    // If OTP is used 4 times, delete it and return false
    if (used >= "4") {
      await this.redisClient.del(`otp:${email}:used`);
      await this.redisClient.del(`otp:${email}`);
      return { used: true, varified: false };
    }

    // If OTP is correct and used less than 4 times, delete it and return true
    if (storedOTP == otp) {
      await this.redisClient.del(`otp:${email}`);
      return { used: false, varified: true };
    }

    return { used: false, varified: false };
  }
}
export default new RedisRepository(redisClient);
