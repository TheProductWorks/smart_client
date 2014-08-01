SmartClient.ApplicationAdapter = DS.ActiveModelAdapter.extend({
  host: 'http://127.0.0.1:5000',
  auth_token: null,
  headers: function() {
    return {
      "AUTH_TOKEN": this.get('auth_token'),
    };
  }.property()
});
