class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, texture, frame, direction) {
        super (scene, x, y, texture, frame)
        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.body.setSize(this.width / 2, this.height / 2)
        this.body.setCollideWorldBounds(true)
        this.body.setImmovable(true)

        this.direction = direction 
        this.enemyVelocity = 75    // in pixels
        this.hurtTimer = 250       // in ms
        this.health = 100

        // initialize state machine managing enemy (initial state, possible states, state args[])
        scene.enemyFSM = new StateMachine('idle', {
            idle: new IdleState(),
            move: new MoveState(),
            attack: new AttackState(),
            hurt: new HurtState(),
            thugStun: new ThugStunState(),
        }, [scene, this])
    }
}

class IdleState extends State {
    enter(scene, enemy) {
        console.log('idle')
        enemy.setVelocity(0)
        enemy.anims.play(`walk-${enemy.direction}`)
        enemy.anims.stop()
        enemy.setSize(20, 20)
        scene.playerHit = false
    }

    execute(scene, enemy) {
        const player = scene.player1

        if (Phaser.Math.Distance.Between(enemy.x, enemy.y, player.x, player.y) < 200) {
            this.stateMachine.transition('move')
            return
        }
    }
}

class MoveState extends State {
    enter(scene, enemy) {
        console.log('move')
    }
    
    execute(scene, enemy) {
        const player = scene.player1
        const direction = new Phaser.Math.Vector2(player.x - enemy.x, player.y - enemy.y).normalize()

        if (direction.x < 0) {
            enemy.direction = 'left'
        } else {
            enemy.direction = 'right'
        }
        
        enemy.setVelocity(direction.x * enemy.enemyVelocity, direction.y * enemy.enemyVelocity)
        enemy.anims.play(`walk-${enemy.direction}`, true)

        if (Phaser.Math.Distance.Between(enemy.x, enemy.y, player.x, player.y) < 60) {
            this.stateMachine.transition('attack')
        }
    }
}

class AttackState extends State {
    enter(scene, enemy) {
        console.log('attack')
        enemy.setVelocity(0)
        enemy.anims.play(`attack-${enemy.direction}`)
        enemy.setSize(35, 20)

        scene.time.delayedCall(2000, () => {
            this.stateMachine.transition('thugStun')
            return
        })
    }
}

class HurtState extends State {
    enter(scene, enemy) {
        enemy.setVelocity(0)
        enemy.anims.play(`walk-${enemy.direction}`)
        enemy.anims.stop()

        // set recovery timer
        scene.time.delayedCall(1000, () => {
            if(enemy.health > 0) {
                enemy.clearTint()
                this.stateMachine.transition('idle')
                return
            }
        })
    }

    execute(scene, enemy) {
        if(scene.playerHit) {
            enemy.setTint(0xFF0000)
            scene.time.delayedCall(500, () => {
                if(enemy.health > 0) {
                    enemy.health -= 10
                    console.log(`health: ${enemy.health}`)
                    enemy.clearTint()
                    enemy.setVelocity(0)
                    scene.playerHit = false
                }
            })
        }
    }
}

class ThugStunState extends State {
    enter(scene, enemy) {
        console.log('stun')
        enemy.anims.play(`walk-${enemy.direction}`)
        enemy.anims.stop()
        enemy.setSize(20, 20)

        scene.time.delayedCall(2000, () => {
            if (this.stateMachine.state == 'thugStun') {
                this.stateMachine.transition('idle')
                return
            }
        })
    }
    execute(scene, enemy) {
        if (scene.playerHit) {
            this.stateMachine.transition('hurt')
            return
        }
    }
}
