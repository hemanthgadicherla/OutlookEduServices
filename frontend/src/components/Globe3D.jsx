import { useEffect, useRef } from 'react';

// Destinations — lat/lon only, no pins
const DESTINATIONS = [
  { name: 'India',       flag: '🇮🇳', lat:  20.6, lon:  78.9, hub: true  },
  { name: 'USA',         flag: '🇺🇸', lat:  38.0, lon: -97.0, hub: false },
  { name: 'Canada',      flag: '🇨🇦', lat:  56.0, lon: -96.0, hub: false },
  { name: 'UK',          flag: '🇬🇧', lat:  54.0, lon:  -2.0, hub: false },
  { name: 'Europe',      flag: '🇪🇺', lat:  50.0, lon:  15.0, hub: false },
  { name: 'Ireland',     flag: '🇮🇪', lat:  53.0, lon:  -8.0, hub: false },
  { name: 'Australia',   flag: '🇦🇺', lat: -25.0, lon: 134.0, hub: false },
  { name: 'New Zealand', flag: '🇳🇿', lat: -41.0, lon: 174.0, hub: false },
];

// Equirectangular: lon -180..180 → 0..W, lat 90..-90 → 0..H
const toXY = (lat, lon, W, H) => ({
  x: ((lon + 180) / 360) * W,
  y: ((90 - lat)  / 180) * H,
});

