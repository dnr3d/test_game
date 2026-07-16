import Phaser from 'phaser';
import playerSwordImg from '../public/assets/player_sword.svg';
import playerStaffImg from '../public/assets/player_staff.svg';
import playerBowImg from '../public/assets/player_bow.svg';
import slimeImg from '../public/assets/slime.svg';
import bgImg from '../public/assets/bg.png';

type WeaponType = 'sword' | 'staff' | 'bow';

class GameState {
  static selectedWeapon: WeaponType = 'sword';
  static weaponLevel: number = 1;
  static maxHp: number = 100;
  static speed: number = 200;
  static damageMultiplier: number = 1;
  static fireRateMultiplier: number = 1;
  static piercing: number = 1;
  static additionalProjectiles: number = 0;

  static reset() {
    this.weaponLevel = 1;
    this.maxHp = 100;
    this.speed = 200;
    this.damageMultiplier = 1;
    this.fireRateMultiplier = 1;
    this.piercing = 1;
    this.additionalProjectiles = 0;
  }
}

function createBtnInteractive(scene: Phaser.Scene, bg: Phaser.GameObjects.Rectangle, onClick: () => void) {
  bg.setInteractive();
  bg.on('pointerover', () => bg.setStrokeStyle(6, 0xffffff));
  bg.on('pointerout', () => { bg.setStrokeStyle(4, 0x555555); bg.setScale(1); });
  bg.on('pointerdown', () => scene.tweens.add({ targets: bg, scale: 0.95, duration: 50 }));
  bg.on('pointerup', () => {
    scene.tweens.add({ targets: bg, scale: 1, duration: 50 });
    onClick();
  });
}

class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }
  preload() {
    this.load.image('player_sword', playerSwordImg);
    this.load.image('player_staff', playerStaffImg);
    this.load.image('player_bow', playerBowImg);
    this.load.image('slime', slimeImg);
    this.load.image('bg_tex', bgImg);
    
    const g = this.make.graphics({x:0,y:0}, false);
    
    // Procedural Props (no white background glitch)
    g.fillStyle(0x666666); g.fillCircle(16, 16, 16); g.generateTexture('rock_tex', 32, 32); g.clear();
    g.fillStyle(0x8b4513); g.fillRect(0, 0, 32, 32); g.lineStyle(4, 0x4a2e00); g.strokeRect(0, 0, 32, 32); g.generateTexture('crate_tex', 32, 32); g.clear();
    
    // Shadow
    g.fillStyle(0x000000, 0.4); g.fillEllipse(32, 16, 64, 32);
    g.generateTexture('shadow', 64, 32); g.clear();

    // Particle
    g.fillStyle(0xffffff); g.fillCircle(4, 4, 4);
    g.generateTexture('particle', 8, 8); g.clear();
    
    // Weapons (Visuals for hand)
    g.fillStyle(0xaaaaaa); g.fillRect(14, 0, 4, 32); g.fillStyle(0x8b4513); g.fillRect(10, 24, 12, 4); g.generateTexture('sword', 32, 36); g.clear();
    g.fillStyle(0xffd700); g.fillRect(10, 0, 12, 36); g.generateTexture('sword_evo', 32, 36); g.clear(); 
    g.fillStyle(0x8b4513); g.fillRect(14, 0, 4, 32); g.fillStyle(0x00ffff); g.fillCircle(16, 4, 8); g.generateTexture('staff', 32, 32); g.clear();
    g.fillStyle(0x222222); g.fillRect(14, 0, 4, 32); g.fillStyle(0xff00ff); g.fillCircle(16, 4, 12); g.generateTexture('staff_evo', 32, 32); g.clear(); 
    g.lineStyle(4, 0x8b4513); g.beginPath(); g.arc(16, 16, 14, -Math.PI/2, Math.PI/2); g.strokePath(); g.lineStyle(1, 0xffffff); g.lineBetween(16, 2, 16, 30); g.generateTexture('bow', 32, 32); g.clear();
    g.lineStyle(6, 0x555555); g.beginPath(); g.arc(16, 16, 14, -Math.PI/2, Math.PI/2); g.strokePath(); g.lineStyle(2, 0xff0000); g.lineBetween(16, 2, 16, 30); g.generateTexture('bow_evo', 32, 32); g.clear(); 
    
    // Projectiles
    g.fillStyle(0x00ffff); g.fillCircle(8, 8, 8); g.generateTexture('orb', 16, 16); g.clear();
    g.fillStyle(0xff00ff); g.fillCircle(12, 12, 12); g.generateTexture('orb_evo', 24, 24); g.clear();
    g.fillStyle(0x8b4513); g.fillRect(0, 6, 16, 4); g.fillStyle(0xaaaaaa); g.fillTriangle(16, 4, 24, 8, 16, 12); g.generateTexture('arrow', 24, 16); g.clear();
    g.fillStyle(0xcc0000); g.fillRect(0, 6, 16, 4); g.fillStyle(0xffffff); g.fillTriangle(16, 4, 24, 8, 16, 12); g.generateTexture('arrow_evo', 24, 16); g.clear();
    g.fillStyle(0x0000ff); g.fillTriangle(8, 0, 16, 8, 8, 16); g.fillTriangle(8, 0, 0, 8, 8, 16); g.generateTexture('gem', 16, 16); g.clear();
  }
  create() { this.scene.start('TitleScene'); }
}

