export interface PortalMenuIcon {
  type: 'predefined' | 'custom';
  value: string;
}

export interface PortalMenuItem {
  id: string;
  name: string;
  icon: PortalMenuIcon;
  link: string;
}

// ── Module preset options ──────────────────────────────────────────────────────

export interface ModulePreset {
  value:    string;
  label:    string;
  name:     string;
  link:     string;
  iconName: string;
}
