SmartClient.AppointmentListComponent = Ember.Component.extend({
  selectedDate: moment().format("YYYY-MM-DD"),
  forceToggle: true,

  appointments: function () {
    return this.get('store').find('appointment', {
      clinic_id: this.get('model').get('id'),
      date: this.get('selectedDate')
    });
  }.property('selectedDate', 'forceToggle'),

  actions: {
    dateForward: function() {
      var tomorrow = moment(this.get('selectedDate'), "YYYY-MM-DD").subtract(1, 'days').format('YYYY-MM-DD')
      this.set('selectedDate', tomorrow);
    },
    dateBackward: function() {
      var yesterday = moment(this.get('selectedDate'), "YYYY-MM-DD").add(1, 'days').format('YYYY-MM-DD')
      this.set('selectedDate', yesterday);
    },
    dateChosen: function (date) {
      this.set('selectedDate', date)
    },
    openBookingModal: function (time) {
      this.sendAction('openBookingModal', 'components/booking-modal', SmartClient.BookingModalComponent.create({
        store: this.get('store'),
        model: this.get('model'),
        aptComponent: this,
        selectedDate: this.get('selectedDate'),
        time: time,
        service_user: this.get('service_user')
      }));
    },
    closeBookModal: function () {
      this.sendAction('closeBookModal')
    }
  },

  announcements: function() {
    var announcements = this.get('model.announcements');

    if (announcements) {
      return announcements.filterBy('date', this.get('selectedDate'));
    }
  }.property('selectedDate', 'model.announcements.@each'),

  times: function () {
    var self = this,
        times = [],
        apts = this.get('appointments'),
        model = this.get('model');
        range = moment().range(
          moment(this.get('selectedDate') + "T" + model.get('opening_time')),
          moment(this.get('selectedDate') + "T" + model.get('closing_time'))
        );
        var interval = model.get('appointment_interval');

    range.by('minutes', function (mom) {
      if (mom.minute() % interval == 0 || mom.minute() == 0) {
        times.push(Ember.Object.create({
          time: mom.format("HH:mm")
        }));
      }
    });

    apts.forEach(function (apt) {
      times.forEach(function (time, index) {
        var cal_time = moment(self.get('selectedDate') + "T" + time.time),
            apt_time = moment(self.get('selectedDate') + "T" + apt.get('time'));

        if (cal_time.isSame(apt_time)) {
          apt.get('service_user').then(function () {
            times[index].set('service_user', apt.get('service_user'))
          })
          times[index].set('appointment', apt)
        }
      });
    });

    return times;
  }.property('appointments.@each'),

  next_weeks: function () {
    var collection = [],
        daysOn = [],
        days = this.get('model.days')

    for (var day in days) {
      var on = days[day]

      if (on) {
        daysOn.push(day)
      }
    }

    var current_date = moment().day(daysOn[0])

    for (var i = 0;i < 6;i++) {
      collection.push({
        weekName: i + 1,
        date: current_date.format("YYYY-MM-DD"),
        formattedDate: current_date.format("dddd, MMMM Do")
      });

      current_date = current_date.day(2 + 7)
    }

    return collection;
  }.property()
});