class TitleScene extends Phaser.Scene {
  constructor() { super('TitleScene'); }
  create() {
    this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'bg_tex').setOrigin(0).setTint(0x777777);
    
    let title = this.add.text(this.scale.width/2, this.scale.height * 0.3, 'MEDIEVAL\nSURVIVORS', { fontFamily: 'Fredoka One', fontSize: '48px', color: '#ffd700', stroke: '#000', strokeThickness: 8, align: 'center' }).setOrigin(0.5);
    title.setShadow(3, 3, '#000', 4, true, true);

    const playBtn = this.add.rectangle(this.scale.width/2, this.scale.height * 0.6, 220, 70, 0x228b22, 1).setInteractive();
    playBtn.setStrokeStyle(6, 0x000000);
    this.add.text(this.scale.width/2, this.scale.height * 0.6, 'PLAY', { fontFamily: 'Fredoka One', fontSize: '36px', color: '#fff', stroke: '#000', strokeThickness: 5 }).setOrigin(0.5);
    
    playBtn.on('pointerdown', () => {
       this.tweens.add({ targets: playBtn, scale: 0.9, duration: 100, yoyo: true, onComplete: () => this.scene.start('MenuScene') });
    });
  }
}

class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene'); }
  create() {
    GameState.reset();
    this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'bg_tex').setOrigin(0).setTint(0x444444);
    
    this.add.text(this.scale.width/2, 60, 'CHOOSE CLASS', { fontFamily: 'Fredoka One', fontSize: '36px', color: '#fff', stroke: '#000', strokeThickness: 6 }).setOrigin(0.5).setShadow(3, 3, '#000', 0, true, true);

    const cx = this.scale.width / 2;
    const spacing = 130;
    const startY = 160;

    this.createClass(cx, startY, 'player_sword', 'sword', 'KNIGHT', 'Cleave Attack');
    this.createClass(cx, startY + spacing, 'player_staff', 'staff', 'MAGE', 'Homing Orbs');
    this.createClass(cx, startY + spacing * 2, 'player_bow', 'bow', 'RANGER', 'Fast Arrows');
  }

  createClass(x: number, y: number, tex: string, wp: WeaponType, name: string, desc: string) {
    const cardW = Math.min(this.scale.width * 0.85, 400);
    const bg = this.add.rectangle(x, y, cardW, 110, 0x222222, 0.8);
    bg.setStrokeStyle(4, 0x555555);
    
    const img = this.add.image(x - cardW/2 + 60, y, tex).setScale(1.2);
    
    this.add.text(x - cardW/2 + 130, y - 20, name, { fontFamily: 'Fredoka One', fontSize: '28px', color: '#ffd700', stroke: '#000', strokeThickness: 5 }).setOrigin(0, 0.5);
    this.add.text(x - cardW/2 + 130, y + 20, desc, { fontFamily: 'Fredoka One', fontSize: '18px', color: '#fff' }).setOrigin(0, 0.5);
    
    this.tweens.add({ targets: img, y: y - 5, yoyo: true, repeat: -1, duration: 600 + Math.random()*200, ease: 'Sine.easeInOut' });
    
    createBtnInteractive(this, bg, () => {
       GameState.selectedWeapon = wp; 
       this.scene.start('GameScene');
    });
  }
}

