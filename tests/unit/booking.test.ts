import { describe, expect, it } from 'vitest';
import { bookingHref, SITE } from '../../src/lib/site';

describe('bookingHref', () => {
  it('falls back to mailto when PUBLIC_CAL_LINK is unset', () => {
    expect(bookingHref('Speaking enquiry', '')).toBe(SITE.mailto('Speaking enquiry'));
    expect(bookingHref('Speaking enquiry', '   ')).toBe(SITE.mailto('Speaking enquiry'));
  });

  it('passes through a full URL unchanged', () => {
    expect(bookingHref('Speaking enquiry', 'https://cal.com/yaniv-proselkov/30min')).toBe(
      'https://cal.com/yaniv-proselkov/30min',
    );
  });

  it('strips surrounding quotes from a full URL', () => {
    expect(bookingHref('Speaking enquiry', '"https://cal.com/yaniv-proselkov/30min"')).toBe(
      'https://cal.com/yaniv-proselkov/30min',
    );
    expect(bookingHref('Speaking enquiry', "'https://cal.com/yaniv-proselkov/30min'")).toBe(
      'https://cal.com/yaniv-proselkov/30min',
    );
  });

  it('prefixes a bare user/event slug with the Cal.com origin', () => {
    expect(bookingHref('Speaking enquiry', 'yaniv-proselkov/30min')).toBe('https://cal.com/yaniv-proselkov/30min');
  });

  it('strips surrounding quotes from a bare slug', () => {
    expect(bookingHref('Speaking enquiry', '"yaniv-proselkov/30min"')).toBe('https://cal.com/yaniv-proselkov/30min');
  });
});
