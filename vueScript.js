populateCalendar()
import { scheduleType, formattedJSON, translateWithInsert, translate, eventsJSON, languageJSON } from "./scheduleFormatting.js";
import { settings, settingsMenu } from "./settings.js";

//stores the user preference for how they display time
var timeFormat = (settings.twentyFourHour ? "HH" : "h") + ":mm" + (settings.showAMPM ? " A" : "");
var currentPage = "now";

function switchToNowPage() {
  this.currentPage = "now";
}
function switchToCalendarPage() {
  this.currentPage = "calendar";
}
function switchToSettingsPage() {
  this.currentPage = "settings";
}



var currentPeriod = null;
var periodList = formattedJSON.map((p) => {
  return PeriodComponent(p.name, p.start, p.end, p.passing);
});
periodList.forEach((p) => {
        if(p.isCurrent()) {
          currentPeriod = p;
        }});

PetiteVue.createApp({
  //Components
  PeriodInformationComponent,

  //All Pages
  currentPage,

  //Now Page
  periodList,
  todaysGreeting: "",
  listCount: 0,
  getListCount() {
    this.listCount++;
    return this.listCount % 2 == 0;
  },
  currentPeriod,
  currentTime: 0,
  minutesLeft: 0,
  percentCompleted: 0,
  percentCompletedText: "",

  //Settings Page
  settingsMenu,

  //Functions
  switchToNowPage,
  switchToCalendarPage,
  switchToSettingsPage,
  scheduleClick,
  translateWithInsert, 
  translate,
  interval: 0,
  startTimer() {
    this.update();
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.update();
    }, 5000);
  },
  update() {

    console.log("tick");
    
    if (!currentPeriod.isCurrent()) {
      location.reload();
      // console.log("new Period");
      // periodList.forEach((p) => {
      //   if(p.isCurrent()) {
      //     currentPeriod = p;
      //   }});
      // periodList = periodList;
    }

    this.todaysGreeting = getTodaysGreeting();
    this.minutesLeft = currentPeriod.end.diff(moment(), "minutes") + 1;
    this.percentCompleted = 100 - (this.minutesLeft / currentPeriod.end.diff(currentPeriod.start, "minutes")) * 100;
    this.percentCompletedText = translateWithInsert( "PERCENT_COMPLETED", Math.trunc(this.percentCompleted));
    this.currentTime = moment().format(timeFormat);
    document.title = this.minutesLeft + "min. | LCHS Go";
  },
}).mount();

function PeriodComponent(setName, setStart, setEnd, setPassing) {
  return {
    name: setName,
    start: moment(setStart, "hh:mm A"), //formats from the json
    end: moment(setEnd, "hh:mm A"),
    passing: setPassing,
    isCurrent() {
      var now = moment();
      if (this.start < now && now < this.end) {
        return true;
      }
      return false;
    },
    getName() {
      if (this.passing) {
        let tempName = this.name.split(',');
        return translateWithInsert(tempName[0], translate(tempName[1]));
      }
      return translate(this.name);
    },
    getStart() {
      return this.start.format(timeFormat);
    },
    getEnd() {
      return this.end.format(timeFormat);
    },
    isPassing() {
      return this.passing;
    },
  };
}

function PeriodInformationComponent(props) {
  return {
    $template: "#period-information-template"
  }
}

export function getTodaysGreeting() {
  return (
    getGreeting() +
    " " +
    translateWithInsert("TODAY_IS", translate(scheduleType))
  );
}

function getGreeting() {
  var hours = moment().hours();

  if (hours < 12) {
    return translate("MORNING");
  } else if (hours < 18) {
    return translate("AFTERNOON");
  } else {
    return translate("EVENING");
  }
}


function populateCalendar() {
var month = moment().month;
var maxDays = 0;
var offset = dayOfWeek();
var extraRow = false;

console.log(offset)

switch(month)
{
case 0:
case 2:
case 4:
case 6:
case 7:
case 9:
case 11:
  maxDays = 31;
break;
case 1:
  maxDays = 28;
break;
default:
  maxDays = 30;
}

if (offset + maxDays > 35)
{
  var extraRow = true;
}

for (var i = 1 ; i<= maxDays+offset; i++)
{
  var cell = document.getElementById("a" + i);
  cell.addEventListener("click", () => {
    window.location.href = "/a"+i;
  });
  console.log(toString(1))
  console.log("a" +i)
  console.log(document.getElementById("a" + i))

  if (i < offset)
  {

  }
 
  if (eventsJSON[i-offset] != null && i > offset){
    document.getElementById("a" + i).innerHTML = i-offset + "<p class='poof'>" + eventsJSON[i-offset] + "</p>";
  }
  else if (i <= offset){
    document.getElementById("a" + i).innerHTML = "<p class='oof'> owo </p>";

  }
  else{
    document.getElementById("a" + i).innerHTML =  i-offset +  "<p class='oof'> owo  </p>  ";
  }

  if (!extraRow) {
    document.getElementById("extra").style.display = "none";
  }




}

}
function dayOfWeek()
{
  var year = moment().year() % 100;

  var mone = moment().month() -1;
  if (mone <= 0)
  {
    mone += 11
  }
  var century = Math.round(moment().year() /100)
 var test = (1 + Math.floor(2.6 * mone - 0.2) - 2*century + year + Math.floor(year/4) +Math.floor(century/4)) %7
// i found this formula online
 return test
}
function scheduleClick(number)
{
  var shift = dayOfWeek()


  if (number-shift > 0 && eventsJSON[number-shift]!= null)
    console.log(eventsJSON[number-shift])
}
export function translate(translateText) {
  return languageJSON[translateText];
}

export function translateWithInsert(translateText, insertString) {
  var returnText = languageJSON[translateText];
  var index = returnText.indexOf("{}");
  if (index < 0) {
    return translate(translateText);
  }
  return returnText.slice(0, index) + insertString + returnText.slice(index + 2);
}