class GameScene extends Phaser.Scene {
  private playerBody!: Phaser.Physics.Arcade.Sprite;
  private playerVisual!: Phaser.GameObjects.Image;
  private playerShadow!: Phaser.GameObjects.Image;
  private weaponVisual!: Phaser.GameObjects.Image;
  
  private bg!: Phaser.GameObjects.TileSprite;
  private enemies!: Phaser.Physics.Arcade.Group;
  private projectiles!: Phaser.Physics.Arcade.Group;
  private gems!: Phaser.Physics.Arcade.Group;
  private rocks!: Phaser.Physics.Arcade.StaticGroup;
  private crates!: Phaser.Physics.Arcade.Group;
  
  private lastFired = 0;
  private enemyRate = 1000;
  private lastSpawn = 0;

  private hp = 100;
  private xp = 0;
  private level = 1;
  private xpNext = 5;

  private hpBar!: Phaser.GameObjects.Graphics;
  private xpBar!: Phaser.GameObjects.Graphics;
  private lvlText!: Phaser.GameObjects.Text;
  
  private joyData = { act: false, sx: 0, sy: 0, dx: 0, dy: 0 };
  private joyBase!: Phaser.GameObjects.Arc;
  private joyThumb!: Phaser.GameObjects.Arc;
  private isMagnetActive = false;
  
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: any;

  constructor() { super('GameScene'); }

  create() {
    this.hp = GameState.maxHp;
    this.xp = 0; this.level = 1; this.enemyRate = 1000;
    this.isMagnetActive = false;

    this.physics.world.setBounds(-2000, -2000, 4000, 4000);
    this.bg = this.add.tileSprite(0, 0, this.scale.width*2, this.scale.height*2, 'bg_tex').setScrollFactor(0);
    this.bg.setTint(0xcccccc); // slightly darker for contrast

    this.rocks = this.physics.add.staticGroup();
    for(let i=0; i<150; i++) {
      let rx = Phaser.Math.Between(-1900, 1900);
      let ry = Phaser.Math.Between(-1900, 1900);
      if (Math.abs(rx) > 200 || Math.abs(ry) > 200) { 
        let s = Phaser.Math.FloatBetween(0.8, 1.2);
        this.add.image(rx, ry + 15*s, 'shadow').setScale(s*1.2).setDepth(2);
        let r = this.rocks.create(rx, ry, 'rock_tex');
        r.setScale(s).setDepth(3); 
        r.refreshBody(); r.setCircle(r.width/4, r.width/4, r.width/4);
      }
    }

    this.enemies = this.physics.add.group();
    this.projectiles = this.physics.add.group();
    this.gems = this.physics.add.group();
    this.crates = this.physics.add.group();

    // Player setup
    this.playerBody = this.physics.add.sprite(0, 0, 'particle').setVisible(false);
    this.playerBody.setCollideWorldBounds(true).setCircle(20);
    this.cameras.main.startFollow(this.playerBody);
    
    this.playerShadow = this.add.image(0, 15, 'shadow').setScale(1.2).setDepth(4);
    this.playerVisual = this.add.image(0, 0, `player_${GameState.selectedWeapon}`).setScale(0.5).setDepth(10);
    this.weaponVisual = this.add.image(15, 0, GameState.selectedWeapon).setDepth(11);
    
    this.physics.add.collider(this.playerBody, this.rocks);
    this.physics.add.collider(this.enemies, this.rocks);
    this.physics.add.collider(this.enemies, this.enemies); 
    this.physics.add.collider(this.projectiles, this.rocks, this.hitRock as any, undefined, this);
    this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy as any, undefined, this);
    this.physics.add.overlap(this.playerBody, this.enemies, this.hitPlayer as any, undefined, this);
    this.physics.add.overlap(this.playerBody, this.gems, this.getGem as any, undefined, this);
    this.physics.add.overlap(this.playerBody, this.crates, this.getCrate as any, undefined, this);

    // UI Setup
    this.hpBar = this.add.graphics().setScrollFactor(0).setDepth(100);
    this.xpBar = this.add.graphics().setScrollFactor(0).setDepth(100);
    this.lvlText = this.add.text(this.scale.width - 20, 50, '', { fontFamily: 'Fredoka One', fontSize: '26px', color: '#fff', stroke: '#000', strokeThickness: 5 }).setOrigin(1, 0).setScrollFactor(0).setDepth(100).setShadow(2, 2, '#000', 0, true, true);
    
