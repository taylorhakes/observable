module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist: {
				files: {
					'dist/<%= pkg.name %>.min.js': ['<%= pkg.name %>.js']
				}
			}
		},
		jshint: {
			files: ['Gruntfile.js', '<%= pkg.name %>.js', 'test/**/*.js'],
			options: {
				// options here to override JSHint defaults
				globals: {
					module: true
				}
			}
		},
		watch: {
			files: ['<%= jshint.files %>'],
			tasks: ['jshint', 'karma']
		},
		karma: {
			options: {
				configFile: 'karma.conf.js',
				browsers: ['PhantomJS'],
				singleRun: true,
				autoWatch: false
			}
		}
	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('test', ['karma']);

	grunt.registerTask('default', ['jshint', 'karma', 'watch']);

};