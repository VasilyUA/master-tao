'use strict';
// Определим необходимые инструменты
import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import mqpacker from 'css-mqpacker';
import replace from 'gulp-replace';
import { deleteAsync as del } from 'del';
import browserSync from 'browser-sync';
import ghPages from 'gulp-gh-pages';
import newer from 'gulp-newer';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import notify from 'gulp-notify';
import plumber from 'gulp-plumber';
import cleanCSS from 'gulp-cleancss';
import include from 'gulp-file-include'; //inclue
import htmlbeautify from 'gulp-html-beautify';

const dirs = {
	source: 'src', // папка с исходниками (путь от корня проекта)
	build: 'build', // папка с результатом работы (путь от корня проекта)
};

const sass = gulpSass(dartSass);

// ЗАДАЧА: Компиляция препроцессора
gulp.task('sass', function () {
	return gulp
		.src(dirs.source + '/sass/style.scss') // какой файл компилировать (путь из константы)
		.pipe(include())
		.pipe(plumber({ errorHandler: onError }))
		.pipe(sourcemaps.init()) // инициируем карту кода
		.pipe(sass()) // компилируем
		.pipe(
			postcss([
				// делаем постпроцессинг
				autoprefixer({
					overrideBrowserslist: ['last 2 version', 'last 7 Chrome versions', 'last 10 Opera versions', 'last 7 Firefox versions'],
				}), // автопрефиксирование
				mqpacker({ sort: true }), // объединение медиавыражений
			]),
		)
		.pipe(sourcemaps.write('/')) // записываем карту кода как отдельный файл (путь из константы)
		.pipe(gulp.dest(dirs.build + '/css/')) // записываем CSS-файл (путь из константы)
		.pipe(browserSync.stream())
		.pipe(rename('style.min.css')) // переименовываем
		.pipe(cleanCSS()) // сжимаем
		.pipe(gulp.dest(dirs.build + '/css/')); // записываем CSS-файл (путь из константы)
});

// ЗАДАЧА: Сборка HTML
gulp.task('html', function () {
	return gulp
		.src(dirs.source + '/*.html') // какие файлы обрабатывать (путь из константы, маска имени)
		.pipe(include())
		.pipe(htmlbeautify())
		.pipe(plumber({ errorHandler: onError }))
		.pipe(replace(/\n\s*<!--DEV[\s\S]+?-->/gm, '')) // убираем комментарии <!--DEV ... -->
		.pipe(gulp.dest(dirs.build)); // записываем файлы (путь из константы)
});

// ЗАДАЧА: Копирование изображений
gulp.task('img', function () {
	return gulp
		.src(
			[
				dirs.source + '/img/**/*.{gif,png,jpg,jpeg,svg}', // какие файлы обрабатывать (путь из константы, маска имени, много расширений)
			],
			{ since: gulp.lastRun('img') }, // оставим в потоке обработки только изменившиеся от последнего запуска задачи (в этой сессии) файлы
		)
		.pipe(plumber({ errorHandler: onError }))
		.pipe(newer(dirs.build + '/img')) // оставить в потоке только новые файлы (сравниваем с содержимым папки билда)
		.pipe(gulp.dest(dirs.build + '/img')); // записываем файлы (путь из константы)
});

// ЗАДАЧА: Очистка папки сборки
gulp.task('clean', function () {
	return del([
		// стираем
		dirs.build + '/**/*', // все файлы из папки сборки (путь из константы)
		'!' + dirs.build + '/readme.md', // кроме readme.md (путь из константы)
	]);
});

// ЗАДАЧА: Конкатенация и углификация Javascript
gulp.task('js', function () {
	return gulp
		.src([
			// список обрабатываемых файлов в нужной последовательности (Запятая после каждого файла, в конце запятая не нужна)
			dirs.source + '/js/script.js',
		])
		.pipe(
			include({
				prefix: '~',
			}),
		) //Прогоним через include-file
		.pipe(plumber({ errorHandler: onError }))
		.pipe(concat('script.js'))
		.pipe(gulp.dest(dirs.build + '/js'))
		.pipe(rename('script-min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(dirs.build + '/js'))
		.pipe(browserSync.stream());
});

// ЗАДАЧА: Перемещение шрифтов
gulp.task('copy', function () {
	return gulp.src(dirs.source + '/fonts/**/*.{woff,woff2}').pipe(gulp.dest('build' + '/fonts'));
});

// ЗАДАЧА: сборка сss-библиотек
gulp.task('copy-css', function () {
	return gulp.src(dirs.source + '/css/blueimp-gallery.min.css').pipe(gulp.dest('build' + '/css'));
});

// ЗАДАЧА: Сборка всего
gulp.task(
	'build',
	gulp.series(
		// последовательно:
		'clean', // последовательно: очистку папки сборки
		// "svgstore",
		// "png:sprite",
		gulp.parallel('sass', 'img', 'js', 'copy'),
		'html',
		// последовательно: сборку разметки
	),
);

// ЗАДАЧА: Локальный сервер, слежение
gulp.task(
	'serve',
	gulp.series('build', function () {
		browserSync.init({
			// запускаем локальный сервер (показ, автообновление, синхронизацию)
			//server: dirs.build,                                     // папка, которая будет «корнем» сервера (путь из константы)
			server: {
				baseDir: './build/',
			},
			port: 3000, // порт, на котором будет работать сервер
			startPath: 'home.html', // файл, который буде открываться в браузере при старте сервера
			// open: false                                          // возможно, каждый раз стартовать сервер не нужно...
		});

		gulp.watch(
			// следим за HTML
			[
				dirs.source + '/**/*.html', // в папке с исходниками
			],
			gulp.series('html', reloader), // при изменении файлов запускаем пересборку HTML и обновление в браузере
		);

		gulp.watch(
			// следим
			dirs.source + '/sass/**/*.scss',
			gulp.series('sass', reloader), // при изменении запускаем компиляцию (обновление браузера — в задаче компиляции)
		);

		gulp.watch(
			// следим за SVG
			dirs.source + '/img/svg-sprite/*.svg',
			// gulp.series("svgstore", "html", reloader)
			gulp.series('html', reloader),
		);

		gulp.watch(
			dirs.source + '/img/png-sprite/*.png',
			// gulp.series("png:sprite", "sass")
			gulp.series('sass'),
		);

		gulp.watch(
			// следим за изображениями
			dirs.source + '/img/*.{gif,png,jpg,jpeg,svg}',
			gulp.series('img', reloader), // при изменении оптимизируем, копируем и обновляем в браузере
		);

		gulp.watch(
			// следим за JS
			dirs.source + '/js/**/*.js',
			gulp.series('js'), // при изменении пересобираем и обновляем в браузере
		);
	}),
);

// ЗАДАЧА, ВЫПОЛНЯЕМАЯ ТОЛЬКО ВРУЧНУЮ: Отправка в GH pages (ветку gh-pages репозитория)
gulp.task('deploy', function () {
	return gulp.src('./build/**/*').pipe(ghPages());
});

// ЗАДАЧА: Задача по умолчанию
gulp.task('default', gulp.series('serve'));

// Дополнительная функция для перезагрузки в браузере
function reloader(done) {
	browserSync.reload();
	done();
}

const onError = function (err) {
	notify.onError({
		title: 'Error in ' + err.plugin,
	})(err);
	this.emit('end');
};
