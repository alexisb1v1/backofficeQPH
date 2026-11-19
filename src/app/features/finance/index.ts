import { financeRepository } from "./repositories/finance.repository.impl";
import { GetFinanceRequestsUseCase } from "./use-cases/get-finance-requests.use-case";
import { ApproveFinanceRequestUseCase } from "./use-cases/approve-finance-request.use-case";
import { MarkFinanceRequestPaidUseCase } from "./use-cases/mark-finance-request-paid.use-case";
import { RejectFinanceRequestUseCase } from "./use-cases/reject-finance-request.use-case";

export const getFinanceRequestsUseCase = new GetFinanceRequestsUseCase(
  financeRepository,
);
export const approveFinanceRequestUseCase = new ApproveFinanceRequestUseCase(
  financeRepository,
);
export const markFinanceRequestPaidUseCase = new MarkFinanceRequestPaidUseCase(
  financeRepository,
);
export const rejectFinanceRequestUseCase = new RejectFinanceRequestUseCase(
  financeRepository,
);

export * from "./models/finance-request.model";
export * from "./dto/finance-request.dto";
export * from "./repositories/finance.repository";
