SmartClient.ServiceOptionRoute = SmartClient.AuthenticatedRoute.extend({
  model: function (params) {
    sos = this.modelFor('service_options');
    return sos.findBy('id', params.service_option_id);
  }
});