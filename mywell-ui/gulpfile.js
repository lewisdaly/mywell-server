const replace = require('gulp-replace');
const gulp = require('gulp');



/**
 * This postProcess task lets us to run webpack soley in the docker build step
 * Accordingly, we can then remove all of the unneeded source files from the docker image
 */
gulp.task('postProcess', function() {
  console.log('VERSION_NUMBER:', process.env.VERSION_NUMBER);
  console.log('REACT_APP_GRAPHQL_ENDPOINT:', process.env.REACT_APP_GRAPHQL_ENDPOINT);
  console.log('SERVER_URL:', process.env.SERVER_URL);

  console.log('REACT_APP_FB_API_KEY:', process.env.REACT_APP_FB_API_KEY);
  console.log('REACT_APP_FB_AUTH_DOMAIN:', process.env.REACT_APP_FB_AUTH_DOMAIN);
  console.log('REACT_APP_FB_DATABASE_URL:', process.env.REACT_APP_FB_DATABASE_URL);
  console.log('REACT_APP_FB_PROJECT_ID:', process.env.REACT_APP_FB_PROJECT_ID);
  console.log('REACT_APP_FB_STORAGE_BUCKET:', process.env.REACT_APP_FB_STORAGE_BUCKET);

  gulp.src(['www/**/*.js'])
    .pipe(replace('VERSION_NUMBER', process.env.VERSION_NUMBER))
    .pipe(replace('REACT_APP_GRAPHQL_ENDPOINT', process.env.REACT_APP_GRAPHQL_ENDPOINT))
    .pipe(replace('SERVER_URL', process.env.SERVER_URL))
    .pipe(replace('REACT_APP_FB_API_KEY', process.env.REACT_APP_FB_API_KEY))
    .pipe(replace('REACT_APP_FB_AUTH_DOMAIN', process.env.REACT_APP_FB_AUTH_DOMAIN))
    .pipe(replace('REACT_APP_FB_DATABASE_URL', process.env.REACT_APP_FB_DATABASE_URL))
    .pipe(replace('REACT_APP_FB_PROJECT_ID', process.env.REACT_APP_FB_PROJECT_ID))
    .pipe(replace('REACT_APP_FB_STORAGE_BUCKET', process.env.REACT_APP_FB_STORAGE_BUCKET))

    .pipe(gulp.dest('www'));
});
