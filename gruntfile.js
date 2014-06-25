module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // Set up configuration options
        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'style.css': 'style.scss'
                }
            }
        },

        watch: {
			  stylesheets: {
			    files: ['*.scss'],
			    tasks: ['sass'],
			  }
        }
    });

    // Load the task plugins
    grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.loadNpmTasks('grunt-contrib-watch');

    // Define Tasks.
    grunt.registerTask('default', ['watch']);

};