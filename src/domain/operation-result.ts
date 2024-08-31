export interface OperationResult<T> {
  status: "SUCCESS" | "ERROR";
  result?: T;
  errorCode?: string;
}
