(function () {
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });

    links.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        links.classList.remove('open');
      });
    });
  }

  var header = document.querySelector('.site-header');
  var lastScroll = 0;
  window.addEventListener('scroll', function () {
    var current = window.scrollY;
    if (header) {
      header.style.boxShadow = current > 10 ? '0 4px 14px rgba(30,42,46,.12)' : 'none';
    }
    lastScroll = current;
  });

  function toMinutes(t) {
    var p = t.split(':');
    return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
  }

  function initHoursStatus() {
    var table = document.getElementById('hoursTable');
    var statusEl = document.getElementById('openStatus');
    if (!table || !statusEl) return;

    var rows = Array.prototype.slice.call(table.querySelectorAll('tr'));
    var now = new Date();
    var day = now.getDay();
    var minutesNow = now.getHours() * 60 + now.getMinutes();
    var isOpen = false;
    var todaysRow = null;

    rows.forEach(function (row) {
      var daysAttr = row.getAttribute('data-days');
      if (!daysAttr) return;
      var days = daysAttr.split(',').map(Number);
      if (days.indexOf(day) === -1) return;
      todaysRow = row;
      row.classList.add('today');
      var openMin = toMinutes(row.getAttribute('data-open'));
      var closeMin = toMinutes(row.getAttribute('data-close'));
      if (closeMin <= openMin) {
        if (minutesNow >= openMin || minutesNow < closeMin) isOpen = true;
      } else if (minutesNow >= openMin && minutesNow < closeMin) {
        isOpen = true;
      }
    });

    if (!isOpen) {
      var yesterday = (day + 6) % 7;
      rows.forEach(function (row) {
        var daysAttr = row.getAttribute('data-days');
        if (!daysAttr) return;
        var days = daysAttr.split(',').map(Number);
        if (days.indexOf(yesterday) === -1) return;
        var openMin = toMinutes(row.getAttribute('data-open'));
        var closeMin = toMinutes(row.getAttribute('data-close'));
        if (closeMin <= openMin && minutesNow < closeMin) isOpen = true;
      });
    }

    var isEn = document.documentElement.lang === 'en';

    if (isOpen) {
      statusEl.textContent = isEn ? 'Open now' : 'Otwarte teraz';
      statusEl.className = 'status-pill open';
    } else {
      var opensAt = todaysRow ? todaysRow.getAttribute('data-open') : '';
      if (opensAt) {
        statusEl.textContent = isEn ? 'Closed — opening today at ' + opensAt : 'Zamknięte — dziś otwieramy o ' + opensAt;
      } else {
        statusEl.textContent = isEn ? 'Closed' : 'Zamknięte';
      }
      statusEl.className = 'status-pill closed';
    }
  }

  initHoursStatus();
})();
