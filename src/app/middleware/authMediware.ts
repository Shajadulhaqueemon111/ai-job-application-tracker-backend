import { Request } from 'express';
import { UAParser } from 'ua-parser-js';

export const GetAuditLogger = (req: Request) => {
  const parser = new UAParser(req.headers['user-agent'] || '');
  const result = parser.getResult();

  // IPv6 ::1 → 127.0.0.1 normalize
  const rawIp =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown';
  const ip = rawIp === '::1' ? '127.0.0.1' : rawIp;

  const browser = result.browser.name
    ? `${result.browser.name} ${result.browser.version || ''}`.trim()
    : 'unknown';

  const os = result.os.name
    ? `${result.os.name} ${result.os.version || ''}`.trim()
    : 'unknown';

  const device =
    result.device.type ||
    (result.os.name?.toLowerCase().includes('android') ||
    result.os.name?.toLowerCase().includes('ios')
      ? 'mobile'
      : 'desktop');

  return { ip, browser, os, device };
};
