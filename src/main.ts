import Phaser from 'phaser';
import playerSwordImg from '../public/assets/player_sword.svg';
import playerStaffImg from '../public/assets/player_staff.svg';
import playerBowImg from '../public/assets/player_bow.svg';
import slimeImg from '../public/assets/slime.svg';
import bgImg from '../public/assets/bg.svg';
import rockImg from '../public/assets/rock.svg';
import crateImg from '../public/assets/crate.svg';

type WeaponType = 'sword' | 'staff' | 'bow';

class GameState {
  static selectedWeapon: WeaponType = 'sword';
  static weaponLevel: number = 1;
  static speed: number = 150;
  static magnetRange: number = 50;
  static maxHp: number = 100;
  static isEvolved: boolean = false;
  static damageMultiplier: number = 1;
  static fireRateMultiplier: number = 1;
  static piercing: number = 1;
  static additionalProjectiles: number = 0;

  static reset() {
    this.weaponLevel = 1;
    this.maxHp = 100;
    this.speed = 150;
    this.magnetRange = 50;
    this.isEvolved = false;
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
    this.load.image('rock_tex', rockImg);
    this.load.image('crate_tex', crateImg);
    
    const g = this.make.graphics({x:0,y:0}, false);
    
    // Shadow
    g.fillStyle(0x000000, 0.4); g.fillEllipse(32, 16, 64, 32);
    g.generateTexture('shadow', 64, 32); g.clear();

    // Particle
    g.fillStyle(0xffffff); g.fillCircle(4, 4, 4);
    g.generateTexture('particle', 8, 8); g.clear();
    
    // Projectile visual
    g.fillStyle(0xffffff); g.fillCircle(8, 8, 8); g.generateTexture('projectile', 16, 16); g.clear();
    
    // Gems
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
  
  private bg!: Phaser.GameObjects.TileSprite;
  private enemies!: Phaser.Physics.Arcade.Group;
  private projectiles!: Phaser.Physics.Arcade.Group;
  private gems!: Phaser.Physics.Arcade.Group;
  private rocks!: Phaser.Physics.Arcade.StaticGroup;
  private crates!: Phaser.Physics.Arcade.Group;
  
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
  private lastFireTime = 0;

  constructor() { super('GameScene'); }

  create() {
    this.hp = GameState.maxHp;
    this.xp = 0; this.level = 1; this.enemyRate = 1000;
    this.isMagnetActive = false;

    this.physics.world.setBounds(-2000, -2000, 4000, 4000);
    this.bg = this.add.tileSprite(0, 0, this.scale.width*2, this.scale.height*2, 'bg_tex').setScrollFactor(0);
    this.bg.setTint(0xcccccc);

    this.rocks = this.physics.add.staticGroup();
    for(let i=0; i<150; i++) {
      let rx = Phaser.Math.Between(-1900, 1900);
      let ry = Phaser.Math.Between(-1900, 1900);
      if (Math.abs(rx) > 200 || Math.abs(ry) > 200) { 
        let s = Phaser.Math.FloatBetween(0.8, 1.2);
        this.add.image(rx, ry + 15*s, 'shadow').setScale(s*1.2).setDepth(2);
        let r = this.rocks.create(rx, ry, 'rock_tex');
        r.setScale(s).setDepth(3); 
        r.refreshBody(); r.setCircle(20, 12, 12);
      }
    }

    this.enemies = this.physics.add.group();
    this.projectiles = this.physics.add.group();
    this.gems = this.physics.add.group();
    this.crates = this.physics.add.group();

    this.playerBody = this.physics.add.sprite(0, 0, 'particle').setVisible(false);
    this.playerBody.setCollideWorldBounds(true).setCircle(20);
    this.cameras.main.startFollow(this.playerBody);
    
    this.playerShadow = this.add.image(0, 15, 'shadow').setScale(1.2).setDepth(4);
    this.playerVisual = this.add.image(0, 0, `player_${GameState.selectedWeapon}`).setScale(0.5).setDepth(10);
    
    this.physics.add.collider(this.playerBody, this.rocks);
    this.physics.add.collider(this.enemies, this.rocks);
    this.physics.add.overlap(this.playerBody, this.enemies, this.hitPlayer as any, undefined, this);
    this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy as any, undefined, this);
    this.physics.add.overlap(this.playerBody, this.gems, this.getGem as any, undefined, this);
    this.physics.add.overlap(this.playerBody, this.crates, this.getCrate as any, undefined, this);

    this.hpBar = this.add.graphics().setScrollFactor(0).setDepth(100);
    this.xpBar = this.add.graphics().setScrollFactor(0).setDepth(100);
    this.lvlText = this.add.text(this.scale.width - 20, 45, '', { fontFamily: 'Fredoka One', fontSize: '26px', color: '#fff', stroke: '#000', strokeThickness: 5 }).setOrigin(1, 0).setScrollFactor(0).setDepth(100).setShadow(2, 2, '#000', 0, true, true);
    this.add.text(12, 13, 'XP', {fontFamily: 'Fredoka One', fontSize: '18px', color: '#0ff', stroke: '#000', strokeThickness: 4}).setScrollFactor(0).setDepth(100);
    this.add.text(12, 48, 'HP', {fontFamily: 'Fredoka One', fontSize: '18px', color: '#f00', stroke: '#000', strokeThickness: 4}).setScrollFactor(0).setDepth(100);
    this.updUI();

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
    
    this.playerVisual.setPosition(this.playerBody.x, this.playerBody.y - 10);
    this.playerShadow.setPosition(this.playerBody.x, this.playerBody.y + 15);
    
    this.gems.getChildren().forEach(c => {
        let g = c as Phaser.Physics.Arcade.Sprite;
        let dist = Phaser.Math.Distance.Between(this.playerBody.x, this.playerBody.y, g.x, g.y);
        if (dist < GameState.magnetRange || this.isMagnetActive) this.physics.moveToObject(g, this.playerBody, 600);
    });

    if(dx !== 0 || dy !== 0) {
      this.playerVisual.setFlipX(dx < 0);
      this.playerVisual.angle = Math.sin(t / 80) * 10;
    } else {
      this.playerVisual.angle = 0;
    }

    this.enemies.getChildren().forEach(c => {
      let e = c as Phaser.Physics.Arcade.Sprite;
      if(e.active) { 
        this.physics.moveToObject(e, this.playerBody, 80); 
        e.setFlipX(e.body!.velocity.x < 0); 
        e.angle = Math.sin(t / 100 + e.x) * 15;
      }
    });

    if (t > this.lastSpawn + this.enemyRate) {
      this.spawn(); this.lastSpawn = t;
      if (this.enemyRate > 200) this.enemyRate -= 5;
    }
    
    if (t > this.lastFireTime) {
      this.fireWeapon();
      this.lastFireTime = t + (GameState.selectedWeapon === 'bow' && GameState.isEvolved ? 300 : 700);
    }
  }

