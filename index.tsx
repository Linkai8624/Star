import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// --- CSS Styles & Animations ---
const styles = `
  :root {
    --void-bg: #030407;
    --holo-cyan: #00f3ff;
    --holo-blue: #0066ff;
    --nebula-purple: #7000ff;
    --alert-red: #ff2a2a;
    --text-primary: #e0e0e0;
    --glass-panel: rgba(10, 15, 30, 0.65);
    --glass-border: rgba(0, 243, 255, 0.2);
  }

  body, html {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    background-color: var(--void-bg);
    /* Nebula Gradient Background */
    background-image: 
      radial-gradient(circle at 50% 50%, rgba(112, 0, 255, 0.15) 0%, transparent 60%),
      radial-gradient(circle at 80% 20%, rgba(0, 243, 255, 0.1) 0%, transparent 40%);
    font-family: 'Rajdhani', sans-serif;
    color: var(--text-primary);
    overflow: hidden;
  }

  * {
    box-sizing: border-box;
    user-select: none;
  }

  /* --- Utility Animations --- */
  @keyframes scanline {
    0% { transform: translateY(-100%); opacity: 0; }
    50% { opacity: 0.5; }
    100% { transform: translateY(100%); opacity: 0; }
  }

  @keyframes rotate-border {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }

  /* --- Layout --- */
  .app-container {
    position: relative;
    z-index: 10;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    padding: 2rem;
  }

  /* Header */
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--glass-border);
    padding-bottom: 1rem;
    margin-bottom: 2rem;
    background: linear-gradient(90deg, transparent, rgba(0, 243, 255, 0.05), transparent);
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .brand-logo {
    width: 40px;
    height: 40px;
    border: 2px solid var(--holo-cyan);
    border-radius: 50%;
    display: grid;
    place-items: center;
    box-shadow: 0 0 15px var(--holo-cyan);
    font-family: 'Orbitron', sans-serif;
    font-weight: bold;
    font-size: 1.2rem;
    color: var(--holo-cyan);
  }

  .brand-text h1 {
    margin: 0;
    font-family: 'Orbitron', sans-serif;
    font-size: 1.5rem;
    letter-spacing: 4px;
    text-transform: uppercase;
    background: linear-gradient(to right, #fff, var(--holo-cyan));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .brand-text p {
    margin: 0;
    font-size: 0.8rem;
    color: var(--holo-blue);
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .user-status {
    text-align: right;
    font-family: 'Share Tech Mono', monospace;
    color: var(--holo-cyan);
    font-size: 0.9rem;
  }

  /* --- Dashboard Grid --- */
  .dashboard {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 2rem;
    height: 100%;
  }

  /* Sidebar Stats */
  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .stat-panel {
    background: var(--glass-panel);
    border: 1px solid var(--glass-border);
    padding: 1.5rem;
    border-radius: 12px;
    backdrop-filter: blur(10px);
    position: relative;
    overflow: hidden;
  }

  .stat-panel::after {
    content: '';
    position: absolute;
    top: 0; left: 0; width: 100%; height: 2px;
    background: var(--holo-cyan);
    box-shadow: 0 0 10px var(--holo-cyan);
    opacity: 0.5;
  }

  .stat-label {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: rgba(255,255,255,0.5);
    margin-bottom: 0.5rem;
  }

  .stat-value {
    font-family: 'Orbitron', sans-serif;
    font-size: 1.8rem;
    color: #fff;
  }

  .bar-container {
    width: 100%;
    height: 6px;
    background: rgba(255,255,255,0.1);
    margin-top: 10px;
    border-radius: 3px;
    overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    background: var(--holo-cyan);
    box-shadow: 0 0 10px var(--holo-cyan);
    width: 0%;
    transition: width 1s ease-out;
  }

  .hologram-circle {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border: 2px dashed var(--holo-blue);
    margin: 0 auto;
    position: relative;
    animation: rotate-border 10s linear infinite;
    display: grid;
    place-items: center;
  }
  
  .hologram-inner {
    width: 80%;
    height: 80%;
    border-radius: 50%;
    border: 1px solid var(--holo-cyan);
    display: grid;
    place-items: center;
    animation: rotate-border 5s linear infinite reverse;
    box-shadow: inset 0 0 20px rgba(0, 243, 255, 0.2);
  }

  /* Main Content - Destination Grid */
  .content-area {
    overflow-y: auto;
    padding-right: 10px;
  }

  .section-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 1.2rem;
    color: #fff;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, var(--glass-border), transparent);
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    padding-bottom: 2rem;
  }

  /* --- Flow Light Card Effect --- */
  .card-wrapper {
    position: relative;
    border-radius: 16px;
    background: rgba(0,0,0,0.3);
    /* Important for the border animation */
    padding: 1px; 
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.3s ease;
  }

  .card-wrapper:hover {
    transform: translateY(-5px);
  }

  /* The Spinning Gradient Border */
  .card-wrapper::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(
      transparent, 
      transparent, 
      transparent, 
      var(--holo-cyan)
    );
    animation: rotate-border 4s linear infinite;
    opacity: 0; /* Hidden by default */
    transition: opacity 0.3s;
  }

  .card-wrapper:hover::before {
    opacity: 1;
  }

  /* Inner Card Content (masks the center of the spinning gradient) */
  .card-content {
    position: relative;
    background: rgba(12, 18, 28, 0.9); /* Dark background to cover the spinning gradient */
    border-radius: 15px; /* Slightly smaller radius */
    padding: 1.5rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    z-index: 2;
    backdrop-filter: blur(20px);
  }
  
  /* Inner Scanline Effect on Hover */
  .card-content::after {
    content: '';
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: linear-gradient(to bottom, transparent, rgba(0, 243, 255, 0.1), transparent);
    transform: translateY(-100%);
    pointer-events: none;
  }

  .card-wrapper:hover .card-content::after {
    animation: scanline 1.5s linear infinite;
  }

  .planet-preview {
    height: 140px;
    width: 100%;
    border-radius: 8px;
    background: #000;
    margin-bottom: 1rem;
    position: relative;
    overflow: hidden;
    display: grid;
    place-items: center;
  }
  
  .planet-orb {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    box-shadow: inset -10px -10px 20px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.5rem;
  }

  .planet-name {
    font-family: 'Orbitron', sans-serif;
    font-size: 1.4rem;
    color: #fff;
    margin: 0;
  }

  .planet-type {
    font-size: 0.8rem;
    color: var(--holo-cyan);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .distance-badge {
    background: rgba(0, 243, 255, 0.1);
    border: 1px solid var(--holo-cyan);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.7rem;
    color: var(--holo-cyan);
    font-weight: bold;
  }

  .card-details {
    margin-top: auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    font-size: 0.8rem;
    color: rgba(255,255,255,0.6);
    border-top: 1px solid rgba(255,255,255,0.1);
    padding-top: 1rem;
  }

  .detail-item span {
    display: block;
    color: #fff;
    font-family: 'Orbitron', sans-serif;
  }

  /* Button */
  .warp-btn {
    width: 100%;
    margin-top: 1rem;
    background: transparent;
    border: 1px solid var(--holo-cyan);
    color: var(--holo-cyan);
    padding: 10px;
    font-family: 'Orbitron', sans-serif;
    text-transform: uppercase;
    cursor: pointer;
    transition: 0.3s;
    position: relative;
    overflow: hidden;
  }

  .warp-btn:hover {
    background: var(--holo-cyan);
    color: #000;
    box-shadow: 0 0 15px var(--holo-cyan);
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: rgba(0,0,0,0.3);
  }
  ::-webkit-scrollbar-thumb {
    background: var(--glass-border);
    border-radius: 3px;
  }

  @media (max-width: 900px) {
    .dashboard {
      grid-template-columns: 1fr;
    }
    .sidebar {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
  }
  @media (max-width: 600px) {
    .sidebar {
      grid-template-columns: 1fr;
    }
    .app-container {
      padding: 1rem;
    }
  }
`;

