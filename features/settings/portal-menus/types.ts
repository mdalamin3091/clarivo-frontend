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
