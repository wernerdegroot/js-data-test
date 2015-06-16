var MyController = function ($q, Comment, CommentBody) {
	
	var self = this;	
	
	//CommentBody.findAll({ commentId: 1});
	
	Comment.findAll().then(function (comments) {
		return $q.all(comments.map(function (comment) {
			return Comment.loadRelations(comment, ['posts', 'comment-bodies']);
		}));
	}).then(function (comments) {
		//self.comments = comments;
		console.log(comments);
	});
};

angular.module('myApp', ['js-data'])

	.controller('MyController', MyController)
	
	.config(function (DSProvider) {
		DSProvider.defaults.basePath = '/';
	})
	
	.run(function (DS) {
		// DS is the result of `new JSData.DS()`
		
		// We don't register the "User" resource
		// as a service, so it can only be used
		// via DS.<method>('user', ...)
		// The advantage here is that this code
		// is guaranteed to be executed, and you
		// only ever have to inject "DS"
		DS.defineResource('user');
	})

	.factory('Comment', function (DS, Post) {
		return DS.defineResource({
			name: 'comments',
			relations: {
				belongsTo: {
					posts: {
						localField: 'post',
						localKey: 'postId'
					}
				},
				hasMany: {
					'comment-bodies': {
						localField: 'commentBodies',
						foreignKey: 'commentId'
					}
				}
			}	
		});
	})
	
	.factory('Post', function (DS) {
		return DS.defineResource('posts');
	})
	
	.factory('CommentBody', function (DS) {
		return DS.defineResource({
			name: 'comment-bodies',
			relations: {
				belongsTo: {
					comments: {
						localField: 'comment',
						localKey: 'commentId',
						parent: true
					}
				}
			}
		});
	});

