var Posts = new Mongo.Collection('posts');
var Authors = new Mongo.Collection('authors');
if (Meteor.isServer) {
    Meteor.publish('posts', function () {
        this.autorun(function (computation) {
            var author = Authors.findOne({userId: this.userId});
            console.log(author._id);
            console.log(Posts.find({}).fetch());
            return Posts.find({authorId: author._id});
        });
    });
}
if (Meteor.isClient) {
    FlowRouter.route('/', {
        action: function(params, queryParams) {
            BlazeLayout.render('create');
        }
    });
    FlowRouter.route('/posts', {
        action: function(params, queryParams) {
            BlazeLayout.render('posts');
        }
    });
    Meteor.subscribe('posts');
    Template.create.onCreated(function() {
       this.authorId = new ReactiveVar(null);
    });
    Template.posts.helpers({
       posts: function(){
           return Posts.find({});
       }
    });
    Template.create.helpers({
        authorId: function() {
            return Template.instance().authorId.get();
        }
    })
    Template.create.events({
       'submit #authorForm': function(event, instance) {
           event.preventDefault();
           var author = event.target.author.value;
           instance.authorId.set(Authors.insert({
              userId: Meteor.userId(),
               author: author
           }));

       },
        'submit #postForm': function(event, instance) {
            event.preventDefault();
            var post = event.target.post.value;
            Posts.insert({
               authorId: instance.authorId.get(),
                post: post
            });
        }
    });
}
