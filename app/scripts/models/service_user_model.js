SmartClient.ServiceUser = DS.Model.extend({
  hospital_number: DS.attr(),
  personal_fields: DS.attr(),
  clinical_fields: DS.attr(),
  gestation: DS.attr(),
  pregnancies: DS.hasMany('pregnancy'),
  babies: DS.hasMany('baby'),
  appointments: DS.hasMany('appointment'),

  age: function () {
    return moment().diff(this.get('personal_fields.dob'), 'years');
  }.property(),

  current_pregnancy: function () {
    return this.get('pregnancies').sortBy('created_at').get('firstObject')
  }.property()
});
