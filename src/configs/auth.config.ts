const config = {
  jwtSecret: process.env.JWT_SECRET,
  accessTokenExpiryTime: Number(
    process.env.ACCESS_TOKEN_EXPIRY_TIME || 60 * 60
  ),
  refreshTokenExpiryTime: Number(
    process.env.REFRESH_TOKEN_EXPIRY_TIME || 60 * 60
  ),
};

export default config;
