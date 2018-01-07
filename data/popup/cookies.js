'use strict';

var cookies = {};

cookies.all = url => new Promise(resolve => chrome.cookies.getAll({
  url
}, resolve));

cookies.replace = (url, oldC, newC) => {
  Object.assign(newC, {url});
  return new Promise((resolve, reject) => {
    const next = () => {
      try {
        chrome.cookies.set(newC, cookie => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          }
          else {
            resolve(cookie);
          }
        });
      }
      catch (e) {
        reject(e);
      }
    };
    if (oldC.name) {
      chrome.cookies.remove({
        name: oldC.name,
        url
      }, next);
    }
    else {
      next();
    }
  });
};

cookies.remove = (url, cookie) => new Promise(resolve => chrome.cookies.remove({
  name: cookie.name,
  url
}, resolve));
