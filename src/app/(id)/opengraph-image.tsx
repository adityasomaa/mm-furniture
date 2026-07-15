import { renderOgCard, ogSize, ogContentType, ogAlt } from '@/lib/og-card';

export const size = ogSize;
export const contentType = ogContentType;
export const alt = ogAlt;

export default function Image() {
  return renderOgCard('id');
}
