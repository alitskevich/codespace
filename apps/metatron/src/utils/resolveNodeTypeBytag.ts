export function resolveNodeTypeBytag(tag: string): string {
  if (tag[0].toUpperCase() === tag[0]) {
    if (tag.endsWith('Service') || tag.endsWith('Controller')) {
      return 'service';
    }
    if (tag.startsWith('DynamicComponent')) {
      return 'dynamic';
    }
    return 'component';
  }
  return 'html';
}
