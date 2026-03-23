export type RoadmapVisibility = 'everyone' | 'teamOnly';

export interface RoadmapIcon {
  type:  'predefined' | 'emoji';
  value: string;
}

export interface RoadmapColumn {
  id:          string;
  roadmapId:   string;
  name:        string;
  description: string | null;
  icon:        RoadmapIcon | null;
  color:       string;
  baseFilter:  string;
  order:       number;
  createdAt:   string;
  updatedAt:   string;
}

export interface Roadmap {
  id:             string;
  organizationId: string;
  name:           string;
  description:    string | null;
  icon:           RoadmapIcon;
  visibility:     RoadmapVisibility;
  baseFilter:     string;
  copiedFromId:   string | null;
  order:          number;
  columns:        RoadmapColumn[];
  createdAt:      string;
  updatedAt:      string;
}

export interface CreateRoadmapInput {
  name:          string;
  icon:          RoadmapIcon;
  description?:  string;
  visibility?:   RoadmapVisibility;
  baseFilter?:   string;
  copiedFromId?: string;
}

export interface UpdateRoadmapInput extends Partial<CreateRoadmapInput> {
  baseFilter?: string;
  order?:      number;
}

export interface UpdateRoadmapColumnInput {
  name?:       string;
  color?:      string;
  baseFilter?: string;
  order?:      number;
}

export interface ReorderColumnsInput {
  items: Array<{ id: string; order: number }>;
}

export interface ReorderRoadmapsInput {
  items: Array<{ id: string; order: number }>;
}
