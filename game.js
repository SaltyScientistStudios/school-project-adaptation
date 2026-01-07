// Game data configuration
const GAME_DATA = {
    traits: {
        ogen: {
            A: { name: 'Dag zien', image: 'Ogen 1 dag 1.jpg', variant: 1 },
            B: { name: 'Nacht zien', image: 'Ogen 3 nacht 1.jpg', variant: 2 }
        },
        poten: {
            C: { name: 'Vliegen', image: 'Poten 1 vliegen 1.jpg', variant: 1 },
            D: { name: 'Zwemmen', image: 'Poten 3 zwemmen 1.jpg', variant: 2 }
        },
        lijf: {
            E: { name: 'Hard pantser', image: 'Lijf 1 hard koudbloedig 1.jpg', variant: 1 },
            F: { name: 'Zachte vacht', image: 'Lijf 3 zacht warmbloedig 1.jpg', variant: 2 }
        },
        voedsel: {
            G: { name: 'Vlees/insecten', image: 'Dieet 3 vlees 1.jpg', variant: 1 },
            H: { name: 'Planten', image: 'Dieet 1 planten 1.jpg', variant: 2 }
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
    currentEnvironment: null
};

// Main Menu Scene
class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
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
            this.scene.start('AnimalCountScene');
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
                        traits: { ogen: null, poten: null, lijf: null, voedsel: null },
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
                this.load.image(trait.image, 'Evolutiespel afbeeldingen/' + trait.image);
            });
        });
    }

    create() {
        this.showTraitSelection();
    }

    showTraitSelection() {
        this.children.removeAll();

        const { width, height } = this.cameras.main;
        const animal = gameState.animals[gameState.currentAnimalIndex];

        this.add.text(width / 2, 50, `DIER ${animal.id + 1}`, {
            fontSize: '48px',
            color: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const traitCategories = ['ogen', 'poten', 'lijf', 'voedsel'];
        const categoryNames = {
            ogen: 'OGEN',
            poten: 'POTEN',
            lijf: 'LIJF',
            voedsel: 'VOEDSEL'
        };

        const startY = 120;
        const rowHeight = 110;

        traitCategories.forEach((category, rowIndex) => {
            const y = startY + rowIndex * rowHeight;

            this.add.text(100, y, categoryNames[category], {
                fontSize: '24px',
                color: '#ffffff',
                fontFamily: 'Arial',
                fontStyle: 'bold'
            });

            const traits = GAME_DATA.traits[category];
            const traitKeys = Object.keys(traits);

            traitKeys.forEach((traitKey, colIndex) => {
                const trait = traits[traitKey];
                const x = 300 + colIndex * 250;

                const button = this.add.rectangle(x, y, 200, 80,
                    animal.traits[category] === traitKey ? 0x4CAF50 : 0x757575)
                    .setInteractive({ useHandCursor: true });

                this.add.text(x, y - 25, `Variant ${trait.variant}`, {
                    fontSize: '16px',
                    color: '#ffffff',
                    fontFamily: 'Arial'
                }).setOrigin(0.5);

                this.add.text(x, y + 10, trait.name, {
                    fontSize: '14px',
                    color: '#ffffff',
                    fontFamily: 'Arial'
                }).setOrigin(0.5);

                button.on('pointerdown', () => {
                    animal.traits[category] = traitKey;
                    this.showTraitSelection();
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
            const y = height / 2 - 50;

            // Show animal number
            this.add.text(x, y - 250, `Dier ${animal.id + 1}`, {
                fontSize: '42px',
                color: '#ffffff',
                fontFamily: 'Arial',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            // Show trait images
            const traitOrder = ['ogen', 'poten', 'lijf', 'voedsel'];
            let imageY = y - 180;

            traitOrder.forEach((category) => {
                const traitKey = animal.traits[category];
                const traitInfo = GAME_DATA.traits[category][traitKey];

                // Add trait image
                const img = this.add.image(x, imageY, traitInfo.image);
                img.setDisplaySize(120, 80);

                imageY += 90;
            });

            // Show hit points
            this.add.text(x, y + 200, `❤️ ${animal.hitPoints}`, {
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

            // Draw animal with trait images
            const animalColor = [0xFF5722, 0x2196F3, 0x4CAF50, 0xFFC107][index];

            this.add.text(x, y - 180, `Dier ${animal.id + 1}`, {
                fontSize: '32px',
                color: '#ffffff',
                fontFamily: 'Arial',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            // Show small trait images
            const traitOrder = ['ogen', 'poten', 'lijf', 'voedsel'];
            let imageY = y - 130;

            traitOrder.forEach((category) => {
                const traitKey = animal.traits[category];
                const traitInfo = GAME_DATA.traits[category][traitKey];

                const img = this.add.image(x, imageY, traitInfo.image);
                img.setDisplaySize(80, 55);

                imageY += 60;
            });

            // Show effect
            const effectText = this.add.text(x, y + 110, effect, {
                fontSize: '48px',
                color: color,
                fontFamily: 'Arial',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            // Animate effect
            this.tweens.add({
                targets: effectText,
                y: y + 60,
                alpha: 0,
                duration: 1500,
                ease: 'Power2'
            });

            // Show new hit points
            this.add.text(x, y + 180, `❤️ ${animal.hitPoints}`, {
                fontSize: '42px',
                color: '#ffffff',
                fontFamily: 'Arial'
            }).setOrigin(0.5);

            if (animal.hitPoints <= 0) {
                this.add.text(x, y + 240, '💀 DOOD', {
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
    scene: [MainMenuScene, AnimalCountScene, TraitSelectionScene, GamePlayScene, WheelScene, ResultScene, GameOverScene],
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);
