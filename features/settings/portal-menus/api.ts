import { authClient } from '@/lib/auth-client';
import type { PortalMenuItem } from './types';

// authClient.organization.update() data type only includes standard BA fields.
// publicPortalMenus is an additionalField — the cast bridges the typing gap.
type OrgUpdateData = Parameters<typeof authClient.organization.update>[0]['data'];

// publicPortalMenus is read via better-auth get-full-organization — no separate GET needed.
export async function updatePortalMenus(
  organizationId: string,
  publicPortalMenus: PortalMenuItem[],
): Promise<void> {
  const links = publicPortalMenus.map(m => m.link.toLowerCase().trim());
  const duplicateLink = links.find((link, i) => links.indexOf(link) !== i);
  if (duplicateLink) {
    throw new Error(`"${duplicateLink}" is already used by another menu item. Each link must be unique.`);
  }

  // Re-index order by position to close any gaps, then sort before persisting
  const menus: PortalMenuItem[] = publicPortalMenus
    .map((m, i) => ({ ...m, order: i + 1 }))
    .sort((a, b) => a.order - b.order);

  const { error } = await authClient.organization.update({
    data: { publicPortalMenus: menus } as unknown as OrgUpdateData,
    organizationId,
  });
  if (error) throw new Error(error.message);
}
