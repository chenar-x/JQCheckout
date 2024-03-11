(function (undefined) {
  var _global;

  function extend(def, opt, override) {
    for (var k in opt) {
      if (opt.hasOwnProperty(k) && (!def.hasOwnProperty(k) || override)) {
        def[k] = opt[k];
      }
    }
    return def;
  }

  function concatDate(y, m, d) {
    var symbol = "-";
    if (m) {
      m = m.toString()[1] ? m : "0" + m;
    }
    if (d) {
      d = d.toString()[1] ? d : "0" + d;
    }

    return y + (m ? symbol + m : "") + (d ? symbol + d : "");
  }

  function getTimeStamp(d) {
    var date = new Date(d);

    if (isNaN(date.getTime())) {
      console.error(d + " is invalid date");
      return "";
    }

    return date.getTime();
  }

  //polyfill
  if (!Array.isArray) {
    Array.isArray = function (arg) {
      return Object.prototype.toString.call(arg) === "[object Array]";
    };
  }

  function filterDate(arr, type) {
    if (!Array.isArray(arr)) {
      return [];
    }

    arr = arr || [];
    var dateArr = [];

    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      var date = new Date(type != "select" ? item : item.day);

      if (isNaN(date.getTime())) {
        console.error(item + " is invalid date");
      } else {
        var y = date.getFullYear();
        var m = date.getMonth();
        var d = date.getDate();
				
        var dateStr = concatDate(y, m + 1, d);

				var dataArr = {
					day: dateStr,
					integrate: item.integrate
				}

        type != "select" ? dateArr.push(dateStr) : dateArr.push(dataArr);
      }
    }

    return dateArr;
  }

  function Schedule(opt) {
    var def = {},
      opt = extend(def, opt, true),
      curDate = opt.date ? new Date(opt.date) : new Date(),
      disabledDate = opt.disabledDate ? filterDate(opt.disabledDate) : [],

      selectedDate = opt.selectedDate
        ? filterDate(opt.selectedDate, "select")
        : [],
      disabledBefore = opt.disabledBefore
        ? getTimeStamp(opt.disabledBefore)
        : "",
      disabledAfter = opt.disabledAfter ? getTimeStamp(opt.disabledAfter) : "",
      showToday = opt.showToday,
      year = curDate.getFullYear(),
      month = curDate.getMonth(),
      currentYear = curDate.getFullYear(),
      currentMonth = curDate.getMonth(),
      currentDay = curDate.getDate(),
      activeDate = "",
      el = document.querySelector(opt.el) || document.querySelector("body"),
      _this = this;

    var bindEvent = function () {
      el.addEventListener(
        "click",
        function (e) {
          switch (e.target.id) {
            case "nextMonth":
              _this.nextMonthFun();
              break;
            case "nextYear":
              _this.nextYearFun();
              break;
            case "prevMonth":
              _this.prevMonthFun();
              break;
            case "prevYear":
              _this.prevYearFun();
              break;
            case "todayBtn":
              _this.renderToday();
              break;
            default:
              break;
          }
          if (e.target.className.indexOf("currentDate") > -1) {
            activeDate = e.target.title;
            opt.clickCb && opt.clickCb(activeDate);
            render();
          }
        },
        false
      );
    };
    var init = function () {
      var scheduleHd =
        '<div class="schedule-hd">' +
        "<div>" +
        '<span class="arrow icon iconfont icon-116leftarrowheads" id="prevYear" ></span>' +
        '<span class="arrow icon iconfont icon-112leftarrowhead" id="prevMonth"></span>' +
        "</div>" +
        '<div class="today"></div>' +
        "<div>" +
        '<span class="arrow icon iconfont icon-111arrowheadright" id="nextMonth"></span>' +
        '<span class="arrow icon iconfont icon-115rightarrowheads" id="nextYear"></span>' +
        "</div>" +
        "</div>";
      var scheduleWeek =
        '<ul class="week-ul ul-box">' +
        '<li class="week">日</li>' +
        "<li>一</li>" +
        "<li>二</li>" +
        "<li>三</li>" +
        "<li>四</li>" +
        "<li>五</li>" +
        '<li class="week">六</li>' +
        "</ul>";
      var scheduleBd = '<ul class="schedule-bd ul-box" ></ul>';
      var todayBtn = '<div id="todayBtn" class="today">回到今天</div>';
      el.innerHTML =
        scheduleHd + scheduleWeek + scheduleBd + (showToday ? todayBtn : "");
      bindEvent();
      render();
    };
    var render = function () {
      var fullDay = new Date(year, month + 1, 0).getDate(),
        startWeek = new Date(year, month, 1).getDay(),
        total =
          (fullDay + startWeek) % 7 == 0
            ? fullDay + startWeek
            : fullDay + startWeek + (7 - ((fullDay + startWeek) % 7)),
        lastMonthDay = new Date(year, month, 0).getDate(),
        eleTemp = [];
      for (var i = 0; i < total; i++) {
        var nowDate = concatDate(year, month + 1, i + 1 - startWeek);       

        var nowTimestamp = new Date(nowDate).getTime();
        var isDisbale = disabledDate.indexOf(nowDate) > -1;

				let isSelected = false
				let newSel = []
				let getInt = 0
				if(selectedDate.length > 0) {
					selectedDate.forEach(item => {
						newSel
						if(item.day == nowDate) {
							isSelected = true
							getInt = item.integrate
						}
					})
				}
              
        if (i < startWeek) {
          // console.log(i, startWeek, getInt, isSelected);
          // eleTemp.push('<li class="other-month"><span class="dayStyle">' +  '3242' + (lastMonthDay - startWeek + 1 + i) + '</span></li>')
          // eleTemp.push(
          //   '<li class="other-month"><span class="dayStyle"><span class="circle">' +
          //     "未" +
          //     "</span></span>" +
          //     (month > 0 ? month : 12) +
          //     "." +
          //     (lastMonthDay - startWeek + 1 + i) +
          //     "</li>"
          // );
          var beforeDate = concatDate(year, month > 0 ? month : 12, lastMonthDay - startWeek + 1 + i)
          var isDisbale = disabledDate.indexOf(beforeDate) > -1;

          if(selectedDate.length > 0) {
            selectedDate.forEach(item => {
              if(item.day == beforeDate) {
                isSelected = true
                getInt = item.integrate
              }
            })
          }

          var addClass = "";
          if (isDisbale) {
            addClass = "disabled";
          } else {
            isSelected && (addClass = "selected-style");
          }


          eleTemp.push(
            '<li class="current-month" ><span class="currentDate dayStyle '+ addClass + '">' +
            (isSelected
              ? "<span>" + getInt + '</span><img src="../assets/images/IntegralCheckIn/icon-check.png" />'
              : "") +
              '<span class="circle">' +
              (isDisbale ? "断" : isSelected ? "" : "未") +
              "</span>" +
              "</span>" +
                  (month > 0 ? month : 12) +
                  "." +
                  (lastMonthDay - startWeek + 1 + i) +
              "</li>"
          );


        } else if (i < startWeek + fullDay) {
          var addClass = "";
          if (isDisbale) {
            addClass = "disabled";
          } else {
            isSelected && (addClass = "selected-style");
          }

          if (disabledBefore && nowTimestamp < disabledBefore) {
            addClass = "disabled";
          }
          if (disabledAfter && nowTimestamp > disabledAfter) {
            addClass = "disabled";
          }

          eleTemp.push(
            '<li class="current-month" ><span title=' +
              nowDate +
              ' class="currentDate dayStyle ' +
              addClass +
              '">' +
              (isSelected
                ? "<span>" + getInt + '</span><img src="../assets/images/IntegralCheckIn/icon-check.png" />'
                : "") +
              '<span class="circle">' +
              (isDisbale ? "断" : isSelected ? "" : "未") +
              "</span>" +
              "</span>" +
              (month + 1) +
              "." +
              (i + 1 - startWeek) +
              "</li>"
          );
        } else {
          var afterDate = concatDate(year, month < 11 ? month + 2 : 1, i + 1 - (startWeek + fullDay))
          var isDisbale = disabledDate.indexOf(afterDate) > -1;

          if(selectedDate.length > 0) {
            selectedDate.forEach(item => {
              if(item.day == afterDate) {
                isSelected = true
                getInt = item.integrate
              }
            })
          }

          var addClass = "";
          if (isDisbale) {
            addClass = "disabled";
          } else {
            isSelected && (addClass = "selected-style");
          }

          eleTemp.push(
            '<li class="current-month" ><span class="currentDate dayStyle '+ addClass + '">' +
            (isSelected
              ? "<span>" + getInt + '</span><img src="../assets/images/IntegralCheckIn/icon-check.png" />'
              : "") +
              '<span class="circle">' +
              (isDisbale ? "断" : isSelected ? "" : "未") +
              "</span>" +
              "</span>" +
              (month < 11 ? month + 2 : 1) +
                  "." +
                  (i + 1 - (startWeek + fullDay)) +
              "</li>"


            // '<li class="current-month" ><span title=' +
            //   nowDate +
            //   ' class="currentDate dayStyle ' +
            //   addClass +
            //   '">' +
            //   (isSelected
            //     ? "<span>" + getInt + '</span><img src="../assets/images/IntegralCheckIn/icon-check.png" />'
            //     : "") +
            //   '<span class="circle">' +
            //   (isDisbale ? "断" : isSelected ? "" : "未") +
            //   "</span>" +
            //   "</span>" +
            //   (month < 11 ? month + 2 : 1) +
            //   "." +
            //   (i + 1 - (startWeek + fullDay)) +
            //   "</li>"
          );

          // eleTemp.push(
          //   '<li class="other-month"><span class="dayStyle"><span class="circle">' +
          //     "未" +
          //     "</span></span>" +
          //     (month < 11 ? month + 2 : 1) +
          //     "." +
          //     (i + 1 - (startWeek + fullDay)) +
          //     "</li>"
          // );
        }
      }

      el.querySelector(".schedule-bd").innerHTML = eleTemp.join("");
      el.querySelector(".today").innerHTML = concatDate(year, month + 1);
    };
    this.nextMonthFun = function () {
      if (month + 1 > 11) {
        year += 1;
        month = 0;
      } else {
        month += 1;
      }
      render();
      opt.nextMonthCb && opt.nextMonthCb(year, month + 1);
    };
    this.nextYearFun = function () {
      year += 1;
      render();
      opt.nextYeayCb && opt.nextYeayCb(year, month + 1);
    };
    this.prevMonthFun = function () {
      if (month - 1 < 0) {
        year -= 1;
        month = 11;
      } else {
        month -= 1;
      }
      render();
      opt.prevMonthCb && opt.prevMonthCb(year, month + 1);
    };
    this.prevYearFun = function () {
      year -= 1;
      render();
      opt.prevYearCb && opt.prevYearCb(year, month + 1);
    };
    this.renderToday = function () {
      if (year === currentYear && month === currentMonth) {
        return;
      }

      year = currentYear;
      month = currentMonth;
      render();
    };
    init();
  }

  _global = (function () {
    return this || (0, eval)("this");
  })();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = Schedule;
  } else if (typeof define === "function" && define.amd) {
    define(function () {
      return Schedule;
    });
  } else {
    !("Schedule" in _global) && (_global.Schedule = Schedule);
  }
})();
