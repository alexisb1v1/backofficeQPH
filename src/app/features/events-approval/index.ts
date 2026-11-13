import { eventApprovalRepository } from './repositories/event-approval.repository.impl';
import { GetApprovalEventsUseCase } from './use-cases/get-approval-events.use-case';
import { ApproveEventUseCase } from './use-cases/approve-event.use-case';
import { ObserveEventUseCase } from './use-cases/observe-event.use-case';
import { UpdateEventFeeUseCase } from './use-cases/update-event-fee.use-case';

export const getApprovalEventsUseCase = new GetApprovalEventsUseCase(eventApprovalRepository);
export const approveEventUseCase = new ApproveEventUseCase(eventApprovalRepository);
export const observeEventUseCase = new ObserveEventUseCase(eventApprovalRepository);
export const updateEventFeeUseCase = new UpdateEventFeeUseCase(eventApprovalRepository);

export * from './models/event-approval.model';
export * from './dto/event-approval.dto';
export * from './repositories/event-approval.repository';
export * from './use-cases/update-event-fee.use-case';
