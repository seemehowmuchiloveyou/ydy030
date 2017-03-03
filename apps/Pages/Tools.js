/**
 * 用于存储通用函数，现在有fetch timeout，获取数据超时函数
 * @author xph
 * xph@sectong.com
 */
'use strict';

export function   timeout(ms, promise) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error("timeout"))
      }, ms)
      promise.then(resolve, reject)
    })
  }