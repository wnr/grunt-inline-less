'use strict';

var Tree = require('../tasks/lib/tree.js');
var grunt = require('grunt');

exports.tree_test = {
  constructor: function(test) {
    var filename = 'test/less/import/urls.less';
    var tree = new Tree(filename, grunt);

    test.equals(tree.filename, filename, 'Filename should be right.');
    test.equals(tree.dir, 'test/less/import/', 'Directury should be right.');
    test.equals(tree.content, '// empty file showing that it loads from the relative path first\n', 'Content should be read.');
    test.equals(tree.nodes.length, 0, 'Tree should have no nodes.');

    test.done();
  },
  parseImports: function(test) {
    var filename = 'test/less/import-syntax.less';
    var tree = new Tree(filename, grunt, false);

    var result = tree.parseImports(tree.content);

    var expected = [
      {
        filename: 'import/urls.less',
        statement: '@import "import/urls.less";',
        type: 'less'
      },
      {
        filename: 'import/import-test-e.less',
        statement: '@import \t \t \t"import/import-test-e.less";',
        type: 'less'
      },
      {
        filename: 'import/import-test-d.css',
        statement: '@import "import/import-test-d.css";',
        type: 'css'
      },
      {
        filename: 'import/import-test-d.css',
        statement: '@import (less) "import/import-test-d.css";',
        type: 'less'
      },
      {
        filename: 'import/import-test-c.less',
        statement: '@import "import/import-test-c.less" screen and (max-width: 400px);',
        type: 'less'
      },
      {
        filename: 'import/import-test-d.css',
        statement: '@import (less) "import/import-test-d.css" screen and (max-width: 400px);',
        type: 'less'
      },
      {
        filename: 'import/urls.less',
        statement: '@import"import/urls.less";',
        type: 'less'
      },
      {
        filename: 'import/urls.less',
        statement: '@import (css) "import/urls.less";',
        type: 'css'
      },
      {
        filename: 'import/urls.less',
        statement: '@import \'import/urls.less\';',
        type: 'less'
      },
      {
        filename: 'import/urls.less',
        statement: '@import "import/urls";',
        type: 'less'
      },
      {
        filename: 'import/urls',
        statement: '@import (css) "import/urls";',
        type: 'css'
      }
    ];

    test.equals(result.length, 11, 'Should find all imports in file.');

    test.deepEqual(result, expected, 'Should have parsed all imports and with right statements.');

    test.done();
  },
  build: function(test) {
    var filename = 'test/less/import-syntax.less';
    var tree = new Tree(filename, grunt);

    test.equal(tree.nodes.length, 11, 'Should have created nodes for all imports.');

    test.done();
  }
};