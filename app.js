const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");
let projectiles = [];
let enemies = [];
let particles = [];
let animationID = undefined;
let score = 0;


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = new Player({
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: window.innerWidth/60,
  color: "white",
});

document.body.appendChild(canvas);

function animate() {
  if (animationID % 120 == 0 || animationID == undefined) {
    let x; 
    let y;

    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - player.radius : canvas.width + player.radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - player.radius : canvas.height + player.radius;
    }

    const angle = Math.atan2(player.y - y, player.x - x);

    const velocity = {
      x: Math.cos(angle) * 2,
      y: Math.sin(angle) * 2,
    };

    enemies.push(
      new Enemy({
        x: x,
        y: y,
        radius: Math.random() * (window.innerWidth/60 - 10) + 10,
        color: `hsl(${Math.floor(Math.random() * 360)}, 50%, 50%)`,
        velocity: velocity,
      })
    );
  }

  animationID = requestAnimationFrame(animate);

  context.fillStyle = "rgba(0,0,0,0.1)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  player.draw(context);

  projectiles.forEach((projectile, index) => {
    if (
      projectile.x + projectile.radius >= canvas.width ||
      projectile.x - projectile.radius <= 0 ||
      projectile.y - projectile.radius <= 0 ||
      projectile.y + projectile.radius >= canvas.height
    ) {
      projectiles.splice(index, 1);
    }

    projectile.draw(context);
    projectile.update();
  });

  particles.forEach((particle, idx) => {
    if (particle.alpha < 0) {
      setTimeout(() => {
        particles.splice(idx, 1);
      }, 0)
    } else {
      particle.draw(context);
      particle.update();
    }

  }); 

  enemies.forEach((enemy, index) => {
    const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);

    if (
      distance - enemy.radius - player.radius < 1
    ) {
      document.querySelector('.gameover').classList.remove('hidden');
      document.querySelector('.points').children[0].innerHTML = score;
      document.querySelector('.restart').addEventListener('click', Restart);
      cancelAnimationFrame(animationID);
    }

    if (
      enemy.x + enemy.radius >= canvas.width + 200 ||
      enemy.x - enemy.radius <= 0 - 200 ||
      enemy.y - enemy.radius <= 0 - 200 ||
      enemy.y + enemy.radius >= canvas.height + 200
    ) {
      enemies.splice(index, 1);
    }

    projectiles.map((projectile, projectileIdx) => {
      const distance = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

      if (distance - projectile.radius - enemy.radius < 1) {
        score += 100;

        for (let i = 0; i < enemy.radius * 2; i++) {
          particles.push(new Particle(
            {
              x: projectile.x,
              y: projectile.y,
              color: enemy.color,
              radius: 3,
              velocity: {
                x: (Math.random() - 0.5) * (Math.random() * 8),
                y: (Math.random() - 0.5) * (Math.random() * 8)
              }
            }
          ))
        }

        if (enemy.radius - 10 > 10) {
          gsap.to(enemy, {
            radius: enemy.radius - 10
          });
          setTimeout(() => {
            projectiles.splice(projectileIdx, 1);
          }, 0);
        } else {
          setTimeout(() => {
            projectiles.splice(projectileIdx, 1);
            enemies.splice(index, 1);
          }, 0);
        }
      }
    });

    enemy.draw(context);
    enemy.update();
  });


}

window.addEventListener("click", (e) => {
  const angle = Math.atan2(e.clientY - player.y, e.clientX - player.x);

  const velocity = {
    x: Math.cos(angle) * 6,
    y: Math.sin(angle) * 6,
  };

  projectiles.push(
    new Projectile({
      x: player.x,
      y: player.y,
      radius: 3,
      color: player.radius,
      velocity: velocity,
    })
  );
});

animate();


function Restart() {
  particles = []
  enemies = []
  particles = []
  score = 0;
  document.querySelector('.gameover').classList.add('hidden');

  animate();
}