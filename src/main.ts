import Phaser from 'phaser';

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
  bg.on('pointerover', () => bg.setFillStyle(0x555555));
  bg.on('pointerout', () => { bg.setFillStyle(0x333333); bg.setScale(1); });
  bg.on('pointerdown', () => scene.tweens.add({ targets: bg, scale: 0.95, duration: 50 }));
  bg.on('pointerup', () => {
    scene.tweens.add({ targets: bg, scale: 1, duration: 50 });
    onClick();
  });
}

class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }
  preload() {
    this.load.image('player_sword', '/assets/player_sword.png');
    this.load.image('player_staff', '/assets/player_staff.png');
    this.load.image('player_bow', '/assets/player_bow.png');
    this.load.image('slime', '/assets/slime.png');

    const g = this.make.graphics({x:0,y:0}, false);
    
    // Minimalist Background
    g.fillStyle(0x1a1a1a); g.fillRect(0, 0, 128, 128);
    g.lineStyle(2, 0x222222); g.strokeRect(0, 0, 128, 128);
    g.generateTexture('bg_minimal', 128, 128); g.clear();

    // Rock (Obstacle)
    g.fillStyle(0x444444); g.fillCircle(16, 16, 16);
    g.fillStyle(0x666666); g.fillCircle(12, 12, 8);
    g.generateTexture('rock', 32, 32); g.clear();

    // Crate (Bonus)
    g.fillStyle(0x8b4513); g.fillRect(0, 0, 32, 32);
    g.lineStyle(2, 0x5c2e0b); g.strokeRect(0, 0, 32, 32);
    g.lineBetween(0, 0, 32, 32); g.lineBetween(32, 0, 0, 32);
    g.generateTexture('crate', 32, 32); g.clear();

    // Particle
    g.fillStyle(0xffffff); g.fillCircle(4, 4, 4);
    g.generateTexture('particle', 8, 8); g.clear();
    
    // Weapons
    g.fillStyle(0xaaaaaa); g.fillRect(14, 0, 4, 24); g.fillStyle(0x8b4513); g.fillRect(10, 24, 12, 4); g.fillRect(14, 28, 4, 8); g.generateTexture('sword', 32, 36); g.clear();
    g.fillStyle(0xffd700); g.fillRect(10, 0, 12, 36); g.fillStyle(0x00ffff); g.fillRect(8, 0, 16, 8); g.generateTexture('sword_evo', 32, 36); g.clear(); 
    g.fillStyle(0x8b4513); g.fillRect(14, 8, 4, 24); g.fillStyle(0x00ffff); g.fillCircle(16, 8, 8); g.generateTexture('staff', 32, 32); g.clear();
    g.fillStyle(0x222222); g.fillRect(14, 8, 4, 24); g.fillStyle(0xff00ff); g.fillCircle(16, 8, 12); g.generateTexture('staff_evo', 32, 32); g.clear(); 
    g.lineStyle(4, 0x8b4513); g.beginPath(); g.arc(16, 16, 14, -Math.PI/2, Math.PI/2); g.strokePath(); g.lineStyle(1, 0xffffff); g.lineBetween(16, 2, 16, 30); g.generateTexture('bow', 32, 32); g.clear();
    g.lineStyle(6, 0x555555); g.beginPath(); g.arc(16, 16, 14, -Math.PI/2, Math.PI/2); g.strokePath(); g.lineStyle(2, 0xff0000); g.lineBetween(16, 2, 16, 30); g.generateTexture('bow_evo', 32, 32); g.clear(); 
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
    this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'bg_minimal').setOrigin(0);
    this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.5).setOrigin(0);
    
    let title = this.add.text(this.scale.width/2, this.scale.height * 0.3, 'MEDIEVAL\nSURVIVORS', { fontSize: '48px', color: '#ffd700', stroke: '#000', strokeThickness: 6, align: 'center' }).setOrigin(0.5);
    title.setShadow(2, 2, '#000', 4, true, true);

    const playBtn = this.add.rectangle(this.scale.width/2, this.scale.height * 0.6, 200, 60, 0x228b22).setInteractive();
    playBtn.setStrokeStyle(4, 0x000000);
    this.add.text(this.scale.width/2, this.scale.height * 0.6, 'PLAY', { fontSize: '32px', color: '#fff', stroke: '#000', strokeThickness: 4 }).setOrigin(0.5);
    
    playBtn.on('pointerdown', () => {
       this.tweens.add({ targets: playBtn, scale: 0.9, duration: 100, yoyo: true, onComplete: () => this.scene.start('MenuScene') });
    });

    if ((window as any).Capacitor) {
      const exitBtn = this.add.rectangle(this.scale.width/2, this.scale.height * 0.75, 200, 60, 0x8b0000).setInteractive();
      exitBtn.setStrokeStyle(4, 0x000000);
      this.add.text(this.scale.width/2, this.scale.height * 0.75, 'EXIT', { fontSize: '32px', color: '#fff', stroke: '#000', strokeThickness: 4 }).setOrigin(0.5);
      exitBtn.on('pointerdown', () => { (window as any).Capacitor.Plugins.App.exitApp(); });
    }
  }
}

