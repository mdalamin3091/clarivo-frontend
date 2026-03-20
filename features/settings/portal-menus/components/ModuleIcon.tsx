'use client';

import React from 'react';
import { getIconComponent } from '../constants';

interface ModuleIconProps {
  name:       string;
  className?: string;
}

export function ModuleIcon({ name, className }: ModuleIconProps) {
  // React.createElement avoids the react-hooks/static-components lint error
  // that fires when a dynamic component is assigned and used as JSX (<Icon />).
  return React.createElement(getIconComponent(name), { className });
}
