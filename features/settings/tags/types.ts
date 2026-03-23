export interface Tag {
  id:             string;
  organizationId: string;
  name:           string;
  color:          string;
  isPrivate:      boolean;
  order:          number;
  createdAt:      string;
  updatedAt:      string;
}

export interface CreateTagInput {
  name:       string;
  color:      string;
  isPrivate?: boolean;
}

export interface UpdateTagInput {
  name?:      string;
  color?:     string;
  isPrivate?: boolean;
  order?:     number;
}