// --- Components ---

// 1. Starfield Background (Canvas)
const Starfield = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Star Class
    class Star {
      x: number;
      y: number;
      z: number;
      prevZ: number;

      constructor() {
        this.x = Math.random() * width - width / 2;
        this.y = Math.random() * height - height / 2;
        this.z = Math.random() * width; // Depth
        this.prevZ = this.z;
      }

      update(speed: number) {
        this.z = this.z - speed;
        if (this.z < 1) {
          this.z = width;
          this.x = Math.random() * width - width / 2;
          this.y = Math.random() * height - height / 2;
          this.prevZ = this.z;
        }
      }

      draw() {
        if (!ctx) return;
        let sx = (this.x / this.z) * width + width / 2;
        let sy = (this.y / this.z) * height + height / 2;

        // Size grows as it gets closer
        let r = (width / this.z) * 0.5;
        
        // Draw Star
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(sx, sy, r > 3 ? 3 : r, 0, Math.PI * 2);
        ctx.fill();

        // Draw Trail (Warp effect)
        let px = (this.x / this.prevZ) * width + width / 2;
        let py = (this.y / this.prevZ) * height + height / 2;

        this.prevZ = this.z;
        
        if (r > 0.8) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 + (1 - this.z/width)})`;
            ctx.lineWidth = r;
            ctx.moveTo(px, py);
            ctx.lineTo(sx, sy);
            ctx.stroke();
        }
      }
    }

    const stars: Star[] = Array.from({ length: 800 }, () => new Star());
    let speed = 10; // Base warp speed

    const animate = () => {
      ctx.fillStyle = "rgba(3, 4, 7, 0.4)"; // Leave trails? No, clear for crispness, alpha for motion blur
      ctx.fillRect(0, 0, width, height);
      
      // Mouse influence could go here
      
      stars.forEach(star => {
        star.update(speed);
        star.draw();
      });

      requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);
    const handleResize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', top: 0, left: 0, zIndex: 0, opacity: 0.8 }}
    />
  );
};

// 2. Reusable Card Component
const DestinationCard = ({ planet }: { planet: any }) => {
  return (
    <div className="card-wrapper">
      <div className="card-content">
        <div className="planet-preview">
            {/* Procedural Planet rendering using CSS gradients */}
            <div className="planet-orb" style={{
                background: planet.color
            }}></div>
        </div>
        
        <div className="card-header">
            <div>
                <h3 className="planet-name">{planet.name}</h3>
                <div className="planet-type">{planet.type}</div>
            </div>
            <div className="distance-badge">{planet.distance} LY</div>
        </div>

        <div className="card-details">
            <div className="detail-item">
                Habitability
                <span style={{color: planet.habitability > 80 ? '#00ff9d' : '#ffaa00'}}>
                    {planet.habitability}%
                </span>
            </div>
            <div className="detail-item">
                Gravity
                <span>{planet.gravity} G</span>
            </div>
        </div>

        <button className="warp-btn">INITIATE JUMP</button>
      </div>
    </div>
  );
};

// 3. Main App
const App = () => {
  // Mock Data
  const planets = [
    { 
        name: "Kepler-186f", 
        type: "Super Earth", 
        distance: "582", 
        color: "radial-gradient(circle at 30% 30%, #ff5e5e, #960000)", 
        habitability: 88, 
        gravity: 1.2 
    },
    { 
        name: "Proxima B", 
        type: "Tidally Locked", 
        distance: "4.2", 
        color: "radial-gradient(circle at 30% 30%, #00f3ff, #0048ff)", 
        habitability: 75, 
        gravity: 1.1 
    },
    { 
        name: "Trappist-1e", 
        type: "Ocean World", 
        distance: "39", 
        color: "radial-gradient(circle at 30% 30%, #00ff9d, #005e3a)", 
        habitability: 95, 
        gravity: 0.9 
    },
    { 
        name: "HD 40307g", 
        type: "Gas Dwarf", 
        distance: "42", 
        color: "radial-gradient(circle at 30% 30%, #d400ff, #480066)", 
        habitability: 45, 
        gravity: 2.4 
    },
    { 
        name: "LHS 1140b", 
        type: "Rocky Super-Earth", 
        distance: "40", 
        color: "radial-gradient(circle at 30% 30%, #ffaa00, #8a4b00)", 
        habitability: 85, 
        gravity: 1.4 
    },
  ];

  const [fuelLevel, setFuelLevel] = useState(0);
  
  useEffect(() => {
    // Simulating boot up animation
    setTimeout(() => setFuelLevel(87), 500);
  }, []);

  return (
    <>
      <style>{styles}</style>
      <Starfield />
      
      <div className="app-container">
        <header>
          <div className="brand">
            <div className="brand-logo">A</div>
            <div className="brand-text">
              <h1>ASTRA NAVIS</h1>
              <p>Interstellar Navigation System</p>
            </div>
          </div>
          <div className="user-status">
            CMDR. SHEPARD <br />
            <span style={{color: '#00ff9d'}}>ONLINE</span>
          </div>
        </header>

        <div className="dashboard">
          {/* Sidebar Controls */}
          <aside className="sidebar">
            <div className="stat-panel" style={{textAlign: 'center'}}>
              <div className="hologram-circle">
                <div className="hologram-inner">
                  <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#fff'}}>WARP</div>
                </div>
              </div>
              <div style={{marginTop: '1rem', color: 'var(--holo-cyan)', letterSpacing: '2px'}}>ENGINE READY</div>
            </div>

            <div className="stat-panel">
              <div className="stat-label">Antimatter Fuel</div>
              <div className="stat-value">{fuelLevel}%</div>
              <div className="bar-container">
                <div className="bar-fill" style={{width: `${fuelLevel}%`}}></div>
              </div>
            </div>

            <div className="stat-panel">
              <div className="stat-label">Hull Integrity</div>
              <div className="stat-value" style={{color: '#00ff9d'}}>100%</div>
              <div className="bar-container">
                <div className="bar-fill" style={{width: '100%', background: '#00ff9d', boxShadow: '0 0 10px #00ff9d'}}></div>
              </div>
            </div>
            
            <div className="stat-panel" style={{borderColor: 'var(--alert-red)'}}>
               <div className="stat-label" style={{color: 'var(--alert-red)'}}>Alerts</div>
               <div style={{fontSize: '0.9rem', color: '#fff'}}>
                 • Meteoroid shower in Sector 7<br/>
                 • Proximity warning: Black Hole
               </div>
            </div>
          </aside>

          {/* Main Grid */}
          <main className="content-area">
            <div className="section-title">
                <span style={{color: 'var(--holo-cyan)'}}>01 //</span> 
                TARGET SELECTION
            </div>
            
            <div className="cards-grid">
              {planets.map((planet, idx) => (
                <DestinationCard key={idx} planet={planet} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
