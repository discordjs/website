const request = require('superagent');
const semver = require('semver');

const branchBlacklist = ['gh-pages', 'gh-pages-dev', 'docs', 'v8', 'indev-old'];

const data = {
  branches: null,
  tags: null,
  latestTag: '0.0.0',
  docs: {},
};

function build(docs) {
  const links = {
    string: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String',
    number: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number',
    boolean: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean',
    void: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined',
    Object: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object',
    Function: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function',
    Array: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array',
    Set: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set',
    Map: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map',
    Date: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date',
    Promise: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise',
    EventEmitter: 'https://nodejs.org/dist/latest/docs/api/events.html#events_class_eventemitter',
    Timeout: 'https://nodejs.org/dist/latest/docs/api/timers.html#timers_class_timeout',
    Buffer: 'https://nodejs.org/dist/latest/docs/api/buffer.html#buffer_class_buffer',
    ReadableStream: 'https://nodejs.org/dist/latest/docs/api/stream.html#stream_class_stream_readable',
    ChildProcess: 'https://nodejs.org/dist/latest/docs/api/child_process.html#child_process_class_childprocess',
  };
  docs.classes = docs.classes.sort((a, b) => a.name.localeCompare(b.name));
  docs.typedefs = docs.typedefs.sort((a, b) => a.name.localeCompare(b.name));
  for (const jsclass of docs.classes) {
    links[jsclass.name] = 'class';
    if (jsclass.events) {
      jsclass.events = jsclass.events.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (jsclass.properties) {
      jsclass.properties = jsclass.properties.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (jsclass.methods) {
      jsclass.methods = jsclass.methods.sort((a, b) => a.name.localeCompare(b.name));
    }
  }
  for (const jsclass of docs.typedefs) {
    links[jsclass.name] = 'typedef';
  }
  docs.links = links;
  return docs;
}

function parseDocs(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    return alert(e);
  }
}

const store = {
  data,

  fetchBranches() {
    return new Promise((resolve, reject) => {
      if (data.branches) {
        resolve(data.branches);
        return;
      }
      request
        .get('https://api.github.com/repos/hydrabolt/discord.js/branches')
        .end((err, res) => {
          if (err) {
            reject(err);
            return;
          }
          data.branches = res.body;
          let i = 0;
          while (i < data.branches.length) {
            if (branchBlacklist.includes(data.branches[i].name)) data.branches.splice(i, 1);
            else i++;
          }
          resolve(data.branches);
        });
    });
  },

  fetchTags() {
    return new Promise((resolve, reject) => {
      if (data.tags) {
        resolve(data.tags);
        return;
      }
      request
        .get('https://api.github.com/repos/hydrabolt/discord.js/tags')
        .end((err, res) => {
          if (err) {
            reject(err);
            return;
          }
          data.tags = res.body;
          let i = 0;
          while (i < data.tags.length) {
            const name = data.tags[i].name.replace(/^v/, '');
            if (semver.gt(name, data.latestTag)) data.latestTag = data.tags[i].name;
            if (semver.lt(name, '9.0.0')) data.tags.splice(i, 1);
            else i++;
          }
          resolve(data.tags);
        });
    });
  },

  fetchDocs(tag) {
    return new Promise((resolve, reject) => {
      if (data.docs[tag]) {
        resolve(data.docs[tag]);
        return;
      }
      request
        .get(`https://raw.githubusercontent.com/hydrabolt/discord.js/docs/${tag}.json`)
        .end((err, res) => {
          if (err) {
            reject(err);
            return;
          }
          data.docs[tag] = build(res.body || parseDocs(res.text));
          resolve(data.docs[tag]);
        });
    });
  },
};

module.exports = store;
