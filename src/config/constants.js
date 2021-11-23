export const statusCodes = {
    SUCCESS: "200",
    NOT_ALLOWED: "405",
    NOT_FOUND: "404",
    NOT_AUTHORIZED: "401",
    DUPLICATE: "409",
    SERVER_ERROR: "500",
    NOT_IMPLEMENTED: "501",
    DATA_MISSING: "412",
    INVALID_DATA: "422",
    NOT_ACTIVE: "Your profie is not activated yet",
    USER_BLOCKED: "Your profile is blocked",
};

export const DefaultImages = {
    MALE:
        "https://police-app-staging.s3.ap-south-1.amazonaws.com/assets/male.png",
    FEMALE:
        "https://police-app-staging.s3.ap-south-1.amazonaws.com/assets/female.png",
    TRANSGENDER:
        "https://police-app-staging.s3.ap-south-1.amazonaws.com/assets/transgender.png",
    DEPARTMENTLOGO:
        "https://police-app-staging.s3.ap-south-1.amazonaws.com/assets/tamilnadulogo.png",
    REACHMEREQUESTTYPELOGO:
        "https://police-app-staging.s3.ap-south-1.amazonaws.com/assets/requesttype.png",
};

export const seedExpirationTimeInSecs = 3600;

export const errorCodes = [
    {code: 1001, message: "Database error", resolution: ""},
];

export const FILE_SIZE_LIMT = 500; // KB
export const FILE_MIN_SIZE = 5; // KB

export const ALLOWED_MIME_TYPES_UPLOAD = [
    "image/jpeg",
    "image/png",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/pdf",
    "text/csv",
    "application/vnd.ms-excel",
];

export const ALLOWED_EXT_UPLOAD = [
    "jpg",
    "jpeg",
    "png",
    "pdf",
    "doc",
    "docx",
    "xls",
    "xlsx",
    "csv",
];

export const policeDepartmentID = 5;

export const ALLOWED_DOMAINS = [/\.vertace\.com$/, /\.vertace\.net$/];

export const warningCodes = [];
export const localMomentOffset = "+05:30";

export const genericResult = {
    result: null,
    exception: null,
    pagination: null,
    errors: [],
    warnings: [],
    stringResult: statusCodes.SERVER_ERROR,
};

export const oneDaySeconds = 86400;
export const jwtExpirationTime = {
    days: 30,
    seconds: oneDaySeconds,
};

export const TablesToAudit = [
    {
        Table: "Test",
        Fields: ["Name"],
    },
];

export const OTPLength = 4;
export const OTPValidMinutes = 30;

export const TablesWithAttachments = ["Feedback"];
