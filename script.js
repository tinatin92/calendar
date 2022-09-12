const clndrRender = (data) => `
<div class="full-calendar">
    <div class="calendar">
        <div class="calendar-header">
            <h3 class="calendar-title">${data.month} ${data.year}</h3>
            <button class="next-month-button"><i class="icon icon-chevron-right"></i></button>
            <button class="previous-month-button"><i class="icon icon-chevron-left"></i></button>
        </div>
        <div class="calendar-content">
            <div class="calendar-week-header">
            ${data.daysOfTheWeek
              .map(
                (dayOfWeek, index) =>
                  `<div class="calendar-week-day"><span>${dayOfWeek}</span></div>`
              )
              .join("")}
            </div>
            <div class="calendar-month">
            ${[...Array(data.numberOfRows).keys()]
              .map((week) => {
                const weekDays = data.days.slice(7 * week, 7 * week + 7);
                return `<div class="calendar-week">${weekDays
                  .map((day, index) => {
                    let classes = [];
                    let url = "";
                    if (day.properties.isAdjacentMonth) {
                      classes.push("secondary");
                    }
                    if (day.properties.isToday) {
                      classes.push("current");
                 
                    }
                    if (day.events.length) {
                      url = day.events[0].url;
                      classes.push("event");
                    }
                    if (url) {
                      return `<div class="calendar-day ${classes.join(" ")} ${
                        day.classes
                      }" ><div><span>${day.day}</span></div></div>`;
                    }
                    return `<div class="calendar-day ${classes.join(" ")} ${
                      day.classes
                    }"><div><span>${day.day}</span></div></div>`;
                  })
                  .join("")}</div>`;
              })
              .join("")}
            </div>
        </div>
        <div class="calendar-footer"></div>
    </div>
    <div class="calendar-events-container">
        <div class="calendar-events">
            <div class="event-header">
            <div class="calendar-img"> <img src="styles/images/Calendar.png" alt=""> </div>
            <div class="calendar-date"> <div class="event-date"> </div>
            
           
            
            </div>
            <div class="event-year">
            2022
            </div>
            </div>
            <div class="event-body">
            <div class="event-title">
        
            </div>
            <div class="event-description">
        
            </div>
            <a class="event-link">
            Event Details
            </a></div>    
        </div>
    </div>
<div>
`;


