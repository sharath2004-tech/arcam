// AR Viewer initializer — runs after AR.js and A-Frame are loaded
// Builds an <a-scene> with natural feature tracking marker
(function () {
  'use strict';

  var root = document.getElementById('ar-root');

  // Back button
  var back = document.createElement('div');
  back.style.cssText = [
    'position:fixed', 'top:16px', 'left:16px', 'z-index:9999',
    'background:rgba(0,0,0,0.6)', 'color:#fff', 'border-radius:12px',
    'padding:8px 16px', 'font-family:system-ui,sans-serif', 'font-size:14px',
    'cursor:pointer', 'backdrop-filter:blur(8px)',
  ].join(';');
  back.textContent = '← Back';
  back.addEventListener('click', function () { history.back(); });
  document.body.appendChild(back);

  // Info overlay
  var info = document.createElement('div');
  info.id = 'ar-info';
  info.style.cssText = [
    'position:fixed', 'bottom:32px', 'left:50%', 'transform:translateX(-50%)',
    'z-index:9999', 'background:rgba(0,0,0,0.6)', 'color:rgba(255,255,255,0.8)',
    'border-radius:12px', 'padding:10px 20px',
    'font-family:system-ui,sans-serif', 'font-size:13px',
    'text-align:center', 'backdrop-filter:blur(8px)',
    'pointer-events:none',
  ].join(';');
  info.textContent = 'Point camera at a printed AR Memories photo';
  document.body.appendChild(info);

  // Build A-Frame scene
  var scene = document.createElement('a-scene');
  scene.setAttribute('embedded', '');
  scene.setAttribute('arjs', 'sourceType: webcam; detectionMode: mono_and_matrix; matrixCodeType: 3x3;');
  scene.setAttribute('vr-mode-ui', 'enabled: false');
  scene.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;';

  // Default Hiro marker — photographers can link their album's AR media via QR token
  var marker = document.createElement('a-marker');
  marker.setAttribute('preset', 'hiro');

  // Video entity — plays on marker detection
  var videoEl = document.createElement('a-video');
  videoEl.setAttribute('src', '#ar-video');
  videoEl.setAttribute('width', '1.6');
  videoEl.setAttribute('height', '0.9');
  videoEl.setAttribute('position', '0 0.5 0');
  videoEl.setAttribute('rotation', '-90 0 0');
  marker.appendChild(videoEl);
  scene.appendChild(marker);

  // Camera
  var cam = document.createElement('a-entity');
  cam.setAttribute('camera', '');
  scene.appendChild(cam);

  // Video asset
  var assets = document.createElement('a-assets');
  var vid = document.createElement('video');
  vid.id = 'ar-video';
  vid.setAttribute('src', '/ar-sample.mp4'); // default sample; replaced per album
  vid.setAttribute('autoplay', '');
  vid.setAttribute('loop', '');
  vid.setAttribute('webkit-playsinline', '');
  vid.setAttribute('playsinline', '');
  vid.setAttribute('crossorigin', 'anonymous');
  assets.appendChild(vid);
  scene.appendChild(assets);

  root.appendChild(scene);

  // Listen for marker found/lost to update info overlay
  marker.addEventListener('markerFound', function () {
    info.textContent = '✓ Memory detected — playing';
    info.style.color = 'rgba(100,255,150,0.9)';
    vid.play().catch(function () {});
  });
  marker.addEventListener('markerLost', function () {
    info.textContent = 'Point camera at a printed AR Memories photo';
    info.style.color = 'rgba(255,255,255,0.8)';
  });
})();
