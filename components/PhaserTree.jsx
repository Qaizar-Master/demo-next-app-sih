"use client";

import { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const PhaserTree = ({ points }) => {
    const gameRef = useRef(null);
    const containerRef = useRef(null);
    const pointsRef = useRef(points);
    const currentPointsInternal = useRef(points);

    useEffect(() => {
        pointsRef.current = points;
    }, [points]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        class TreeScene extends Phaser.Scene {
            constructor() {
                super('TreeScene');
                console.log('Phaser Logic: TreeScene Constructor');
                this.displayPoints = points;
                this.targetPoints = points;
                this.branches = [];
                this.particles = null;
                this.trunkHeight = 0;
            }

            preload() {
                try {
                    console.log('Phaser Logic: Preloading textures...');
                    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
                    graphics.fillStyle(0x22c55e, 1);
                    graphics.fillEllipse(5, 5, 8, 12);
                    graphics.lineStyle(1, 0x166534, 1);
                    graphics.strokeEllipse(5, 5, 8, 12);
                    graphics.generateTexture('leaf', 10, 15);
                    console.log('Phaser Logic: Texture "leaf" generated.');
                } catch (error) {
                    console.error('Phaser Logic: Preload error:', error);
                }
            }

            create() {
                try {
                    console.log('Phaser Logic: Creating scene...', { initialPoints: this.displayPoints });
                    this.graphics = this.add.graphics();
                    this.setupParticles();

                    this.startSyncTween(pointsRef.current);
                } catch (error) {
                    console.error('Phaser Logic: Create error:', error);
                }
            }

            startSyncTween(toPoints) {
                if (this.pointsTween) this.pointsTween.stop();

                this.targetPoints = toPoints;
                this.pointsTween = this.tweens.addCounter({
                    from: this.displayPoints,
                    to: toPoints,
                    duration: 1500,
                    ease: 'Cubic.out',
                    onUpdate: (tween) => {
                        this.displayPoints = tween.getValue();
                    }
                });
            }

            setupParticles() {
                this.particles = this.add.particles(0, 0, 'leaf', {
                    speed: { min: 20, max: 50 },
                    scale: { start: 0.6, end: 0 },
                    alpha: { start: 0.5, end: 0 },
                    rotate: { min: 0, max: 360 },
                    lifespan: 1500,
                    gravityY: 20,
                    frequency: -1, // Manual burst
                    blendMode: 'ADD'
                });
            }

            drawTree() {
                const width = this.cameras.main.width;
                const height = this.cameras.main.height;

                if (width === 0 || height === 0) return;

                this.graphics.clear();
                const p = this.displayPoints;
                const baseX = width / 2;
                const baseY = height - 40;

                // Ground Glow
                this.graphics.fillStyle(0x4ade80, 0.08);
                this.graphics.fillEllipse(baseX, baseY, 120, 24);

                // Wind Sway Factor
                const time = this.time.now;
                const sway = Math.sin(time * 0.0015) * 6;

                // 1. Trunk (Beziér)
                const maxTrunkHeight = 100;
                this.trunkHeight = Math.min(maxTrunkHeight, (p / 200) * maxTrunkHeight);

                const trunkStart = { x: baseX, y: baseY };
                const trunkEnd = { x: baseX + (sway * 0.5), y: baseY - this.trunkHeight };

                const trunkCurve = new Phaser.Curves.CubicBezier(
                    new Phaser.Math.Vector2(trunkStart.x, trunkStart.y),
                    new Phaser.Math.Vector2(baseX, baseY - this.trunkHeight * 0.4),
                    new Phaser.Math.Vector2(baseX + sway * 0.2, baseY - this.trunkHeight * 0.8),
                    new Phaser.Math.Vector2(trunkEnd.x, trunkEnd.y)
                );

                this.graphics.lineStyle(Math.max(2, (this.trunkHeight / 100) * 12), 0x5D4037, 1);
                trunkCurve.draw(this.graphics);

                // 2. Branches
                const branchConfigs = [
                    { startPct: 0.4, endOffset: { x: -50, y: -40 }, threshold: 250 },
                    { startPct: 0.6, endOffset: { x: 55, y: -50 }, threshold: 400 },
                    { startPct: 0.8, endOffset: { x: -45, y: -60 }, threshold: 600 },
                    { startPct: 0.9, endOffset: { x: 40, y: -70 }, threshold: 800 },
                    { startPct: 1.0, endOffset: { x: 0, y: -100 }, threshold: 950 },
                ];

                branchConfigs.forEach((cfg, i) => {
                    if (p > cfg.threshold) {
                        const progress = Math.min(1, (p - cfg.threshold) / 200);
                        const branchStart = trunkCurve.getPoint(cfg.startPct);
                        const branchEnd = {
                            x: branchStart.x + cfg.endOffset.x * progress + sway,
                            y: branchStart.y + cfg.endOffset.y * progress
                        };

                        const bc = new Phaser.Curves.QuadraticBezier(
                            new Phaser.Math.Vector2(branchStart.x, branchStart.y),
                            new Phaser.Math.Vector2(branchStart.x + cfg.endOffset.x * 0.3, branchStart.y + cfg.endOffset.y * 0.9),
                            new Phaser.Math.Vector2(branchEnd.x, branchEnd.y)
                        );

                        this.graphics.lineStyle(Math.max(1.5, 5 - i * 0.8), 0x5D4037, 1);
                        bc.draw(this.graphics);

                        // 3. Leaves
                        const leafThreshold = cfg.threshold + 30;
                        if (p > leafThreshold) {
                            const leafCount = Math.floor(Math.min(12, (p - leafThreshold) / 20));
                            for (let j = 0; j < leafCount; j++) {
                                const t = 0.2 + (j / 12) * 0.8;
                                const lp = bc.getPoint(t);

                                this.graphics.fillStyle(0x22C55E, 1);
                                this.graphics.fillEllipse(lp.x, lp.y, 8, 12);

                                // Ambient particles
                                if (p > 850 && Math.random() > 0.99) {
                                    this.particles.emitParticleAt(lp.x, lp.y);
                                }
                            }
                        }
                    }
                });
            }

            update() {
                // Correct detection of points change
                if (this.targetPoints !== pointsRef.current) {
                    this.startSyncTween(pointsRef.current);
                }

                // Always redraw for wind animation
                this.drawTree();
            }
        }

        const config = {
            type: Phaser.AUTO,
            parent: containerRef.current,
            width: 400,
            height: 400,
            transparent: true,
            scene: TreeScene,
        };

        console.log('Phaser Component: Initializing Game Instance');
        const game = new Phaser.Game(config);
        gameRef.current = game;

        return () => {
            console.log('Phaser Component: Destroying Game Instance');
            if (gameRef.current) {
                gameRef.current.destroy(true);
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="w-full h-full flex items-center justify-center pointer-events-none"
            style={{ minHeight: '400px' }}
        />
    );
};

export default PhaserTree;