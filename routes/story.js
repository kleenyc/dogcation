var express       = require('express');
var multer        = require('multer');
var sharp         = require('sharp');
var models        = require('../models/index');
var Post          = models.post;
var Comment       = models.comment;
var uploadHandler = multer();
var aws           = require('aws-sdk');
var s3 = new aws.S3({region:'us-east-2'});
var router        = express.Router();

// Index.
router.get('/', function(request, response) {
	Post.findAll().then(function(posts) {
		response.render('story/index', {
			posts: posts
		});
	});
});

// Search.
router.get('/search', function(request, response) {
	var query     = request.query.query;
	var condition = `%${query}%`;

	Post.findAndCountAll({
		where: {
			$or: {
				title: {
					$iLike: condition
				},
				body: {
					$iLike: condition
				}
			}
		}
	}).then(function(result) {
		response.render('story/search', {
			query: query,
			count: result.count,
			posts: result.rows
		});
	});
});

// New.
router.get('/new', function(request, response) {
	response.render('story/new', {
		post: {
			title: '',

		}
	});
});

// Create.
router.post('/', uploadHandler.single('image'), function(request, response) {
	Post.create({
		title:         request.body.title,
		body:          request.body.body,
		author:        request.body.author,
		link:          request.body.link,
//		imageFilename: (request.file && request.file.filename)
	}).then(function(post) {
		console.log('>>>>>>>>>>>>>>>>', request.file.buffer)
		sharp(request.file.buffer)
		.resize(400, 400)
//		.max()
//		.withoutEnlargement()
		.toBuffer()
		.then(function(thumbnail) {
			s3.upload({
				Bucket: 	'dogcation',
				Key: 		`posts/${post.id}`,
				Body: 		 request.file.buffer,
				ACL: 		'public-read',
				ContentType: request.file.mimetype
			}, function(error, data) {
				console.log("===========", error)
				JSON.stringify(post);
				s3.upload({
					Bucket:     'dogcation',
					Key:        `posts/${post.id}-thumbnail`,
					Body:        thumbnail,
					ACL:        'public-read',
					ContentType: request.file.mimetype
				}, function(error, data) {
					console.log('data>>>>>>>>',data)
					response.redirect(post.url);
				});
			});
		});
	}).catch(function(error) {
		console.log("=====c0reate======", error)
		response.render('story/new', {
			post:   request.body,
			errors: error.errors
		});
	});
});

// Show.
router.get('/:title', function(request, response) {
	Post.findOne({where: {title: request.params.title}}).then(function(post) {
		Comment.findAll({where: {postId: post.id}}).then(function(comments){
			// var postWithComments = Object.assign({}, post, {
			// 	comments: comments
			// })
			response.render('story/show',{
				post: post, 
				comments: comments
			})
		})
		// response.json(post)
		// response.render('story/show', {
		// 	post:     post,
		// 	comment:  {}
		// });
	});
});

// Comments.
router.post('/:title/comments', function(request, response) {
	Post.findOne({where: {title: request.params.title}}).then(function(post) {
		console.log('----------')
		console.log(post.id)
		console.log('----------')
		Comment.create({
			body:   request.body.body,
			author: request.body.author,
			postId: post.id
		}).then(function(comment) {
			response.redirect(post.url);
		}).catch(function(error) {
			console.log(error)
			response.render('story/show', {
				post:    post,
				comment: request.body,
				errors:  error.errors
			});
		});
	});
});

module.exports = router;