    this.add.text(20, 15, 'XP', {fontFamily: 'Fredoka One', fontSize: '18px', color: '#0ff', stroke: '#000', strokeThickness: 4}).setScrollFactor(0).setDepth(100);
    this.add.text(20, 45, 'HP', {fontFamily: 'Fredoka One', fontSize: '18px', color: '#f00', stroke: '#000', strokeThickness: 4}).setScrollFactor(0).setDepth(100);
    this.updUI();

    // Joystick
    this.joyBase = this.add.circle(0,0,50,0xffffff,0.2).setScrollFactor(0).setDepth(90).setVisible(false);
    this.joyThumb = this.add.circle(0,0,25,0xffffff,0.5).setScrollFactor(0).setDepth(91).setVisible(false);

    this.input.on('pointerdown', (p: any) => {
      this.joyData.act = true; this.joyData.sx = p.x; this.joyData.sy = p.y;
      this.joyBase.setPosition(p.x, p.y).setVisible(true);
      this.joyThumb.setPosition(p.x, p.y).setVisible(true);
    });
    this.input.on('pointermove', (p: any) => {
      if(!this.joyData.act) return;
      let dx=p.x-this.joyData.sx, dy=p.y-this.joyData.sy, dist=Math.sqrt(dx*dx+dy*dy);
      if(dist>50){ dx=(dx/dist)*50; dy=(dy/dist)*50; }
      this.joyThumb.setPosition(this.joyData.sx+dx, this.joyData.sy+dy);
      if(dist>0){ this.joyData.dx=dx/50; this.joyData.dy=dy/50; }
    });
    this.input.on('pointerup', () => {
      this.joyData.act=false; this.joyData.dx=0; this.joyData.dy=0;
      this.joyBase.setVisible(false); this.joyThumb.setVisible(false);
    });

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = this.input.keyboard!.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });

    this.scale.on('resize', this.onResize, this);
  }
  
  onResize(gs: Phaser.Structs.Size) {
    if(this.lvlText) this.lvlText.setX(gs.width - 20);
    this.updUI();
  }

  update(t: number) {
    if (this.hp <= 0) return;
    this.bg.tilePositionX = this.cameras.main.scrollX; 
    this.bg.tilePositionY = this.cameras.main.scrollY;
    
    let kx = 0; let ky = 0;
    if (this.cursors.left.isDown || this.wasd.left.isDown) kx = -1;
    else if (this.cursors.right.isDown || this.wasd.right.isDown) kx = 1;
    if (this.cursors.up.isDown || this.wasd.up.isDown) ky = -1;
    else if (this.cursors.down.isDown || this.wasd.down.isDown) ky = 1;
    if (kx !== 0 && ky !== 0) { kx *= 0.7071; ky *= 0.7071; }
    
    let dx = this.joyData.act ? this.joyData.dx : kx;
    let dy = this.joyData.act ? this.joyData.dy : ky;

    this.playerBody.setVelocity(dx * GameState.speed, dy * GameState.speed);
    
    // Smooth follow visuals
    this.playerVisual.setPosition(this.playerBody.x, this.playerBody.y - 10);
    this.playerShadow.setPosition(this.playerBody.x, this.playerBody.y + 15);
    
    // Walk Animation Wobble
    if(dx !== 0 || dy !== 0) {
      this.playerVisual.setFlipX(dx < 0);
      this.playerVisual.angle = Math.sin(t / 80) * 10;
      this.weaponVisual.setFlipX(dx < 0);
      this.weaponVisual.setPosition(this.playerBody.x + (dx < 0 ? -20 : 20), this.playerBody.y);
    } else {
      this.playerVisual.angle = 0;
      this.weaponVisual.setPosition(this.playerBody.x + (this.playerVisual.flipX ? -20 : 20), this.playerBody.y);
    }

    if (t > this.lastSpawn + this.enemyRate) {
      this.spawn(); this.lastSpawn = t;
      if (this.enemyRate > 200) this.enemyRate -= 5;
    }
    
    this.enemies.getChildren().forEach(c => {
      let e = c as Phaser.Physics.Arcade.Sprite;
      if(e.active) { 
        this.physics.moveToObject(e, this.playerBody, 70); 
        e.setFlipX(e.body!.velocity.x < 0); 
        e.angle = Math.sin(t / 100 + e.x) * 15; // wobble
        if(e.getData('shadow')) e.getData('shadow').setPosition(e.x, e.y + 15);
      }
    });

    if (this.isMagnetActive) {
      this.gems.getChildren().forEach(c => {
        let g = c as Phaser.Physics.Arcade.Sprite;
        if(g.active) this.physics.moveToObject(g, this.playerBody, 600);
      });
    }

    const fireDelay = (GameState.selectedWeapon === 'sword' ? 1200 : 800) / GameState.fireRateMultiplier;
    if (t > this.lastFired + fireDelay) {
      this.attack(); this.lastFired = t;
    }
  }

  spawn() {
    let a=Math.random()*Math.PI*2, d=Math.max(this.scale.width, this.scale.height)/1.2;
    let sx = this.playerBody.x+Math.cos(a)*d, sy = this.playerBody.y+Math.sin(a)*d;
    let e = this.enemies.create(sx, sy, 'slime') as any;
    e.setScale(0.5).setDepth(5).hp = 10 * GameState.weaponLevel;
    e.setCircle(45, 19, 19);
    
    let sh = this.add.image(sx, sy, 'shadow').setScale(0.8).setDepth(4);
    e.setData('shadow', sh);
    e.on('destroy', () => sh.destroy());

    if (Math.random() < 0.05) {
      let cx = this.playerBody.x+Math.cos(a)*d*0.8;
      let cy = this.playerBody.y+Math.sin(a)*d*0.8;
      let shc = this.add.image(cx, cy+15, 'shadow').setScale(1.2).setDepth(4);
      let c = this.crates.create(cx, cy, 'crate_tex');
      c.setScale(1.2).setDepth(5);
      c.on('destroy', () => shc.destroy());
      this.tweens.add({ targets: c, y: c.y - 10, yoyo: true, repeat: -1, duration: 1000, ease: 'Sine.easeInOut' });
    }
  }

  attack() {
    let nd=Infinity, ne: any=null;
    this.enemies.getChildren().forEach(c => {
      let e=c as Phaser.Physics.Arcade.Sprite;
      if(e.active){ let d=Phaser.Math.Distance.BetweenPoints(this.playerBody,e); if(d<nd){ nd=d; ne=e; } }
    });
    if(!ne || nd>600) return;

    let ang = Phaser.Math.Angle.BetweenPoints(this.playerBody, ne);
    let evo = GameState.weaponLevel >= 10;
    
    // Attack Animation (Weapon Swing/Thrust)
    this.tweens.add({
      targets: this.weaponVisual,
      angle: this.playerVisual.flipX ? -60 : 60,
      x: this.weaponVisual.x + Math.cos(ang)*20,
      y: this.weaponVisual.y + Math.sin(ang)*20,
      yoyo: true,
      duration: 150
    });

    if(GameState.selectedWeapon==='sword'){
      let tex = evo ? 'sword_evo' : 'sword';
      let s = this.projectiles.create(this.playerBody.x+Math.cos(ang)*40, this.playerBody.y+Math.sin(ang)*40, tex) as any;
      s.setScale(evo?2.5:1.5).setRotation(ang+Math.PI/2).setDepth(15).setBlendMode(Phaser.BlendModes.ADD);
      s.body.setSize(evo?100:60, evo?100:60);
      s.pierce = 999;
      this.tweens.add({ targets:s, angle:s.angle+(evo?360:180), duration:evo?300:200, onComplete:()=>s.destroy() });
    }
    else if(GameState.selectedWeapon==='staff') {
      let cnt = evo ? 3 : 1 + GameState.additionalProjectiles;
      for(let i=0; i<cnt; i++) {
        this.time.delayedCall(i*100, () => {
          let o = this.projectiles.create(this.playerBody.x, this.playerBody.y, evo?'orb_evo':'orb') as any;
          o.pierce = GameState.piercing + (evo?2:0);
          o.setBlendMode(Phaser.BlendModes.ADD);
          this.physics.moveToObject(o, ne, evo?400:300);
          this.addParticleTrail(o, evo?0xff00ff:0x00ffff);
          this.time.delayedCall(2000, ()=> { if(o.active) o.destroy(); });
        });
      }
    }
    else if(GameState.selectedWeapon==='bow') {
      let cnt = evo ? 5 : 1 + GameState.additionalProjectiles;
      let spread = 0.2;
      for(let i=0; i<cnt; i++) {
        let a = ang - (spread*(cnt-1)/2) + (spread*i);
        let ar = this.projectiles.create(this.playerBody.x, this.playerBody.y, evo?'arrow_evo':'arrow') as any;
        ar.setRotation(a); ar.pierce = GameState.piercing + (evo?5:0);
        this.physics.velocityFromRotation(a, evo?800:600, ar.body.velocity);
        this.addParticleTrail(ar, 0xffffff);
        this.time.delayedCall(1500, ()=> { if(ar.active) ar.destroy(); });
      }
    }
  }

  addParticleTrail(target: Phaser.Physics.Arcade.Sprite, color: number) {
    let particles = this.add.particles(0, 0, 'particle', {
      speed: 20, scale: { start: 1.5, end: 0 }, alpha: { start: 1, end: 0 },
      tint: color, lifespan: 300, blendMode: 'ADD'
    });
    particles.startFollow(target);
    target.on('destroy', () => { particles.stop(); this.time.delayedCall(300, ()=>particles.destroy()); });
  }

  hitRock(p: any, _r: any) {
    if(p.texture.key!=='sword' && p.texture.key!=='sword_evo') p.destroy();
  }

  hitEnemy(p: any, e: any) {
    if(!p.active || !e.active) return;
    let dmg = 10 * GameState.damageMultiplier * (GameState.weaponLevel >= 10 ? 3 : 1);
    e.hp -= dmg;
    
    e.setTintFill(0xffffff);
    this.time.delayedCall(100, () => { if(e.active) e.clearTint(); });

    if(e.hp <= 0) {
      this.gems.create(e.x, e.y, 'gem').setDepth(1);
      let pEx = this.add.particles(e.x, e.y, 'particle', {
        speed: 80, scale: { start: 2, end: 0 }, tint: 0x00ff00, lifespan: 400, quantity: 15, blendMode: 'ADD'
      });
      pEx.explode(15);
      this.time.delayedCall(400, ()=>pEx.destroy());
      e.destroy();
    }
    
    if(p.texture.key!=='sword' && p.texture.key!=='sword_evo') {
      p.pierce--; if(p.pierce<=0) p.destroy();
    }
  }

  hitPlayer(_p: any, e: any) {
    if(!e.active) return;
    this.hp -= 10; e.destroy(); this.updUI();
    
    this.cameras.main.shake(100, 0.01);
    this.playerVisual.setTint(0xff0000);
    this.time.delayedCall(150, () => { if(this.playerVisual.active) this.playerVisual.clearTint(); });

    if(this.hp<=0){
      this.playerVisual.setTint(0xff0000); this.physics.pause();
      this.time.delayedCall(2000, ()=>this.scene.start('TitleScene'));
    }
  }

  getGem(_p: any, g: any) {
    g.destroy(); this.xp++;
    if(this.xp>=this.xpNext) {
      this.level++; this.xp=0; this.xpNext=Math.floor(this.xpNext*1.4);
      this.scene.pause(); this.scene.launch('UpgradeScene');
    }
    this.updUI();
  }

  getCrate(_p: any, c: any) {
    c.destroy();
    let r = Math.random();
    if(r < 0.33) {
      this.cameras.main.shake(500, 0.05);
      let flash = this.add.rectangle(this.cameras.main.scrollX, this.cameras.main.scrollY, 4000, 4000, 0xffffff).setOrigin(0).setDepth(200);
      this.tweens.add({targets:flash, alpha:0, duration:500, onComplete:()=>flash.destroy()});
      this.enemies.getChildren().forEach(e => {
        let en = e as Phaser.Physics.Arcade.Sprite;
        if(en.active && this.cameras.main.worldView.contains(en.x, en.y)) {
           this.gems.create(en.x, en.y, 'gem').setDepth(1); en.destroy();
        }
      });
    } else if(r < 0.66) {
      this.isMagnetActive = true; this.time.delayedCall(2000, () => this.isMagnetActive = false);
    } else {
      this.hp = Math.min(GameState.maxHp, this.hp + GameState.maxHp/2);
      this.updUI();
      let healTx = this.add.text(this.playerBody.x, this.playerBody.y - 30, '+HEAL', {fontFamily: 'Fredoka One', fontSize:'28px',color:'#0f0', stroke:'#000', strokeThickness:5}).setOrigin(0.5).setDepth(100);
      this.tweens.add({targets:healTx, y: healTx.y-50, alpha:0, duration:1000, onComplete:()=>healTx.destroy()});
    }
  }

  updUI(){ 
    const bw = Math.min(this.scale.width - 100, 300);
    
    // XP Bar
    this.xpBar.clear();
    this.xpBar.fillStyle(0x000000, 0.8); this.xpBar.fillRect(50, 15, bw, 20);
    this.xpBar.fillStyle(0x00ffff, 1); this.xpBar.fillRect(52, 17, (bw-4) * (this.xp/this.xpNext), 16);
    this.xpBar.lineStyle(2, 0xffffff); this.xpBar.strokeRect(50, 15, bw, 20);

    // HP Bar
    this.hpBar.clear();
    this.hpBar.fillStyle(0x000000, 0.8); this.hpBar.fillRect(50, 45, bw, 20);
    this.hpBar.fillStyle(0xff0000, 1); this.hpBar.fillRect(52, 47, (bw-4) * (this.hp/GameState.maxHp), 16);
    this.hpBar.lineStyle(2, 0xffffff); this.hpBar.strokeRect(50, 45, bw, 20);

    this.lvlText.setText(`LVL: ${this.level}`);
  }
}

