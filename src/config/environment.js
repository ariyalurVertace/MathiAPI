export const debug =
    process.env.DEBUG === "WARN" ? true : JSON.parse(process.env.DEBUG);
export const secure = JSON.parse(process.env.SECURE);
export const prod = JSON.parse(process.env.PROD);
export const environment = String(process.env.ENVIRONMENT);

export const httpPort = Number(process.env.HTTP_PORT);
export const httpsPort = Number(process.env.HTTPS_PORT);
export const databaseUrl = String(process.env.DATABASE_URL);
export const secretKey = String(process.env.SECRET_KEY);
export const certbotServer = String(process.env.CERTBOT_SERVER);

export const serverLog = JSON.parse(process.env.SERVER_LOG);
export const auditLog = JSON.parse(process.env.AUDIT_LOG);
export const loginLog = JSON.parse(process.env.LOGIN_LOG);
export const smsLog = JSON.parse(process.env.SMS_LOG);
export const emailLog = JSON.parse(process.env.EMAIL_LOG);
export const fcmLog = JSON.parse(process.env.FCM_LOG);

export const SMSOTPLength = process.env.SMS_OTP_LENGTH;
export const OTPValidMinutes = process.env.OTP_VALID_MINUTES;
export const smsUrl = process.env.SMS_URL;
export const smsSenderId = process.env.SMS_SENDER_ID;
export const smsUsername = process.env.SMS_USERNAME;
export const smsPassword = process.env.SMS_PASSWORD;
export const smsUniqueId = process.env.SMS_UNIQUE_ID;
export const smsKeyword = process.env.SMS_KEYWORD;
export const smsCircleName = process.env.SMS_CIRCLE_NAME;
export const smsCampaignName = process.env.SMS_CAMPAIGN_NAME;
export const smsRoute = process.env.SMS_ROUTE;

export const redisPrefix = process.env.REDIS_PREFIX;
export const redisHost = process.env.REDIS_HOST;
export const redisPort = process.env.REDIS_PORT;
export const redisPassword = process.env.REDIS_PASSWORD;

export const imageBucketName = process.env.IMAGE_BUCKET_NAME;
