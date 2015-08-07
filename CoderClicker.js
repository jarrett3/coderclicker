if (Meteor.isClient) {
  Meteor.subscribe('userData');

  Accounts.ui.config ({
    passwordSignupFields: 'USERNAME_ONLY'
  });

  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    },

    user: function () {
      return Meteor.user();
    },

    items: function () {
      return [{name: "Monkey", cost: 500}];
    },

    players: function () {
      return Meteor.users.find({}, {sort: {'money': -1}});
    }
  });

  Template.hello.events({
    'click input.code': function () {
      Meteor.call('click');
    },

    'click input.buy': function (event) {
      Meteor.call('buy', event.target.id);
    }
  });
}

if (Meteor.isServer) {

  Meteor.publish("userData", function () {
    return Meteor.users.find({}, {sort: {'money': -1}});
  });
  
  Accounts.onCreateUser(function (options, user) {
    user.money = 0;
    user.rate = 0;
    return user;
  });

  Meteor.startup(function () {
    // code to run on server at startup
    Meteor.setInterval(function () {
      Meteor.users.find({}).map(function (user) {
        Meteor.users.update({_id: user._id}, {$inc: {'money': user.rate}})
      });
    }, 1000)
  });
}

Meteor.methods({
  click: function () {
    Meteor.users.update({_id: this.userId}, {$inc: {'money': 25}});
  },

  buy: function (amount) {
    if (Meteor.user().money >= amount && amount > 0) {
      Meteor.users.update({_id: this.userId}, {$inc: {'rate': (Math.floor(amount/500)), 'money': (-amount)}});
    }
  },
})