class UpgradeScene extends Phaser.Scene {
  constructor() { super('UpgradeScene'); }
  create() {
    this.add.rectangle(0,0,this.scale.width,this.scale.height,0x000000,0.85).setOrigin(0);
    this.add.text(this.scale.width/2, 60, 'LEVEL UP!', {fontFamily: 'Fredoka One', fontSize:'48px',color:'#ffd700', stroke:'#000', strokeThickness:8}).setOrigin(0.5).setShadow(3, 3, '#000', 0, true, true);

    let upgrades = [
      { t: 'Weapon Up', d: 'Increase Weapon Level', fn: ()=>GameState.weaponLevel++ },
      { t: 'Max HP', d: '+20 Max Health', fn: ()=>GameState.maxHp+=20 },
      { t: 'Speed', d: 'Move faster', fn: ()=>GameState.speed+=30 },
      { t: 'Damage', d: '+20% Damage', fn: ()=>GameState.damageMultiplier+=0.2 },
      { t: 'Fire Rate', d: '+20% Attack Speed', fn: ()=>GameState.fireRateMultiplier+=0.2 },
      { t: 'Projectiles', d: '+1 Projectile', fn: ()=>GameState.additionalProjectiles++ },
      { t: 'Piercing', d: '+1 Enemy Pierce', fn: ()=>GameState.piercing++ }
    ];
    
    Phaser.Utils.Array.Shuffle(upgrades);
    let picks = upgrades.slice(0, 3);
    
    const cx = this.scale.width/2;
    const startY = 160;
    const spacing = 130;
    const cardW = Math.min(this.scale.width * 0.9, 450);
    
    picks.forEach((u, i) => {
      let y = startY + i*spacing;
      let bg = this.add.rectangle(cx, y, cardW, 110, 0x222222, 0.9);
      bg.setStrokeStyle(4, 0x8b0000);
      
      this.add.text(cx, y-20, u.t, {fontFamily: 'Fredoka One', fontSize:'28px',color:'#fff', stroke:'#000', strokeThickness:5}).setOrigin(0.5);
      this.add.text(cx, y+20, u.d, {fontFamily: 'Fredoka One', fontSize:'18px',color:'#ccc'}).setOrigin(0.5);
      
      createBtnInteractive(this, bg, () => {
         u.fn(); this.scene.stop(); this.scene.resume('GameScene');
      });
    });
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO, width: window.innerWidth, height: window.innerHeight, parent: 'game-container',
  physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 0 }, debug: false } },
  scene: [BootScene, TitleScene, MenuScene, GameScene, UpgradeScene],
  scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH }
};
new Phaser.Game(config);