moment.locale("en");
$("#calendar").each((index, element) => {
  const calendar = $(element).clndr({
    // the template: this could be stored in markup as a <script type="text/template"&rt;</script&rt;
    // or pulled in as a string
    //template: clndrTemplate,
    // start the week off on Sunday (0), Monday (1), etc. Sunday is the default.
    weekOffset: 0,
    // determines which month to start with using either a date string or a moment object.
    startWithMonth: moment(),
    // an array of day abbreviations. If you have moment.js set to a different language,
    // it will guess these for you! If for some reason that doesn't work, use this...
    // the array MUST start with Sunday (use in conjunction with weekOffset to change the starting day to Monday)
    daysOfTheWeek: moment.weekdaysMin(true),
    // callbacks!
    clickEvents: {
      // fired whenever a calendar box is clicked.
      // returns a 'target' object containing the DOM element, any events, and the date as a moment.js object.
      click: function (target) {
        const $events = $(element).find(".calendar-events");
        if (target.events.length) {
          $events.show();
          $events.find(".event-date").html(target.date.format("MMM D"));
          $events.find(".event-year").html(target.date.format("Y"));
          $events.find(".event-title").html(target.events[0].title);
          $events
            .find(".event-description")
            .html(target.events[0].description);
          $events.find(".event-link").prop("href", target.events[0].url);
        } else {
          $events.hide();
        }
      },
      // fired when a user goes forward a month. returns a moment.js object set to the correct month.
      nextMonth: function (month) {},
      // fired when a user goes back a month. returns a moment.js object set to the correct month.
      previousMonth: function (month) {},
      // fired when a user goes back OR forward a month. returns a moment.js object set to the correct month.
      onMonthChange: function (month) {
        const $events = $(element).find(".calendar-events");
        $events.hide();
        if (!this.eventsThisInterval.length) {
          const url = $(this.calendarContainer[0]).parent().data("url");
          const calendar = this;
          $.ajax({
            dataType: "json",
            url,
            //   headers: {
            //     RequestVerificationToken: REQUEST_VERIFICATION_TOKEN,
            //   },
            data: {
              month: month.month(),
              year: month.year(),
            },
            success: function (response) {
              // add the new events to clndr.
              // this will call `render` for us.
              calendar.addEvents(response);
            },
          });
        }
      },
      // fired when a user goes to the current month/year. returns a moment.js object set to the correct month.
      today: function (month) {
        console.log("today");
      },
    },
    // the target classnames that CLNDR will look for to bind events. these are the defaults.
    targets: {
      nextButton: "next-month-button",
      previousButton: "previous-month-button",
    },
    // an array of event objects
    events: [],
    // if you're supplying an events array, dateParameter points to the field in your event object containing a date string. It's set to 'date' by default.
    dateParameter: "date",
    // show the numbers of days in months adjacent to the current month (and populate them with their events). defaults to true.
    showAdjacentMonths: true,
    // when days from adjacent months are clicked, switch the current month.
    // fires nextMonth/previousMonth/onMonthChange click callbacks. defaults to false.
    adjacentDaysChangeMonth: false,
    // a callback when the calendar is done rendering. This is a good place to bind custom event handlers.
    doneRendering: function () {},
    // anything you want access to in your template
    extras: {},
    // if you want to use a different templating language, here's your ticket.
    // Precompile your template (before you call clndr), pass the data from the render function
    // into your template, and return the result. The result must be a string containing valid markup.
    // More under 'Template Rendering Engine' below.
    render: function (data) {
      return clndrRender(data);
    },
  });
  $.ajax({
    dataType: "json",
    url: $(element).data("url"),
    //   headers: { RequestVerificationToken: REQUEST_VERIFICATION_TOKEN },
    data: {
      month: moment().month(),
      year: moment().year(),
    },
    success: function (response) {
      // add the new events to clndr.
      // this will call `render` for us.
      calendar.addEvents(response);
      element.find(".today").click();
    },
  });

  const response = [
    {
      date: "2022-08-01",
      title:
        "The greenhouse helps to create a sustainable environment in post-war Georgia sustainable environment, we promote and democratic",
      description:
        "On behalf of the American people, we promote and demonstrate democratic values abroad, and advance a free, peaceful, and prosperous world. In supportof America’s foreign policy, the U.S. Agency for International Developmentleads the U.S. Government’s international development and disaster assistance through partnerships and investments that save lives, reduce poverty,we promote and demonstrate democratic values abroad, and advance a free, peaceful, and prosperous world. In supportof America’s foreign policy, the U.S. Agency for International Developmentleads the U.S. Government’s international development and disaster assistance through partnerships and investments that save lives, reduce poverty,  promote and demonstrate democratic values abroad, and advance a free, peaceful, and prosperous world. In supportof America’s foreign policy, the U.S. Agency for International Developmentleads the U.S. Government’s international development and disaster assistance through partnerships and investments that save lives, reduce poverty,we promote and demonstrate democratic values abroad, and advance a free, peaceful, and prosperous world. In supportof America’s foreign policy, the U.S. Agency for International Developmentleads the U.S. Government’s international development and disaster assistance through partnerships and investments that save lives, reduce poverty,  ",
      url: "http://github.com/kylestetz/CLNDR",
    },
  
    {
      date: "2022-08-24",
      title:
        "The greenhouse helps to create a sustainable environment in post-war Georgia sustainable environment, we promote and democratic",
      description:
        "ocratic vestm ouse helps to create a sustainable environment in post-war Georgia sustain"
    },
    {
      date: "2022-09-02",
      title:
        "The greenhouse helps to create a sustainable environment in post-war Georgia sustainable environment, we promote and democratic",
      description:"",
      url: "http://github.com/kylestetz/CLNDR",
    }
  ];
  calendar.addEvents(response);
  $(element).find(".today").click();
});
});