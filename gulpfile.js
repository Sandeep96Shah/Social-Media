const gulp = require("gulp");

//converting the scss into css
const sass = require("gulp-sass")(require("sass"));

//for compressing 
const cssnano = require("gulp-cssnano");

//for passing the file to the browser whenever it refreshes
const rev = require("gulp-rev");
//compressing the js file
const uglify = require('gulp-uglify-es').default;
//compressing the images file of different types
const imagemin = require('gulp-imagemin');
//prevent deleting the current directory and also to delete the directory
const del = require('del');


//task to be done
//note ** means any folder or subfolder 
//*.css means any css file 
gulp.task("css", function () {
  console.log("minifying css...h");
  gulp
    .src("./assets/sass/**/*.scss")
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest("./assets.css"));

    //changing the naming convention whenever it is send to browser
    //in production 
  return gulp
    .src("./assets/**/*.css")
    .pipe(rev())
    .pipe(gulp.dest("./public/assets"))
    .pipe(
      rev.manifest({
        cwd: "public",
        merge: true,
      })
    )
    .pipe(gulp.dest("./public/assets"));
});

gulp.task('js', function(done){
    console.log('minifying js...');
     gulp.src('./assets/**/*.js')
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done()
});

gulp.task('images', function(done){
    console.log('compressing images...');
    gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg)')
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});

// empty the public/assets directory
gulp.task('clean:assets', function(done){
    del.sync('./public/assets');
    done();
});

gulp.task('build', gulp.series('clean:assets', 'css', 'js', 'images'), function(done){
    console.log('Building assets');
    done();
});


