export type CustomFieldType =
  | 'text'
  | 'number'
  | 'url'
  | 'date'
  | 'boolean'
  | 'dropdown'
  | 'multiselect';

export interface CustomField {
  id:                   string;
  organizationId:       string;
  name:                 string;
  type:                 CustomFieldType;
  options:              string[];
  placeholder:          string | null;
  isRequired:           boolean;
  isPrivate:            boolean;
  showAnswerToEveryone: boolean;
  order:                number;
  createdAt:            string;
  updatedAt:            string;
}

export interface CreateCustomFieldInput {
  name:                 string;
  type:                 CustomFieldType;
  options?:             string[];
  placeholder?:         string;
  isRequired?:          boolean;
  isPrivate?:           boolean;
  showAnswerToEveryone?: boolean;
}

export interface UpdateCustomFieldInput {
  name?:                string;
  type?:                CustomFieldType;
  options?:             string[];
  placeholder?:         string;
  isRequired?:          boolean;
  isPrivate?:           boolean;
  showAnswerToEveryone?: boolean;
  order?:               number;
}
