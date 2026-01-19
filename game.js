// Image position offsets for fine-tuning specific images
const IMAGE_OFFSETS = {
    // Mouth that needs to be lower
    'Dieet 2 planten 2 kleur.png': { y: 15 },
    // Flying legs 2 needs to be higher (it's lower than others)
    'Poten 2 vliegen 2 kleur.png': { y: -25 }
};

// Base offset for all legs (move up)
const LEGS_BASE_OFFSET = -15;

// Game data configuration
const GAME_DATA = {
    traits: {
        ogen: {
            A: { name: 'Dag zien', images: ['Ogen 1 dag 1 kleur.png', 'Ogen 2 dag 2 kleur.png'] },
            B: { name: 'Nacht zien', images: ['Ogen 3 nacht 1 kleur.png', 'Ogen 4 nacht 2 kleur.png'] }
        },
        poten: {
            C: { name: 'Vliegen', images: ['Poten 1 vliegen 1 kleur.png', 'Poten 2 vliegen 2 kleur.png'] },
            D: { name: 'Zwemmen', images: ['Poten 3 zwemmen 1 kleur.png', 'Poten 4 zwemmen 2 kleur.png'] }
        },
        lijf: {
            E: { name: 'Hard pantser', images: ['Lijf 1 hard koudbloedig 1 kleur.png', 'Lijf 2 hard koudbloedig 2 kleur.png'] },
            F: { name: 'Zachte vacht', images: ['Lijf 3 zacht warmbloedig 1 kleur.png', 'Lijf 4 zacht warmbloedig 2 kleur.png'] }
        },
        voedsel: {
            G: { name: 'Vlees/insecten', images: ['Dieet 3 vlees 1 kleur.png', 'Dieet 4 vlees 2 kleur.png'] },
            H: { name: 'Planten', images: ['Dieet 1 planten 1 kleur.png', 'Dieet 2 planten 2 kleur.png'] }
        }
    },
    environments: [
        {
            name: 'Vulkaan uitbarsting',
            description: "Door veel smog zijn de dagen erg donker en kan er 's nachts langer voedsel worden gevonden",
            affects: 'A',
            background: '#8B4513'
        },
        {
            name: 'Dagen worden langer',
            description: "Door de stand van de zon worden de dagen langer en kan er's nachts minder voedsel worden gevonden",
            affects: 'B',
            background: '#FFD700'
        },
        {
            name: 'Overstroming',
            description: 'De vallei waarin je leeft stroomt onder met water en er is geen land in zicht',
            affects: 'C',
            background: '#4682B4'
        },
        {
            name: 'Aardbeving',
            description: 'Er ontstaat een grote kloof tussen de soort en hun voedsel',
            affects: 'D',
            background: '#8B4513'
        },
        {
            name: 'Sneeuwstorm',
            description: 'De temperatuur daalt ineens heel snel',
            affects: 'E',
            background: '#E0FFFF'
        },
        {
            name: 'Aardverschuiving',
            description: 'Er komen een heel veel stenen op je af gedenderd!',
            affects: 'F',
            background: '#696969'
        },
        {
            name: 'Vallei met alleen maar planten',
            description: 'Een paradijs voor planteneters',
            affects: 'G',
            background: '#228B22'
        },
        {
            name: 'Sprinkhanenplaag',
            description: 'Door een grote plaag aan insecten worden alle planten opgegeten',
            affects: 'H',
            background: '#8B7355'
        }
    ]
};

// Global game state
const gameState = {
    animalCount: 2,
    animals: [],
    currentAnimalIndex: 0,
    currentEnvironment: null,
    usedEnvironments: []
};

