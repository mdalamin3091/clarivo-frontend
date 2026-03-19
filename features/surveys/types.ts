export type SurveyStatus = 'draft' | 'active' | 'closed';

export interface Survey {
  id: string;
  title: string;
  description: string;
  status: SurveyStatus;
  responseCount: number;
  createdAt: string;
  updatedAt: string;
  organizationId: string;
}
