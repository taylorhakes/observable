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
		karma: {
			main: {
				options: {
					configFile: 'karma.conf.js',
					singleRun: true,
					autoWatch: false
				}
			},
			watch: {
				options: {
					configFile: 'karma.conf.js'
				}
			}
		}
	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('test', ['karma:main']);
	grunt.registerTask('build', ['karma:main', 'uglify'])
	grunt.registerTask('default', ['karma:watch']);

};