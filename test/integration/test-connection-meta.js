//  SPDX-License-Identifier: LGPL-2.1-or-later
//  Copyright (c) 2015-2023 MariaDB Corporation Ab

'use strict';

const base = require('../base.js');
const assert = require('chai').assert;

describe('Connection meta', function () {
  it('server version', () => {
    const serverVersion = shareConn.serverVersion();
    if (process.env.srv) {
      if (
        process.env.srv !== 'skysql' &&
        process.env.srv !== 'skysql-ha' &&
        process.env.srv !== 'maxscale' &&
        process.env.srv !== 'xpand'
      ) {
        const version = process.env.v;
        if (version) {
          assert(serverVersion.startsWith(version), serverVersion + '/' + version);
        }
      }
    }
  });

  it('server version before connect error', (done) => {
    const conn = base.createCallbackConnection();
    try {
      conn.serverVersion();
      done(new Error('Must have thrown exception'));
    } catch (err) {
      assert(err.message.includes('cannot know if server information until connection is established'));
      conn.connect(conn.end.bind(conn));
      done();
    }
  });

  it('isMariaDB', () => {
    const isMariadb = shareConn.info.isMariaDB();
    if (process.env.srv) {
      assert.equal(isMariadb, !process.env.srv.startsWith('mysql'));
    }
  });

  it('isMariaDB before connect error', (done) => {
    const conn = base.createCallbackConnection();
    try {
      conn.info.isMariaDB();
      done(new Error('Must have thrown exception'));
    } catch (err) {
      assert(err.message.includes('cannot know if server is MariaDB until connection is established'));
      conn.connect(conn.end.bind(conn));
      done();
    }
  });

  it('info.hasMinVersion before connect error', (done) => {
    const conn = base.createCallbackConnection();
    try {
      conn.info.hasMinVersion();
      done(new Error('Must have thrown exception'));
    } catch (err) {
      assert(err.message.includes('cannot know if server version until connection is established'));
      conn.connect(conn.end.bind(conn));
      done();
    }
  });

  it('info.hasMinVersion', () => {
    try {
      shareConn.info.hasMinVersion();
      throw new Error('Must have thrown exception');
    } catch (err) {
      assert(err.message.includes('a major version must be set'));
    }

    assert(shareConn.info.hasMinVersion(3));
    assert(shareConn.info.hasMinVersion(3, 4));
    assert(shareConn.info.hasMinVersion(3, 4, 10));
    assert(!shareConn.info.hasMinVersion(13));
    assert(!shareConn.info.hasMinVersion(13, 5));
    assert(!shareConn.info.hasMinVersion(13, 5, 20));
  });
});
