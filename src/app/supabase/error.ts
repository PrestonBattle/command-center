/**
 * these are the errors that are related to the database interactions with supabase
 */

type DbNotFound = {
  type: "db.not_found";
  message: string;
  [key: string]: unknown;
};

type DbQueryFailed = {
  type: "db.query_failed";
  message: string;
  [key: string]: unknown;
};

type DbTimeout = {
  type: "db.timeout";
  message: string;
  [key: string]: unknown;
};

export type DbError = DbNotFound | DbQueryFailed | DbTimeout;
