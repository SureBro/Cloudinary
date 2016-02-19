Package.describe({
  name: 'gaopai:cloudinary',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'This is the unofficial meteor package for Cloudinary',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  
  configure(api);

  api.export('Cloudinary');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('gaopai:cloudinary');
  
  configure(api);
});

function configure(api){
  api.addFiles('cloudinary.js');
  api.addFiles('lib/_init.js');
  api.addFiles('lib/utils.js');
}