const Globe3D = () => {
  const canvasRef  = useRef(null);
  const imgRef     = useRef(null);
  const rotRef     = useRef(0);       // degrees, increases over time
  const velRef     = useRef(0);
  const dragging   = useRef(false);
  const prevX      = useRef(0);
  const rafRef     = useRef(null);
  const pulseT     = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Load world map image ──────────────────────────────────
    const img = new Image();
    img.crossOrigin = 'anonymous';
    // Natural Earth II — reliable, no CORS issues via wikimedia
    img.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Whole_world_-_land_and_oceans.jpg/2560px-Whole_world_-_land_and_oceans.jpg';
    img.onload  = () => { imgRef.current = img; };
    img.onerror = () => {
      // Fallback
      const img2 = new Image();
      img2.crossOrigin = 'anonymous';
      img2.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Blue_Marble_2002.png/1280px-Blue_Marble_2002.png';
      img2.onload = () => { imgRef.current = img2; };
    };

    // ── Resize canvas to container ────────────────────────────
    const resize = () => {
      const size = Math.min(canvas.parentElement?.clientWidth || 480, 480);
      canvas.width  = size;
      canvas.height = size;
    };
    resize();
    window.addEventListener('resize', resize);

    // ── Draw one frame ────────────────────────────────────────
    const draw = () => {
      const W  = canvas.width, H = canvas.height;
      const cx = W / 2, cy = H / 2;
      const R  = W * 0.46;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, W, H);

      // Clip everything to the sphere circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();

      // Ocean background
      const ocean = ctx.createRadialGradient(cx - R*0.3, cy - R*0.3, R*0.05, cx, cy, R);
      ocean.addColorStop(0,   '#1a4a8a');
      ocean.addColorStop(0.6, '#0d2a5e');
      ocean.addColorStop(1,   '#020c1a');
      ctx.fillStyle = ocean;
      ctx.fillRect(0, 0, W, H);

      // Draw world map — two copies side by side for seamless wrap
      if (imgRef.current) {
        const iw = imgRef.current.naturalWidth  || imgRef.current.width;
        const ih = imgRef.current.naturalHeight || imgRef.current.height;

        // Map fills the full diameter, centred on the sphere
        const mapW = R * 2;
        const mapH = R * 2;
        const mapY = cy - R;

        // How many pixels to shift left based on rotation
        // rotRef is in degrees; full 360° = one full mapW
        const shift = ((rotRef.current % 360) + 360) % 360;
        const offsetX = (shift / 360) * mapW;

        // Draw two copies so the seam is never visible
        ctx.globalAlpha = 0.92;
        ctx.drawImage(imgRef.current, cx - R - offsetX,        mapY, mapW, mapH);
        ctx.drawImage(imgRef.current, cx - R - offsetX + mapW, mapY, mapW, mapH);
        ctx.globalAlpha = 1;
      }

      // Lat grid lines (subtle)
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth   = 0.5;
      for (let lat = -75; lat <= 75; lat += 15) {
        const phi = (90 - lat) * Math.PI / 180;
        ctx.beginPath();
        ctx.ellipse(cx, cy - R * Math.cos(phi), R * Math.sin(phi), R * Math.sin(phi) * 0.09, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore(); // end sphere clip

      // ── Destination dots drawn ON the map ────────────────────
      // These use the same shift calculation as the map, so they
      // are always perfectly aligned with the map texture.
      pulseT.current += 0.05;
      const shift = ((rotRef.current % 360) + 360) % 360;
      const mapW  = R * 2;

      DESTINATIONS.forEach(dest => {
        // Equirectangular position on the map strip (0..mapW, 0..mapH)
        const lonNorm = ((dest.lon + 180) / 360);   // 0..1
        const latNorm = ((90 - dest.lat) / 180);    // 0..1

        // X on the scrolling strip
        let dotX = (cx - R) + lonNorm * mapW - (shift / 360) * mapW;
        // Wrap to visible range
        dotX = ((dotX - (cx - R)) % mapW + mapW) % mapW + (cx - R);
        const dotY = (cy - R) + latNorm * mapW;

        // Only draw if inside the sphere circle
        const dx = dotX - cx, dy = dotY - cy;
        const distFromCenter = Math.sqrt(dx*dx + dy*dy);
        if (distFromCenter > R * 0.95) return;

        // Fade near edges
        const edgeFade = Math.min(1, (R * 0.95 - distFromCenter) / (R * 0.15));

        ctx.save();
        ctx.globalAlpha = edgeFade;

        if (dest.hub) {
          // India — orange pulsing dot
          const pulse = 0.5 + 0.5 * Math.sin(pulseT.current);
          const dotR  = 7;

          // Pulse rings
          [1, 2].forEach(r => {
            ctx.beginPath();
            ctx.arc(dotX, dotY, dotR + r * 9 * pulse, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255,100,0,${0.5 - r * 0.15})`;
            ctx.lineWidth   = 1.5;
            ctx.stroke();
          });

          // Core dot
          ctx.beginPath();
          ctx.arc(dotX, dotY, dotR, 0, Math.PI * 2);
          ctx.fillStyle   = '#ff5500';
          ctx.fill();
          ctx.strokeStyle = '#ffc107';
          ctx.lineWidth   = 2;
          ctx.stroke();

          // Label
          ctx.font      = `bold ${Math.max(10, R * 0.055)}px Poppins,sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.shadowColor  = 'rgba(0,0,0,1)';
          ctx.shadowBlur   = 5;
          ctx.fillStyle    = '#ffc107';
          ctx.fillText('India', dotX, dotY - dotR - 3);
          ctx.shadowBlur   = 0;

        } else {
          // Other countries — gold dot
          const dotR = 5;
          ctx.beginPath();
          ctx.arc(dotX, dotY, dotR, 0, Math.PI * 2);
          ctx.fillStyle   = '#ffc107';
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth   = 1.2;
          ctx.stroke();

          // Label
          ctx.font      = `bold ${Math.max(9, R * 0.044)}px Poppins,sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.shadowColor  = 'rgba(0,0,0,1)';
          ctx.shadowBlur   = 5;
          ctx.fillStyle    = '#ffffff';
          ctx.fillText(dest.name, dotX, dotY - dotR - 2);
          ctx.shadowBlur   = 0;
        }

        ctx.restore();
      });

      // ── Sphere edge darkening ─────────────────────────────────
      const edge = ctx.createRadialGradient(cx, cy, R * 0.5, cx, cy, R);
      edge.addColorStop(0,   'rgba(2,12,26,0)');
      edge.addColorStop(0.7, 'rgba(2,12,26,0.3)');
      edge.addColorStop(1,   'rgba(2,12,26,0.95)');
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = edge;
      ctx.fill();

      // ── Specular highlight ────────────────────────────────────
      const shine = ctx.createRadialGradient(cx - R*0.35, cy - R*0.35, 0, cx - R*0.15, cy - R*0.15, R*0.65);
      shine.addColorStop(0,   'rgba(255,255,255,0.13)');
      shine.addColorStop(1,   'rgba(255,255,255,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = shine;
      ctx.fill();

      // ── Globe border ──────────────────────────────────────────
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,193,7,0.5)';
      ctx.lineWidth   = 2;
      ctx.stroke();

      // Atmosphere
      const atm = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.1);
      atm.addColorStop(0,   'rgba(80,140,255,0.22)');
      atm.addColorStop(1,   'rgba(80,140,255,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.1, 0, Math.PI * 2);
      ctx.fillStyle = atm;
      ctx.fill();
    };

    // ── Animation loop ────────────────────────────────────────
    const tick = () => {
      if (!dragging.current) {
        velRef.current *= 0.94;
        rotRef.current += 0.35 + velRef.current;
      }
      draw();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    // ── Drag handlers ─────────────────────────────────────────
    const onDown = (e) => {
      dragging.current = true;
      prevX.current = (e.touches ? e.touches[0] : e).clientX;
      canvas.style.cursor = 'grabbing';
    };
    const onMove = (e) => {
      if (!dragging.current) return;
      const x  = (e.touches ? e.touches[0] : e).clientX;
      const dx = x - prevX.current;
      velRef.current  = dx * 0.55;
      rotRef.current -= dx * 0.55;   // drag right = rotate right = map moves right
      prevX.current   = x;
    };
    const onUp = () => {
      dragging.current = false;
      canvas.style.cursor = 'grab';
    };

    canvas.addEventListener('mousedown',  onDown);
    canvas.addEventListener('mousemove',  onMove);
    canvas.addEventListener('mouseup',    onUp);
    canvas.addEventListener('mouseleave', onUp);
    canvas.addEventListener('touchstart', onDown, { passive: true });
    canvas.addEventListener('touchmove',  onMove, { passive: true });
    canvas.addEventListener('touchend',   onUp);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousedown',  onDown);
      canvas.removeEventListener('mousemove',  onMove);
      canvas.removeEventListener('mouseup',    onUp);
      canvas.removeEventListener('mouseleave', onUp);
      canvas.removeEventListener('touchstart', onDown);
      canvas.removeEventListener('touchmove',  onMove);
      canvas.removeEventListener('touchend',   onUp);
    };
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: 480, margin: '0 auto' }}>
      <canvas
        ref={canvasRef}
        style={{
          display:     'block',
          width:       '100%',
          aspectRatio: '1 / 1',
          cursor:      'grab',
          borderRadius:'50%',
          boxShadow:   '0 0 0 2px rgba(255,193,7,0.4), 0 0 80px rgba(255,193,7,0.18), 0 0 160px rgba(0,80,255,0.1)',
        }}
        aria-label="Interactive rotating Earth globe"
      />
    </div>
  );
};

export default Globe3D;
