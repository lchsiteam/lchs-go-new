# New LCHS Go

I guess put a description here...

# TODO

## Overall
#### Major 
- [ ] Add the rest of the schedules
    - [ ] 7/8
    - [ ] highschool
    - [ ] elementary
- [ ] Add languages
    - [ ] spanish
    - [ ] german
    - [ ] french

- [ ]  Page title with hours in time
    - [ ]  The time is already formatted for the now page
    - [ ]  In the update function make it set the time to the window
- [ ]  (Kai don't hate me) Make the page update without reloading
    - [ ]  I have no clue
    - [ ]  The reason the page reloads when the class changes is that there is no easy way to make it automatically update the elements with the new class
    - [ ]  Although do check out the `v-effect="$el.<element property>"` thing and see if that has results

## Now Page

- [x]  Class Renaming
    - [x]  Add button for renaming or make the names text fields
    - [x]  Store the custom classes in local storage by the language key
    - [x]  in translate see if there are custom overrides in the periods
    - [x]  return the over ride text
- [ ]  Current time styling
    - [ ]  The current time no longer has the background set to the darker color
    - [ ]  This is so the themes can change with out any extra code
        - Everything on the page is semi transparent and a shade of gray
    - [ ]  Make the line behind the numbers disappear where the numbers are
    - Ideas
        - [ ]  You could do this with two line - changing there heights with a percentage
        - [ ]  You could do this with a linear gradient that has a transparent section in it
        - [ ]  Overall it needs to be controlled by a percentage
## Calendar

- [x]  Make calendar boxes fill the space
    - [x]  The calendar boxes don't fit and expand the whole row when there is an event on that day
    - [x]  You could set the height to be fixed (ie. 200px or 12vh)
    - [x]  You could remove the event tag and make it an on hover or put it in the schedule popup
- [ ]  Allow you to view another month
    - [ ]  Add a similar thing to LCHS go where you can pick from a calendar or arrow buttons
- [ ]  Mobile view
    - [ ]  Prototype ideas cus idk
- [ ]  Make popup display the proper day
    - [ ]  Currently the popup displays the current schedule for the day ie today
    - [ ]  When the calendar day is clicked on pass a `moment()` object into the `PeriodListTemplate` component (this will need to be set up in the `PeriodListTemplate` first)
    - [ ]  Then have the `PeriodListTemplate` display that day
- [x]  Change calendar day to have checker pattern
    - [x]  copy the `tr` css over to the `.calendar-day`
- [ ]  Change cursor to pointer on calendar day
    - [ ]  in the `.calendar-day` class set `cursor: pointer`
- [ ]  Add hover effect to calendar day
    - [ ]  make a new `.calendar-day:hover` class and set `transform: scale(1.1)` (this might work, tinker with it)
    - [ ]  And make it darker so `background: slightly-darker` or something

## Settings Page

- [x]  Fix language keys to use titles on settings items
    - [x]  Currently the title uses the description keys
    - [x]  set the title to have `_TITLE` instead of `_DESC` in the html
- [x]  Make options update live
    - [x]  idk - samething as the now page not updating from period to period
- [x]  Make color theme slider work
    - [x]  when the value changes set the background hue to it
    - [x]  `hsl(<hue can be from 0 - 360>, 50, 50);`
- [x]  Make drop downs work
    - [x]  Copy the update code from the toggles and make it choose from the drop downs

