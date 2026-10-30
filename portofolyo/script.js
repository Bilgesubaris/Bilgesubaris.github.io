
function show() {
  var h = location.hash.slice(1);
  var found = false;

  document.querySelectorAll('[data-v]').forEach(function(s) {
    if (s.dataset.v === h) found = true;
  });

  if (!found) h = 'ana-sayfa';

  document.querySelectorAll('[data-v]').forEach(function(s) {
    s.hidden = s.dataset.v !== h;
  });

  document.querySelectorAll('#nav a').forEach(function(a) {
    if (a.getAttribute('href') === '#' + h) {
      a.setAttribute('aria-current', 'page');
    } else {
      a.removeAttribute('aria-current');
    }
  });

  document.getElementById('bg').hidden = h !== 'ana-sayfa';
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', show);
show();

// Proje filtreleri
document.querySelectorAll('.chips button').forEach(function(b) {
  b.addEventListener('click', function() {
    document.querySelectorAll('.chips button').forEach(function(x) {
      x.setAttribute('aria-pressed', x === b);
    });

    var f = b.dataset.f;

    document.querySelectorAll('.project-card').forEach(function(a) {
      a.hidden = !(f === 'all' || a.dataset.t === f);
    });
  });
});

// İletişim formu
document.getElementById('f').addEventListener('submit', function(e) {
  e.preventDefault();

  var d = new FormData(e.target);
  var body = d.get('msg') + '\n\n' + d.get('ad') + ' (' + d.get('mail') + ')';

  location.href = 'mailto:bilgesubaris@gmail.com?subject=' +
    encodeURIComponent('Web sitesinden mesaj') +
    '&body=' + encodeURIComponent(body);
});

// Arka plan animasyonu
(function() {
  var cv = document.getElementById('bg');
  var cx = cv.getContext('2d');
  var W, H, P = [];
  var m = {x:-999, y:-999};
  var col = '91,69,224';

  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

  function color() {
    var h = getComputedStyle(document.documentElement)
      .getPropertyValue('--p').trim().replace('#','');

    if (h.length === 6) {
      col = parseInt(h.slice(0,2),16) + ',' +
            parseInt(h.slice(2,4),16) + ',' +
            parseInt(h.slice(4,6),16);
    }
  }

  function size() {
    var d = window.devicePixelRatio || 1;

    W = innerWidth;
    H = innerHeight;

    cv.width = W * d;
    cv.height = H * d;
    cx.setTransform(d,0,0,d,0,0);

    var n = Math.min(110, Math.round(W * H / 13000));
    P = [];

    for (var i = 0; i < n; i++) {
      P.push({
        x:Math.random()*W,
        y:Math.random()*H,
        vx:(Math.random()-.5)*.5,
        vy:(Math.random()-.5)*.5,
        r:1.2+Math.random()*1.6
      });
    }
  }

  function frame() {
    if (!cv.hidden && !document.hidden) {
      cx.clearRect(0,0,W,H);

      for (var i = 0; i < P.length; i++) {
        var a = P[i];

        if (!reduce) {
          a.x += a.vx;
          a.y += a.vy;

          if (a.x < 0 || a.x > W) a.vx *= -1;
          if (a.y < 0 || a.y > H) a.vy *= -1;

          var dx = a.x - m.x;
          var dy = a.y - m.y;
          var d = Math.hypot(dx,dy);

          if (d < 120 && d > 0) {
            a.x += dx/d*1.2;
            a.y += dy/d*1.2;
          }
        }

        cx.fillStyle = 'rgba('+col+',.55)';
        cx.beginPath();
        cx.arc(a.x,a.y,a.r,0,6.283);
        cx.fill();

        for (var j = i+1; j < P.length; j++) {
          var b = P[j];
          var e = Math.hypot(a.x-b.x,a.y-b.y);

          if (e < 130) {
            cx.strokeStyle = 'rgba('+col+','+(.28*(1-e/130))+')';
            cx.lineWidth = 1;
            cx.beginPath();
            cx.moveTo(a.x,a.y);
            cx.lineTo(b.x,b.y);
            cx.stroke();
          }
        }

        var md = Math.hypot(a.x-m.x,a.y-m.y);

        if (md < 170) {
          cx.strokeStyle = 'rgba('+col+','+(.55*(1-md/170))+')';
          cx.lineWidth = 1;
          cx.beginPath();
          cx.moveTo(a.x,a.y);
          cx.lineTo(m.x,m.y);
          cx.stroke();
        }
      }
    }

    if (!reduce) requestAnimationFrame(frame);
  }

  window.addEventListener('pointermove', function(e) {
    m.x = e.clientX;
    m.y = e.clientY;
  });

  document.addEventListener('pointerleave', function() {
    m.x = -999;
    m.y = -999;
  });

  window.addEventListener('resize', function() {
    size();
    if (reduce) frame();
  });

  window.addEventListener('hashchange', function() {
    if (reduce) frame();
  });

  matchMedia('(prefers-color-scheme:dark)').addEventListener('change', color);

  color();
  size();
  frame();
})();
