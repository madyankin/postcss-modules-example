import gulp         from 'gulp';
import postcss      from 'gulp-postcss';
import modules      from 'postcss-modules';
import autoprefixer from 'autoprefixer';
import ejs          from 'gulp-ejs';
import path         from 'path';
import fs           from 'fs';


function getJSONFromCssModules(cssFileName, json) {
  const cssName       = path.basename(cssFileName, '.css');
  const jsonFileName  = path.resolve('./build', `${ cssName }.json`);
  fs.writeFileSync(jsonFileName, JSON.stringify(json));
}

function getClass(module, className) {
  const moduleFileName  = path.resolve('./build', `${ module }.json`);
  const classNames      = fs.readFileSync(moduleFileName).toString();
  return JSON.parse(classNames)[className];
}

gulp.task('css', () => {
  return gulp.src('./css/styles.css')
    .pipe(postcss([
      autoprefixer,
      modules({ getJSON: getJSONFromCssModules }),
    ]))
    .pipe(gulp.dest('./build'));
});


gulp.task('html', gulp.series('css', () => {
  return gulp.src('./html/index.ejs')
    .pipe(ejs({ className: getClass }, { ext: '.html' }))
    .pipe(gulp.dest('./build'));
}));


gulp.task('default', gulp.series('html'));
