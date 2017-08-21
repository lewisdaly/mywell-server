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

  gulp.src(['www/**/*.js'])
    .pipe(replace('VERSION_NUMBER', process.env.VERSION_NUMBER))
    .pipe(replace('REACT_APP_GRAPHQL_ENDPOINT', process.env.REACT_APP_GRAPHQL_ENDPOINT))
    .pipe(replace('SERVER_URL', process.env.SERVER_URL))
    .pipe(gulp.dest('www'));
});