class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene'); }
  create() {
    GameState.reset();
    this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'bg_minimal').setOrigin(0);
    this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.8).setOrigin(0);
    
    this.add.text(this.scale.width/2, 60, 'CHOOSE CLASS', { fontSize: '36px', color: '#fff', stroke: '#000', strokeThickness: 6 }).setOrigin(0.5).setShadow(2, 2, '#000', 0, true, true);

    const cx = this.scale.width / 2;
    const spacing = 120;
    const startY = 160;

    this.createClass(cx, startY, 'player_sword', 'sword', 'KNIGHT', 'Cleave Attack');
    this.createClass(cx, startY + spacing, 'player_staff', 'staff', 'MAGE', 'Homing Orbs');
    this.createClass(cx, startY + spacing * 2, 'player_bow', 'bow', 'RANGER', 'Fast Arrows');
  }

  createClass(x: number, y: number, tex: string, wp: WeaponType, name: string, desc: string) {
    const cardW = Math.min(this.scale.width * 0.85, 360);
    const bg = this.add.rectangle(x, y, cardW, 100, 0x333333);
    bg.setStrokeStyle(4, 0x555555);
    
    const img = this.add.image(x - cardW/2 + 50, y, tex).setScale(1.2);
    
    this.add.text(x - cardW/2 + 110, y - 15, name, { fontSize: '24px', color: '#ffd700', stroke: '#000', strokeThickness: 4 }).setOrigin(0, 0.5);
    this.add.text(x - cardW/2 + 110, y + 15, desc, { fontSize: '16px', color: '#ccc' }).setOrigin(0, 0.5);
    
    // Idle animation for menu
    this.tweens.add({ targets: img, scaleY: 1.3, scaleX: 1.1, yoyo: true, repeat: -1, duration: 600 + Math.random()*200 });
    
    createBtnInteractive(this, bg, () => {
       GameState.selectedWeapon = wp; 
       this.scene.start('GameScene');
    });
  }
}

