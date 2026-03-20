/**
 * Pure utility functions for the branding settings feature.
 * No React imports — safe to use in any layer.
 */

export function isValidHex(val: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(val);
}
