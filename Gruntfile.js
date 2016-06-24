module.exports = function(grunt) {

    grunt.initConfig({

	surge: {
	    'choo-sortable': {
		options: {
		    // The path or directory to your compiled project
		    project: 'build/',
		    // The domain or subdomain to deploy to
		    domain: 'dysfunctional-industry.surge.sh'
		}
	    }
	}
    });

    // Load in the grunt-surge plugin
    grunt.loadNpmTasks('grunt-surge');

    grunt.registerTask('build', ['browserify sortable.js > build/sortable.js; cp -f sortable.css sortable.html build']);
    // Add a `grunt deploy` task that runs Surge
    grunt.registerTask('deploy', ['surge']);
};

