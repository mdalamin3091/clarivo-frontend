export interface Status {
  id:             string;
  organizationId: string;
  name:           string;
  color:          string;
  isDefault:      boolean;
  order:          number;
  createdAt:      string;
  updatedAt:      string;
}

export interface CreateStatusInput {
  name:       string;
  color:      string;
  isDefault?: boolean;
}

export interface UpdateStatusInput {
  name?:  string;
  color?: string;
  order?: number;
}
