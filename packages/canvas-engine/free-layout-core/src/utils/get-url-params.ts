/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

export function getUrlParams(): Record<string, string> {
  return location.search
    .replace(/^\?/, '')
    .split('&')
    .reduce((res: Record<string, string>, key) => {
      if (!key) return res;

      const [k, v] = key.split('=');

      // Prevent prototype pollution attack, filter dangerous attribute names
      if (k === '__proto__' || k === 'constructor' || k === 'prototype') {
        return res;
      }

      if (k) {
        res[k] = v || '';
      }
      return res;
    }, Object.create(null));
}