  spawn() {
    let a=Math.random()*Math.PI*2, d=Math.max(this.scale.width, this.scale.height)/1.2;
    let sx = this.playerBody.x+Math.cos(a)*d, sy = this.playerBody.y+Math.sin(a)*d;
    let e = this.enemies.create(sx, sy, 'slime') as any;
    e.setScale(0.5).setDepth(5).hp = 10 * GameState.weaponLevel;
    e.setCircle(45, 19, 19);
  }

  fireWeapon() {
    let a = this.playerVisual.flipX ? Math.PI : 0;
    let closestDist = 400; let target = null;
    this.enemies.getChildren().forEach((e: any) => {
      let d = Phaser.Math.Distance.Between(this.playerBody.x, this.playerBody.y, e.x, e.y);
      if (d < closestDist && e.active) { closestDist = d; target = e; }
    });
    if (target) { a = Phaser.Math.Angle.Between(this.playerBody.x, this.playerBody.y, (target as any).x, (target as any).y); }

    let wType = GameState.selectedWeapon;
    let isEvo = GameState.isEvolved;
    let projSpeed = 400;

    let createProj = (angle: number) => {
      let p = this.projectiles.create(this.playerBody.x, this.playerBody.y, 'projectile');
      p.setRotation(angle);
      if (wType === 'sword') {
        p.setTint(isEvo ? 0xffbb00 : 0xcccccc);
        p.setScale(isEvo ? 2.5 : 1 + GameState.weaponLevel*0.2);
        this.physics.velocityFromRotation(angle, 100, p.body.velocity);
        this.tweens.add({ targets: p, angle: p.angle + (isEvo ? 720 : 180), duration: isEvo ? 400 : 300 });
        setTimeout(() => p.destroy(), isEvo ? 400 : 300);
      } else if (wType === 'staff') {
        p.setTint(isEvo ? 0xff00ff : 0x00ffff);
        p.setScale(isEvo ? 1.5 : 0.8 + GameState.weaponLevel*0.1);
        this.physics.velocityFromRotation(angle, projSpeed * (isEvo ? 0.8 : 1), p.body.velocity);
        setTimeout(() => p.destroy(), 1500);
      } else if (wType === 'bow') {
        p.setTint(isEvo ? 0x00ff00 : 0x8b4513);
        p.setScale(isEvo ? 1.2 : 0.8);
        this.physics.velocityFromRotation(angle, isEvo ? projSpeed*1.5 : projSpeed, p.body.velocity);
        setTimeout(() => p.destroy(), 1000);
      }
      p.refreshBody(); p.setCircle(p.width/2);
      (p as any).isPiercing = (wType === 'bow' && isEvo);
      (p as any).hitList = [];
    };

    if (wType === 'staff' && isEvo) {
      createProj(a - 0.3); createProj(a); createProj(a + 0.3);
    } else {
      createProj(a);
    }
  }

