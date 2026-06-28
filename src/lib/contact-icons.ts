import { Mail, Linkedin, Github, Globe, Phone, type LucideIcon } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  linkedin: Linkedin,
  email: Mail,
  mail: Mail,
  envelope: Mail,
  github: Github,
  globe: Globe,
  website: Globe,
  phone: Phone,
};

const DEFAULT_ICON: LucideIcon = Linkedin;

/**
 * Resolve a contact's icon_name string to a Lucide icon component.
 */
export function getContactIcon(iconName?: string | null): LucideIcon {
  const key = iconName?.toLowerCase().trim() || '';
  return ICON_MAP[key] || DEFAULT_ICON;
}