class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
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

  private hpText!: Phaser.GameObjects.Text;
  private lvlText!: Phaser.GameObjects.Text;
  
  private joyData = { act: false, sx: 0, sy: 0, dx: 0, dy: 0 };
  private joyBase!: Phaser.GameObjects.Arc;
  private joyThumb!: Phaser.GameObjects.Arc;
  private playerTween!: Phaser.Tweens.Tween;
  private isMagnetActive = false;

  constructor() { super('GameScene'); }

  create() {
    this.hp = GameState.maxHp;
    this.xp = 0; this.level = 1; this.enemyRate = 1000;
    this.isMagnetActive = false;

    this.physics.world.setBounds(-2000, -2000, 4000, 4000);
    this.bg = this.add.tileSprite(0, 0, this.scale.width*2, this.scale.height*2, 'bg_minimal').setScrollFactor(0);
    
    this.rocks = this.physics.add.staticGroup();
    for(let i=0; i<200; i++) {
      let rx = Phaser.Math.Between(-1900, 1900);
      let ry = Phaser.Math.Between(-1900, 1900);
      if (Math.abs(rx) > 200 || Math.abs(ry) > 200) { 
        let r = this.rocks.create(rx, ry, 'rock');
        r.setScale(Phaser.Math.FloatBetween(1, 2.5));
        r.refreshBody(); r.setCircle(r.width/2.5);
      }
    }

    this.enemies = this.physics.add.group();
    this.projectiles = this.physics.add.group();
    this.gems = this.physics.add.group();
    this.crates = this.physics.add.group();

    this.player = this.physics.add.sprite(0, 0, `player_${GameState.selectedWeapon}`).setScale(1).setDepth(10);
    this.player.setCollideWorldBounds(true);
    this.player.setCircle(20, 12, 12);
    this.cameras.main.startFollow(this.player);

    this.playerTween = this.tweens.add({ targets: this.player, scaleY: 0.85, scaleX: 1.15, yoyo: true, repeat: -1, duration: 150 });
    this.playerTween.pause();

    this.physics.add.collider(this.player, this.rocks);
    this.physics.add.collider(this.enemies, this.rocks);
    this.physics.add.collider(this.enemies, this.enemies); 
    this.physics.add.collider(this.projectiles, this.rocks, this.hitRock as any, undefined, this);
    this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy as any, undefined, this);
    this.physics.add.overlap(this.player, this.enemies, this.hitPlayer as any, undefined, this);
    this.physics.add.overlap(this.player, this.gems, this.getGem as any, undefined, this);
    this.physics.add.overlap(this.player, this.crates, this.getCrate as any, undefined, this);

    const txtStyle = { fontSize: '24px', color: '#fff', stroke: '#000', strokeThickness: 5 };
    this.hpText = this.add.text(20, 20, '', txtStyle).setScrollFactor(0).setDepth(100).setShadow(2, 2, '#000', 0, true, true);
    this.lvlText = this.add.text(this.scale.width - 20, 20, '', txtStyle).setOrigin(1, 0).setScrollFactor(0).setDepth(100).setShadow(2, 2, '#000', 0, true, true);
    this.updUI();

    this.joyBase = this.add.circle(0,0,50,0xffffff,0.2).setScrollFactor(0).setDepth(90).setVisible(false);
    this.joyThumb = this.add.circle(0,0,25,0xffffff,0.5).setScrollFactor(0).setDepth(91).setVisible(false);

    this.input.on('pointerdown', (p: any) => {
      this.joyData.act = true; this.joyData.sx = p.x; this.joyData.sy = p.y;
      this.joyBase.setPosition(p.x, p.y).setVisible(true);
      this.joyThumb.setPosition(p.x, p.y).setVisible(true);
      this.playerTween.resume();
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
      this.playerTween.pause(); this.player.setScale(1);
    });

    this.scale.on('resize', this.onResize, this);
    this.events.on('resume', () => { this.updUI(); this.player.clearTint(); });
  }
  
  onResize(gs: Phaser.Structs.Size) {
    if(this.lvlText) this.lvlText.setX(gs.width - 20);
  }

  update(t: number) {
    if (this.hp <= 0) return;
    this.bg.tilePositionX = this.cameras.main.scrollX; 
    this.bg.tilePositionY = this.cameras.main.scrollY;
    
    this.player.setVelocity(this.joyData.dx * GameState.speed, this.joyData.dy * GameState.speed);
    if(this.joyData.dx!==0) this.player.setFlipX(this.joyData.dx < 0);

    if (t > this.lastSpawn + this.enemyRate) {
      this.spawn(); this.lastSpawn = t;
      if (this.enemyRate > 200) this.enemyRate -= 5;
    }
    
    this.enemies.getChildren().forEach(c => {
      let e = c as Phaser.Physics.Arcade.Sprite;
      if(e.active) { 
        this.physics.moveToObject(e, this.player, 70); 
        e.setFlipX(e.body!.velocity.x < 0); 
        e.rotation = Math.sin(t / 150) * 0.15;
      }
    });

    if (this.isMagnetActive) {
      this.gems.getChildren().forEach(c => {
        let g = c as Phaser.Physics.Arcade.Sprite;
        if(g.active) this.physics.moveToObject(g, this.player, 600);
      });
    }

    const fireDelay = (GameState.selectedWeapon === 'sword' ? 1200 : 800) / GameState.fireRateMultiplier;
    if (t > this.lastFired + fireDelay) {
      this.attack(); this.lastFired = t;
    }
  }

  spawn() {
    let a=Math.random()*Math.PI*2, d=Math.max(this.scale.width, this.scale.height)/1.2;
    let e = this.enemies.create(this.player.x+Math.cos(a)*d, this.player.y+Math.sin(a)*d, 'slime') as any;
    e.setScale(1).setDepth(5).hp = 10 * GameState.weaponLevel;
    e.setCircle(20, 12, 12);
    this.tweens.add({ targets: e, scaleY: 0.85, scaleX: 1.15, yoyo: true, repeat: -1, duration: Math.random()*50 + 200 });

    if (Math.random() < 0.05) {
      let cx = this.player.x+Math.cos(a)*d*0.8;
      let cy = this.player.y+Math.sin(a)*d*0.8;
      let c = this.crates.create(cx, cy, 'crate');
      c.setScale(1.5).setDepth(4);
      this.tweens.add({ targets: c, y: c.y - 10, yoyo: true, repeat: -1, duration: 1000, ease: 'Sine.easeInOut' });
    }
  }

  attack() {
    let nd=Infinity, ne: any=null;
    this.enemies.getChildren().forEach(c => {
      let e=c as Phaser.Physics.Arcade.Sprite;
      if(e.active){ let d=Phaser.Math.Distance.BetweenPoints(this.player,e); if(d<nd){ nd=d; ne=e; } }
    });
    if(!ne || nd>600) return;

    let ang = Phaser.Math.Angle.BetweenPoints(this.player, ne);
    let evo = GameState.weaponLevel >= 10;
    
    if(GameState.selectedWeapon==='sword'){
      let tex = evo ? 'sword_evo' : 'sword';
      let s = this.projectiles.create(this.player.x+Math.cos(ang)*40, this.player.y+Math.sin(ang)*40, tex) as any;
      s.setScale(evo?2.5:1.5).setRotation(ang+Math.PI/2).setDepth(15);
      s.body.setSize(evo?100:60, evo?100:60);
      s.pierce = 999;
      this.tweens.add({ targets:s, angle:s.angle+(evo?360:180), duration:evo?300:200, onComplete:()=>s.destroy() });
    }
    else if(GameState.selectedWeapon==='staff') {
      let cnt = evo ? 3 : 1 + GameState.additionalProjectiles;
      for(let i=0; i<cnt; i++) {
        this.time.delayedCall(i*100, () => {
          let o = this.projectiles.create(this.player.x, this.player.y, evo?'orb_evo':'orb') as any;
          o.pierce = GameState.piercing + (evo?2:0);
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
        let ar = this.projectiles.create(this.player.x, this.player.y, evo?'arrow_evo':'arrow') as any;
        ar.setRotation(a); ar.pierce = GameState.piercing + (evo?5:0);
        this.physics.velocityFromRotation(a, evo?800:600, ar.body.velocity);
        this.addParticleTrail(ar, 0xdddddd);
        this.time.delayedCall(1500, ()=> { if(ar.active) ar.destroy(); });
      }
    }
  }

  addParticleTrail(target: Phaser.Physics.Arcade.Sprite, color: number) {
    let particles = this.add.particles(0, 0, 'particle', {
      speed: 20, scale: { start: 1, end: 0 }, alpha: { start: 1, end: 0 },
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
        speed: 50, scale: { start: 1.5, end: 0 }, tint: 0x00ff00, lifespan: 300, quantity: 10
      });
      pEx.explode(10);
      this.time.delayedCall(300, ()=>pEx.destroy());
      e.destroy();
    }
    
    if(p.texture.key!=='sword' && p.texture.key!=='sword_evo') {
      p.pierce--; if(p.pierce<=0) p.destroy();
    }
  }

  hitPlayer(p: any, e: any) {
    if(!e.active) return;
    this.hp -= 10; e.destroy(); this.updUI();
    
    this.cameras.main.shake(100, 0.01);
    p.setTintFill(0xff0000);
    this.time.delayedCall(150, () => { if(p.active) p.clearTint(); });

    if(this.hp<=0){
      p.setTintFill(0xff0000); this.physics.pause();
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
      let healTx = this.add.text(this.player.x, this.player.y - 30, '+HEAL', {fontSize:'24px',color:'#0f0', stroke:'#000', strokeThickness:4}).setOrigin(0.5).setDepth(100);
      this.tweens.add({targets:healTx, y: healTx.y-50, alpha:0, duration:1000, onComplete:()=>healTx.destroy()});
    }
  }

  updUI(){ 
    this.hpText.setText(`HP: ${Math.floor(this.hp)}/${GameState.maxHp}`);
    this.lvlText.setText(`LVL: ${this.level} (Wpn: ${GameState.weaponLevel})`);
  }
}

class UpgradeScene extends Phaser.Scene {
  constructor() { super('UpgradeScene'); }
  create() {
    this.add.rectangle(0,0,this.scale.width,this.scale.height,0x000000,0.85).setOrigin(0);
    this.add.text(this.scale.width/2, 60, 'LEVEL UP!', {fontSize:'42px',color:'#ffd700', stroke:'#000', strokeThickness:6}).setOrigin(0.5).setShadow(2, 2, '#000', 0, true, true);

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
    const spacing = 120;
    const cardW = Math.min(this.scale.width * 0.9, 400);
    
    picks.forEach((u, i) => {
      let y = startY + i*spacing;
      let bg = this.add.rectangle(cx, y, cardW, 100, 0x333333);
      bg.setStrokeStyle(4, 0x8b0000);
      
      this.add.text(cx, y-20, u.t, {fontSize:'26px',color:'#fff', stroke:'#000', strokeThickness:4}).setOrigin(0.5);
      this.add.text(cx, y+20, u.d, {fontSize:'16px',color:'#aaa'}).setOrigin(0.5);
      
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