  hitEnemy(p: any, e: any) {
    if(!p.active || !e.active) return;
    if (p.hitList && p.hitList.includes(e)) return;
    
    let dmg = 10 * GameState.damageMultiplier * (GameState.isEvolved ? 3 : 1);
    e.hp -= dmg;
    e.setTintFill(0xffffff);
    setTimeout(()=> e.clearTint(), 100);
    
    if (p.isPiercing) { p.hitList.push(e); } 
    else if (GameState.selectedWeapon !== 'sword') { p.destroy(); }
    
    if(e.hp <= 0) {
      this.gems.create(e.x, e.y, 'gem').setDepth(1);
      e.destroy();
    }
  }

  hitPlayer(_p: any, e: any) {
    if(!e.active) return;
    e.destroy();
    this.takeDamage();
    this.playerVisual.setTint(0xff0000);
    setTimeout(() => { if(this.playerVisual.active) this.playerVisual.clearTint(); }, 150);
  }

  getGem(_p: any, g: any) {
    g.destroy(); this.xp++;
    if(this.xp>=this.xpNext) {
      this.level++; this.xp=0; this.xpNext=Math.floor(this.xpNext*1.4);
      this.scene.pause();
      this.showUpgradeMenu();
    }
    this.updUI();
  }

  getCrate(_p: any, c: any) {
    c.destroy();
    let r = Math.random();
    if(r < 0.33) {
      this.enemies.getChildren().forEach(e => {
        let en = e as Phaser.Physics.Arcade.Sprite;
        if(en.active && this.cameras.main.worldView.contains(en.x, en.y)) {
           this.gems.create(en.x, en.y, 'gem').setDepth(1); en.destroy();
        }
      });
    } else if(r < 0.66) {
      this.isMagnetActive = true; this.time.delayedCall(2000, () => this.isMagnetActive = false);
    } else {
      this.hp = Math.min(GameState.maxHp, this.hp + 50);
      this.updateHpBar();
    }
  }