// Main Menu Scene
class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        this.load.audio('game_start', 'sfx/game_start.wav');
    }

    create() {
        const { width, height } = this.cameras.main;

        this.add.text(width / 2, height / 3, 'EVOLUTIESPEL', {
            fontSize: '64px',
            color: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const startButton = this.add.rectangle(width / 2, height / 2, 200, 60, 0x4CAF50)
            .setInteractive({ useHandCursor: true });

        this.add.text(width / 2, height / 2, 'START', {
            fontSize: '32px',
            color: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        startButton.on('pointerover', () => startButton.setFillStyle(0x66BB6A));
        startButton.on('pointerout', () => startButton.setFillStyle(0x4CAF50));
        startButton.on('pointerdown', () => {
            this.sound.play('game_start');
            this.scene.start('AnimalCountScene');
        });

        // Short credits
        this.add.text(width / 2, height - 80, 'Made by Martijn Schut | Concept and Art by Esben Zeegers', {
            fontSize: '16px',
            color: '#aaaaaa',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Credits button
        const creditsButton = this.add.text(width / 2, height - 40, 'Credits', {
            fontSize: '18px',
            color: '#888888',
            fontFamily: 'Arial',
            fontStyle: 'italic'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        creditsButton.on('pointerover', () => creditsButton.setColor('#ffffff'));
        creditsButton.on('pointerout', () => creditsButton.setColor('#888888'));
        creditsButton.on('pointerdown', () => {
            this.scene.start('CreditsScene');
        });
    }
}

// Credits Scene
class CreditsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CreditsScene' });
    }

    create() {
        const { width, height } = this.cameras.main;

        this.add.text(width / 2, 100, 'CREDITS', {
            fontSize: '48px',
            color: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const creditsText = [
            'Made by Martijn Schut',
            'of Salty Scientist Studios',
            '',
            'Ideas and Art Assets by Esben Zeegers',
            '',
            '2025-2026',
            '',
            'For inquiries about this product:',
            'martijn.schut@scientific-inights.net'
        ];

        creditsText.forEach((line, index) => {
            this.add.text(width / 2, 200 + index * 40, line, {
                fontSize: '24px',
                color: '#ffffff',
                fontFamily: 'Arial'
            }).setOrigin(0.5);
        });

        // Back button
        const backButton = this.add.rectangle(width / 2, height - 80, 200, 50, 0x555555)
            .setInteractive({ useHandCursor: true });

        this.add.text(width / 2, height - 80, 'TERUG', {
            fontSize: '24px',
            color: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        backButton.on('pointerover', () => backButton.setFillStyle(0x777777));
        backButton.on('pointerout', () => backButton.setFillStyle(0x555555));
        backButton.on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });
    }
}

// Animal Count Selection Scene
class AnimalCountScene extends Phaser.Scene {
    constructor() {
        super({ key: 'AnimalCountScene' });
    }

    create() {
        const { width, height } = this.cameras.main;

        this.add.text(width / 2, 100, 'HOEVEEL DIEREN?', {
            fontSize: '48px',
            color: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const counts = [2, 3, 4];
        const buttonWidth = 120;
        const spacing = 160;
        const startX = width / 2 - (spacing * (counts.length - 1)) / 2;

        counts.forEach((count, index) => {
            const x = startX + index * spacing;
            const y = height / 2;

            const button = this.add.rectangle(x, y, buttonWidth, buttonWidth, 0x2196F3)
                .setInteractive({ useHandCursor: true });

            this.add.text(x, y, count.toString(), {
                fontSize: '64px',
                color: '#ffffff',
                fontFamily: 'Arial',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            button.on('pointerover', () => button.setFillStyle(0x42A5F5));
            button.on('pointerout', () => button.setFillStyle(0x2196F3));
            button.on('pointerdown', () => {
                gameState.animalCount = count;
                gameState.animals = [];
                gameState.currentAnimalIndex = 0;

                for (let i = 0; i < count; i++) {
                    gameState.animals.push({
                        id: i,
                        name: `Dier ${i + 1}`,
                        traits: { ogen: null, poten: null, lijf: null, voedsel: null },
                        variants: { ogen: 0, poten: 0, lijf: 0, voedsel: 0 },
                        hitPoints: 2
                    });
                }

                this.scene.start('TraitSelectionScene');
            });
        });
    }
}

// Trait Selection Scene
class TraitSelectionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TraitSelectionScene' });
    }

    preload() {
        // Load all trait images
        Object.values(GAME_DATA.traits).forEach(category => {
            Object.values(category).forEach(trait => {
                trait.images.forEach(imageName => {
                    this.load.image(imageName, 'Evolutiespel afbeeldingen gekleurd transparant/' + imageName);
                });
            });
        });

        // Load sound effects
        this.load.audio('select', 'sfx/select.wav');
        this.load.audio('confirmed', 'sfx/confirmed.wav');
    }

    create() {
        this.showTraitSelection();
    }

    shutdown() {
        // Clean up DOM input when leaving scene
        if (this.nameInput) {
            this.nameInput.remove();
            this.nameInput = null;
        }
    }

    showTraitSelection() {
        this.children.removeAll();

        // Remove old input if exists
        if (this.nameInput) {
            this.nameInput.remove();
        }

        const { width, height } = this.cameras.main;
        const animal = gameState.animals[gameState.currentAnimalIndex];

        // Name label
        this.add.text(width / 2 - 150, 45, 'NAAM:', {
            fontSize: '32px',
            color: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);

        // Create HTML input for name
        this.nameInput = document.createElement('input');
        this.nameInput.type = 'text';
        this.nameInput.value = animal.name;
        this.nameInput.placeholder = 'Voer naam in...';
        this.nameInput.style.cssText = `
            position: absolute;
            left: ${window.innerWidth / 2 - 50}px;
            top: 30px;
            width: 200px;
            height: 36px;
            font-size: 24px;
            font-family: Arial;
            padding: 5px 10px;
            border: 2px solid #4CAF50;
            border-radius: 5px;
            background: #333;
            color: white;
            outline: none;
        `;
        this.nameInput.addEventListener('input', (e) => {
            animal.name = e.target.value || `Dier ${animal.id + 1}`;
        });
        document.body.appendChild(this.nameInput);

        const traitCategories = ['ogen', 'poten', 'lijf', 'voedsel'];
        const categoryNames = {
            ogen: 'OGEN',
            poten: 'POTEN',
            lijf: 'LIJF',
            voedsel: 'VOEDSEL'
        };

        const startY = 140;
        const rowHeight = 140;

        traitCategories.forEach((category, rowIndex) => {
            const y = startY + rowIndex * rowHeight;

            this.add.text(width / 2, y - 60, categoryNames[category], {
                fontSize: '28px',
                color: '#ffffff',
                fontFamily: 'Arial',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            const traits = GAME_DATA.traits[category];
            const traitKeys = Object.keys(traits);

            // Show all 4 image variants (2 per trait type)
            let iconIndex = 0;
            const iconSpacing = 160;
            const startX = width / 2 - (iconSpacing * 1.5);

            traitKeys.forEach((traitKey) => {
                const trait = traits[traitKey];

                trait.images.forEach((imageName, variantIndex) => {
                    const x = startX + iconIndex * iconSpacing;
                    const isSelected = animal.traits[category] === traitKey && animal.variants[category] === variantIndex;

                    // Background for selection
                    const bg = this.add.rectangle(x, y, 130, 100, isSelected ? 0x4CAF50 : 0x424242, isSelected ? 1 : 0.3);
                    bg.setStrokeStyle(3, isSelected ? 0x4CAF50 : 0x666666);
                    bg.setInteractive({ useHandCursor: true });

                    // Trait image
                    const img = this.add.image(x, y, imageName);
                    img.setDisplaySize(100, 70);
                    img.setInteractive({ useHandCursor: true });

                    // Click handler
                    const onClick = () => {
                        // Play select sound with 10% frequency modulation (±165 cents)
                        this.sound.play('select', { detune: Phaser.Math.Between(-165, 165) });
                        animal.traits[category] = traitKey;
                        animal.variants[category] = variantIndex;
                        this.showTraitSelection();
                    };

                    bg.on('pointerdown', onClick);
                    img.on('pointerdown', onClick);

                    bg.on('pointerover', () => {
                        if (!isSelected) bg.setFillStyle(0x555555, 0.5);
                    });
                    bg.on('pointerout', () => {
                        if (!isSelected) bg.setFillStyle(0x424242, 0.3);
                    });

                    iconIndex++;
                });
            });
        });

        // Check if all traits are selected
        const allTraitsSelected = traitCategories.every(cat => animal.traits[cat] !== null);

        if (allTraitsSelected) {
            const nextButton = this.add.rectangle(width / 2, height - 60, 200, 50, 0xFF9800)
                .setInteractive({ useHandCursor: true });

            this.add.text(width / 2, height - 60, 'VOLGENDE', {
                fontSize: '24px',
                color: '#ffffff',
                fontFamily: 'Arial'
            }).setOrigin(0.5);

            nextButton.on('pointerdown', () => {
                this.sound.play('confirmed');
                gameState.currentAnimalIndex++;

                if (gameState.currentAnimalIndex < gameState.animalCount) {
                    this.showTraitSelection();
                } else {
                    this.scene.start('GamePlayScene');
                }
            });
        }
    }
}

// Main Gameplay Scene
class GamePlayScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GamePlayScene' });
    }

    create() {
        this.showAnimals();

        const { width, height } = this.cameras.main;
        this.add.text(width / 2, height - 80, 'Druk op SPATIE voor het rad', {
            fontSize: '32px',
            color: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start('WheelScene');
        });
    }

    showAnimals() {
        const { width, height } = this.cameras.main;
        const spacing = width / (gameState.animalCount + 1);

        gameState.animals.forEach((animal, index) => {
            if (animal.hitPoints <= 0) return;

            const x = spacing * (index + 1);
            const y = height / 2;

            // Show animal name
            this.add.text(x, y - 280, animal.name, {
                fontSize: '42px',
                color: '#ffffff',
                fontFamily: 'Arial',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            // Composite trait images into one unified animal
            // Layer order: poten (legs) at back, then lijf (body), voedsel (mouth), ogen (eyes) on top
            const centerY = y - 80;

            // Legs (back layer, 50% bigger)
            const potenInfo = GAME_DATA.traits.poten[animal.traits.poten];
            const potenImage = potenInfo.images[animal.variants.poten];
            const potenOffset = (IMAGE_OFFSETS[potenImage]?.y || 0) + LEGS_BASE_OFFSET;
            const poten = this.add.image(x, centerY + 70 + potenOffset, potenImage);
            poten.setDisplaySize(330, 195);

            // Body (centered)
            const lijfInfo = GAME_DATA.traits.lijf[animal.traits.lijf];
            const lijfImage = lijfInfo.images[animal.variants.lijf];
            const lijf = this.add.image(x, centerY, lijfImage);
            lijf.setDisplaySize(200, 140);

            // Eyes (on body, lower)
            const ogenInfo = GAME_DATA.traits.ogen[animal.traits.ogen];
            const ogenImage = ogenInfo.images[animal.variants.ogen];
            const ogen = this.add.image(x, centerY + 30, ogenImage);
            ogen.setDisplaySize(140, 90);

            // Mouth/Food (lower, below eyes)
            const voedselInfo = GAME_DATA.traits.voedsel[animal.traits.voedsel];
            const voedselImage = voedselInfo.images[animal.variants.voedsel];
            const voedselOffset = IMAGE_OFFSETS[voedselImage]?.y || 0;
            const voedsel = this.add.image(x, centerY + 90 + voedselOffset, voedselImage);
            voedsel.setDisplaySize(120, 80);

            // Show hit points
            this.add.text(x, y + 150, `❤️ ${animal.hitPoints}`, {
                fontSize: '48px',
                color: '#ffffff',
                fontFamily: 'Arial'
            }).setOrigin(0.5);
        });
    }
}

// Wheel of Fortune Scene
class WheelScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WheelScene' });
    }

    preload() {
        this.load.audio('wheel', 'sfx/wheel.wav');
    }

    create() {
        const { width, height } = this.cameras.main;

        this.add.text(width / 2, 80, 'RAD VAN FORTUIN', {
            fontSize: '64px',
            color: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Draw wheel
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.35;
        const segmentCount = GAME_DATA.environments.length;
        const anglePerSegment = (Math.PI * 2) / segmentCount;

        const colors = [0xFF5722, 0x2196F3, 0x4CAF50, 0xFFC107, 0x9C27B0, 0xFF9800, 0x00BCD4, 0x795548];

        // Create container for wheel to rotate properly
        const wheelContainer = this.add.container(centerX, centerY);

        // Draw wheel segments (draw at 0,0 relative to container)
        const graphics = this.add.graphics();
        GAME_DATA.environments.forEach((env, i) => {
            const startAngle = i * anglePerSegment - Math.PI / 2;
            const endAngle = (i + 1) * anglePerSegment - Math.PI / 2;

            graphics.fillStyle(colors[i], 1);
            graphics.beginPath();
            graphics.moveTo(0, 0);
            graphics.arc(0, 0, radius, startAngle, endAngle, false);
            graphics.closePath();
            graphics.fillPath();

            // Add text
            const textAngle = startAngle + anglePerSegment / 2;
            const textX = Math.cos(textAngle) * (radius * 0.7);
            const textY = Math.sin(textAngle) * (radius * 0.7);

            // Short labels for the wheel
            const labels = [
                'Vulkaan',
                'Lange\ndagen',
                'Over-\nstroming',
                'Aard-\nbeving',
                'Sneeuw-\nstorm',
                'Aard-\nverschuiving',
                'Planten\nvallei',
                'Sprink-\nhanen'
            ];

            const text = this.add.text(textX, textY, labels[i], {
                fontSize: '18px',
                color: '#ffffff',
                fontFamily: 'Arial',
                fontStyle: 'bold',
                align: 'center'
            }).setOrigin(0.5);

            wheelContainer.add(text);
        });

        wheelContainer.add(graphics);

        // Pointer (fixed position, doesn't rotate)
        const pointer = this.add.triangle(centerX, centerY - radius - 30, 0, 0, -20, 40, 20, 40, 0xFF0000);

        // Spin the wheel
        let currentAngle = 0;
        const spinDuration = 3000;
        const spins = 5 + Math.random() * 3;
        const finalAngle = spins * Math.PI * 2 + Math.random() * Math.PI * 2;

        // Play wheel sound with 10% frequency modulation (±165 cents)
        this.sound.play('wheel', { detune: Phaser.Math.Between(-165, 165) });

        this.tweens.add({
            targets: wheelContainer,
            angle: finalAngle * (180 / Math.PI), // Convert to degrees for Phaser
            duration: spinDuration,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                const normalizedAngle = (finalAngle % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
                const selectedIndex = Math.floor(normalizedAngle / anglePerSegment);
                const selectedEnv = GAME_DATA.environments[selectedIndex];

                gameState.currentEnvironment = selectedEnv;

                this.time.delayedCall(1000, () => {
                    this.scene.start('ResultScene');
                });
            }
        });
    }
}

// Result Scene
class ResultScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ResultScene' });
    }

    create() {
        const { width, height } = this.cameras.main;
        const env = gameState.currentEnvironment;

        // Change background color based on environment
        this.cameras.main.setBackgroundColor(env.background);

        this.add.text(width / 2, 60, env.name.toUpperCase(), {
            fontSize: '48px',
            color: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(width / 2, 120, env.description, {
            fontSize: '24px',
            color: '#ffffff',
            fontFamily: 'Arial',
            wordWrap: { width: width - 100 }
        }).setOrigin(0.5);

        // Calculate effects on animals
        const spacing = width / (gameState.animalCount + 1);

        gameState.animals.forEach((animal, index) => {
            const x = spacing * (index + 1);
            const y = height / 2 + 50;

            // Check if animal has the affected trait
            const hasAffectedTrait = Object.values(animal.traits).includes(env.affects);

            let effect = '';
            let color = '#FFEB3B';

            if (hasAffectedTrait) {
                animal.hitPoints--;
                effect = '-1 ❤️';
                color = '#F44336';
            } else {
                animal.hitPoints++;
                effect = '+1 ❤️';
                color = '#4CAF50';
            }

            // Draw composite animal
            this.add.text(x, y - 240, animal.name, {
                fontSize: '32px',
                color: '#ffffff',
                fontFamily: 'Arial',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            // Composite trait images into one unified animal
            // Layer order: poten (legs) at back, then lijf (body), voedsel (mouth), ogen (eyes) on top
            const centerY = y - 70;

            // Legs (back layer, 50% bigger)
            const potenInfo = GAME_DATA.traits.poten[animal.traits.poten];
            const potenImage = potenInfo.images[animal.variants.poten];
            const potenOffset = (IMAGE_OFFSETS[potenImage]?.y || 0) + LEGS_BASE_OFFSET;
            const poten = this.add.image(x, centerY + 55 + potenOffset, potenImage);
            poten.setDisplaySize(270, 165);

            // Body (centered)
            const lijfInfo = GAME_DATA.traits.lijf[animal.traits.lijf];
            const lijfImage = lijfInfo.images[animal.variants.lijf];
            const lijf = this.add.image(x, centerY, lijfImage);
            lijf.setDisplaySize(160, 110);

            // Eyes (on body, lower)
            const ogenInfo = GAME_DATA.traits.ogen[animal.traits.ogen];
            const ogenImage = ogenInfo.images[animal.variants.ogen];
            const ogen = this.add.image(x, centerY + 25, ogenImage);
            ogen.setDisplaySize(110, 70);

            // Mouth/Food (lower, below eyes)
            const voedselInfo = GAME_DATA.traits.voedsel[animal.traits.voedsel];
            const voedselImage = voedselInfo.images[animal.variants.voedsel];
            const voedselOffset = IMAGE_OFFSETS[voedselImage]?.y || 0;
            const voedsel = this.add.image(x, centerY + 70 + voedselOffset, voedselImage);
            voedsel.setDisplaySize(90, 60);

            // Show effect
            const effectText = this.add.text(x, y + 60, effect, {
                fontSize: '48px',
                color: color,
                fontFamily: 'Arial',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            // Animate effect
            this.tweens.add({
                targets: effectText,
                y: y + 20,
                alpha: 0,
                duration: 1500,
                ease: 'Power2'
            });

            // Show new hit points
            this.add.text(x, y + 120, `❤️ ${animal.hitPoints}`, {
                fontSize: '42px',
                color: '#ffffff',
                fontFamily: 'Arial'
            }).setOrigin(0.5);

            if (animal.hitPoints <= 0) {
                this.add.text(x, y + 180, '💀 DOOD', {
                    fontSize: '36px',
                    color: '#FF0000',
                    fontFamily: 'Arial',
                    fontStyle: 'bold'
                }).setOrigin(0.5);
            }
        });

        // Continue button
        this.time.delayedCall(2000, () => {
            const nextButton = this.add.rectangle(width / 2, height - 60, 200, 50, 0xFF9800)
                .setInteractive({ useHandCursor: true });

            this.add.text(width / 2, height - 60, 'VOLGENDE', {
                fontSize: '24px',
                color: '#ffffff',
                fontFamily: 'Arial'
            }).setOrigin(0.5);

            nextButton.on('pointerdown', () => {
                // Check if any animals are still alive
                const aliveAnimals = gameState.animals.filter(a => a.hitPoints > 0);

                if (aliveAnimals.length === 0) {
                    this.scene.start('GameOverScene');
                } else {
                    this.scene.start('GamePlayScene');
                }
            });
        });
    }
}

// Game Over Scene
class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    create() {
        const { width, height } = this.cameras.main;

        this.add.text(width / 2, height / 2 - 50, 'ALLE DIEREN ZIJN DOOD!', {
            fontSize: '48px',
            color: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const restartButton = this.add.rectangle(width / 2, height / 2 + 50, 250, 60, 0x4CAF50)
            .setInteractive({ useHandCursor: true });

        this.add.text(width / 2, height / 2 + 50, 'OPNIEUW SPELEN', {
            fontSize: '28px',
            color: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        restartButton.on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });
    }
}

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#2d2d2d',
    scene: [MainMenuScene, CreditsScene, AnimalCountScene, TraitSelectionScene, GamePlayScene, WheelScene, ResultScene, GameOverScene],
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);
