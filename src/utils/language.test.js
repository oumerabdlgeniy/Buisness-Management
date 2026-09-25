import test from 'node:test'
import assert from 'node:assert/strict'

import { normalizeLanguage } from './language.js'

test('normalizes legacy language names to supported language codes', () => {
  assert.equal(normalizeLanguage('English'), 'en')
  assert.equal(normalizeLanguage('Amharic'), 'am')
  assert.equal(normalizeLanguage('Arabic'), 'ar')
  assert.equal(normalizeLanguage('en'), 'en')
  assert.equal(normalizeLanguage('am'), 'am')
  assert.equal(normalizeLanguage('ar'), 'ar')
})

test('falls back to English for invalid values', () => {
  assert.equal(normalizeLanguage('fr'), 'en')
  assert.equal(normalizeLanguage(null), 'en')
  assert.equal(normalizeLanguage(undefined), 'en')
})