  showUpgradeMenu() {
    const cx = this.scale.width / 2;
    const cy = this.scale.height / 2;
    const menu = this.add.container(cx, cy).setDepth(200);
    const bg = this.add.rectangle(0, 0, 400, 500, 0x222222, 0.9).setStrokeStyle(4, 0xffffff);
    const title = this.add.text(0, -200, 'LEVEL UP!', {fontSize:'48px', color:'#ffff00', fontFamily:'Fredoka One'}).setOrigin(0.5);
    menu.add([bg, title]);

    let optionsPool = [
      { id: 'dmg', title: 'Damage Up', desc: '+20% Damage' },
      { id: 'spd', title: 'Boots of Haste', desc: '+15% Move Speed' },
      { id: 'mag', title: 'Magnet', desc: 'Expand Pickup Range' },
      { id: 'hp', title: 'Heart Container', desc: 'Max HP +20 & Heal' },
    ];
    
    if (this.hp < GameState.maxHp) optionsPool.push({ id: 'heal', title: 'Potion', desc: 'Restore 50 HP' });
    if (GameState.weaponLevel < 4) optionsPool.push({ id: 'weap', title: 'Weapon Upgrade', desc: 'Weapon Level +1' });
    else if (GameState.weaponLevel === 4 && !GameState.isEvolved) optionsPool = [{ id: 'evo', title: 'EVOLUTION!', desc: 'Unleash true power!' }];

    Phaser.Utils.Array.Shuffle(optionsPool);
    let chosenOptions = optionsPool.slice(0, Math.min(3, optionsPool.length));

    chosenOptions.forEach((opt, i) => {
      let card = this.add.rectangle(0, -80 + i*110, 340, 90, 0x444444).setInteractive({useHandCursor:true});
      let t1 = this.add.text(0, -100 + i*110, opt.title, {fontSize:'24px', color:'#fff', fontFamily:'Fredoka One'}).setOrigin(0.5);
      let t2 = this.add.text(0, -70 + i*110, opt.desc, {fontSize:'16px', color:'#aaa', fontFamily:'Fredoka One'}).setOrigin(0.5);
      
      card.on('pointerover', ()=>card.setFillStyle(0x666666));
      card.on('pointerout', ()=>card.setFillStyle(0x444444));
      card.on('pointerdown', ()=> {
        if (opt.id === 'weap') GameState.weaponLevel++;
        if (opt.id === 'evo') { GameState.weaponLevel++; GameState.isEvolved = true; }
        if (opt.id === 'dmg') GameState.damageMultiplier += 0.2;
        if (opt.id === 'spd') GameState.speed += 25;
        if (opt.id === 'mag') GameState.magnetRange += 30;
        if (opt.id === 'hp') { GameState.maxHp += 20; this.hp += 20; }
        if (opt.id === 'heal') { this.hp = Math.min(GameState.maxHp, this.hp + 50); }
        
        this.updateHpBar();
        this.scene.resume();
        menu.destroy();
      });
      menu.add([card, t1, t2]);
    });
  }

  takeDamage() {
    if(this.hp <= 0) return;
    this.hp -= 10;
    this.updateHpBar();
    this.cameras.main.shake(100, 0.01);
    if(this.hp <= 0) {
      this.add.text(this.scale.width/2, this.scale.height/2, 'GAME OVER', {fontSize:'64px', color:'#ff0000', fontFamily:'Fredoka One'})
          .setOrigin(0.5).setScrollFactor(0).setDepth(100);
      setTimeout(() => { GameState.reset(); this.scene.start('TitleScene'); }, 2000);
    }
  }

  updateHpBar() {
    this.hpBar.clear();
    this.hpBar.lineStyle(4, 0xffffff); this.hpBar.strokeRect(10, 50, 300, 20);
    this.hpBar.fillStyle(0xff0000); this.hpBar.fillRect(12, 52, 296 * (this.hp / GameState.maxHp), 16);
  }

  updUI(){ 
    const bw = Math.min(this.scale.width - 100, 300);
    this.xpBar.clear();
    this.xpBar.fillStyle(0x000000, 0.8); this.xpBar.fillRect(50, 15, bw, 20);
    this.xpBar.fillStyle(0x00ffff, 1); this.xpBar.fillRect(52, 17, (bw-4) * (this.xp/this.xpNext), 16);
    this.xpBar.lineStyle(2, 0xffffff); this.xpBar.strokeRect(50, 15, bw, 20);
    if(this.lvlText) this.lvlText.setText(`LVL: ${this.level}`);
    this.updateHpBar();
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO, width: window.innerWidth, height: window.innerHeight, parent: 'game-container',
  physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 0 }, debug: false } },
  scene: [BootScene, TitleScene, MenuScene, GameScene],
  scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH }
};
new Phaser.Game(config);
