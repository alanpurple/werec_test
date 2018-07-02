(function (global) {

    var packageNames = [
        'animations',
        'common',
        'compiler',
        'core',
        'forms',
        'http',
        'material',
        'platform-browser',
        'platform-browser-dynamic',
        'router'
    ];

    // map tells the System loader where to look for things
    var map = {
        'app': 'app', // 'dist',
        'rxjs': 'lib/rxjs',
        '@angular': 'lib/@angular'
    };

    packageNames.forEach(function (name) {
        map['@angular/' + name] = 'lib/@angular/' + name + '/bundles/' + name + '.umd.min.js';
        if (name != 'forms' && name != 'animations')
            map['@angular/' + name + '/testing']
                = 'lib/@angular/' + name + '/bundles/' + name + '-testing.umd.min.js';
    });
    map['@angular/cdk'] = 'lib/@angular/cdk/bundles/cdk.umd.js';
    var cdkModules = ['accordion','a11y', 'bidi', 'coercion', 'collections', 'keycodes','layout',
        'observers', 'overlay', 'platform', 'portal', 'rxjs', 'scrolling', 'table', 'stepper', 'text-field', 'tree'];
    var flexModules = ['core', 'flex', 'extended', 'server','grid'];

    cdkModules.forEach(function (name) {
        map['@angular/cdk/' + name] = 'lib/@angular/cdk/bundles/cdk-' + name + '.umd.min.js';
    });


    map['@angular/flex-layout'] = 'lib/@angular/flex-layout/bundles/flex-layout.umd.min.js';
    flexModules.forEach(function (name) {
        map['@angular/flex-layout/' + name] = 'lib/@angular/flex-layout/bundles/flex-layout-' + name + '.umd.min.js';
    });

    map['rxjs/operators'] = 'lib/rxjs/operators/index.js';

    map['@angular/animations/browser']
        = 'lib/@angular/animations/bundles/animations-browser.umd.min.js';
    map['@angular/animations/browser/testing']
        = 'lib/@angular/animations/bundles/animations-browser-testing.umd.min.js';

    map['@angular/platform-browser/animations']
        = 'lib/@angular/platform-browser/bundles/platform-browser-animations.umd.min.js';
    map['@angular/platform-browser/animations/testing']
        = 'lib/@angular/platform-browser/bundles/platform-browser-animations-testing.umd.min.js';

    map['@angular/common/http']
        = 'lib/@angular/common/bundles/common-http.umd.min.js';
    map['@angular/common/http/testing']
        = 'lib/@angular/common/bundles/common-http-testing.umd.js';

    map['@swimlane/ngx-charts'] = 'lib/ngx-charts/index.min.js';
    map['moment'] = 'lib/moment/moment.js';
    map['d3'] = 'lib/d3/d3.min.js';
    map['hammerjs'] = 'lib/hammerjs/hammer.min.js';
    map['tslib'] = 'lib/tslib/tslib.js';
    map['plotly.js'] = 'lib/plotly.js/plotly.min.js';
    map['elasticsearch'] = 'lib/elasticsearch-browser/elasticsearch.min.js';

    var d3Components = ['array', 'axis', 'brush', 'chord', 'collection', 'color', 'dispatch', 'drag',
        'dsv', 'ease', 'force', 'format', 'geo', 'hierarchy', 'interpolate', 'path', 'polygon', 'quadtree',
        'queue', 'random', 'request', 'scale', 'selection', 'shape', 'time', 'time-format', 'timer', 'transition',
        'voronoi', 'zoom'];

    // packages tells the System loader how to load when no filename and/or no extension
    var packages = {
        'app': { main: 'boot.js', defaultExtension: 'js' },
        'rxjs': { main:'index.js', defaultExtension: 'js' }
    };

    d3Components.forEach(function (component) {
        map['d3-' + component] = 'lib/d3/' + 'd3-' + component + '.min.js';
    });

    var config = {
        map: map,
        packages: packages,
        meta: {
            elasticsearch: {
                format: 'global',
                exports: 'elasticsearch'
            }
        }
    };

    // filterSystemConfig - index.html's chance to modify config before we register it.
    if (global.filterSystemConfig) { global.filterSystemConfig(config); }

    System.config(config);

})(this);