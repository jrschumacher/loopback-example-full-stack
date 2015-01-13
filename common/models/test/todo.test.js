'use strict';

var lt = require('loopback-testing');
var assert = require('assert');
var app = require('../../../server/server.js'); //path to app.js or server.js

describe('Todo', function() {
  lt.beforeEach.withApp(app);
  lt.beforeEach.givenModel('Todo');

  // New todo
  lt.describe.whenCalledRemotely('POST', '/api/Todos', data, function() {
    lt.it.shouldBeAllowed();
    it('should have statusCode 200', function() {
      assert.equal(this.res.statusCode, 200);
    });

    it('should respond with a new todo', function() {
      assert(this.res.body.id.match(/t-\d+/));
    });
  });

  // New todo with id
  lt.describe.whenCalledRemotely('POST', '/api/Todos', {
    id: '123',
    title: 'Sample',
    completed: true,
    created: 1024
  }, function() {

    it('should respond with given todo', function() {
      assert.equal(this.res.body.id, 123);
      assert.equal(this.res.body.title, 'Sample');
      assert.equal(this.res.body.completed, true);
      assert.equal(this.res.body.created, 1024);
    });

    // Find todo in the list of todos
    lt.describe.whenCalledRemotely('GET', '/api/Todos', function() {
      it('should contain the todo', function() {

        var found = false;
        this.res.body.forEach(function(todo) {
          if(todo.id === '123') found = true;
        });

        assert(found);
      });
    });

    // Get the specific todo
    lt.describe.whenCalledRemotely('GET', '/api/Todos/123', function() {
      it('should respond with the todo', function() {
        assert.equal(typeof this.res.body, 'object');
        assert.equal(this.res.body.id, 123);
      });
    });

    // Delete the created todo
    lt.describe.whenCalledRemotely('DELETE', '/api/Todos/123', function() {
      it('should respond with status 204', function() {
        assert.equal(this.res.statusCode, 204);
      });

      // Try to find it -- should return not found
      lt.describe.whenCalledRemotely('GET', '/api/Todos/123', function() {
        it('should respond with status 404', function() {
          assert.equal(this.res.statusCode, 404);
        });
      });
    });
  });

});
