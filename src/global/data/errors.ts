import "server-only";

export type DbErrorType =
  | "db.not_found"
  | "db.conflict"
  | "db.invalid_reference"
  | "db.invalid_value"
  | "db.forbidden"
  | "db.timeout"
  | "db.query_failed";

const USER_MESSAGES: Record<DbErrorType, string> = {
  "db.not_found": "Sorry, we couldn't find what you were looking for.",
  "db.conflict": "That already exists.",
  "db.invalid_reference": "Something this depends on no longer exists.",
  "db.invalid_value": "Some of that information isn't valid.",
  "db.forbidden": "You don't have access to that.",
  "db.timeout": "Your request timed out. Try again.",
  "db.query_failed": "Something went wrong. Try again.",
};

export class DbError extends Error {

  readonly type: DbErrorType;
  readonly operation: string;
  readonly code?: string;

  constructor(type: DbErrorType, operation: string, message: string, code?: string, cause?: unknown) {

    super(`[${operation}] ${message}`, { cause });
    this.name = "DbError";
    this.type = type;
    this.operation = operation;
    this.code = code;
  }

  get userMessage(): string {
    return USER_MESSAGES[this.type];
  }

}

type SupabaseLikeError = { code?: string; message: string };

const CODE_TO_TYPE: Record<string, DbErrorType> = {
  PGRST116: "db.not_found",        // .single() found 0 rows
  "23505": "db.conflict",          // unique_violation
  "23503": "db.invalid_reference", // foreign_key_violation
  "23514": "db.invalid_value",     // check_violation
  "23502": "db.invalid_value",     // not_null_violation
  "22P02": "db.invalid_value",     // invalid_text_representation (bad uuid)
  "42501": "db.forbidden",         // insufficient_privilege (RLS on write)
  "57014": "db.timeout",       
};

export function toDbError(error: SupabaseLikeError, operation: string): DbError {
  const type = (error.code && CODE_TO_TYPE[error.code]) || "db.query_failed";
  return new DbError(type, operation, error.message, error.code, error);
}