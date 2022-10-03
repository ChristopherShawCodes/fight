const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576


c.fillRect(0,0, canvas.width, canvas.height)

const gravity = 0.7
//Background -----------------------------------------------------------
const background = new Sprite({
    position: {
        x:0,
        y:0
    },
    imageSrc: '/images/Fighting Game Assets/background.png'
})

const shop = new Sprite({
    position: {
        x: 640,
        y: 161
    },
    imageSrc: '/images/Fighting Game Assets/shop.png',
    scale: 2.5,
    framesMax: 6
})

//Player & Enemy -----------------------------------------------------
//Player One---------------------------------------------------
const player = new Fighter({
    position:{
    x: 200,
    y: 0
},
    velocity: {
        x: 0,
        y: 10
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: '/images/Fighting Game Assets/SamuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    //Sprites for Player One ---------------------------------------------------
    sprites: {
        idle: {
            imageSrc: '/images/Fighting Game Assets/SamuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: '/images/Fighting Game Assets/SamuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: '/images/Fighting Game Assets/SamuraiMack/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: '/images/Fighting Game Assets/SamuraiMack/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: '/images/Fighting Game Assets/SamuraiMack/Attack1.png',
            framesMax: 6
        },
        attack2: {
            imageSrc: '/images/Fighting Game Assets/SamuraiMack/Attack2.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: '/images/Fighting Game Assets/SamuraiMack/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc: '/images/Fighting Game Assets/SamuraiMack/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50,
        },
        width: 150,
        height: 50
    }
}) 

//Player Two ----------------------------------------------------------------------------
const enemy = new Fighter({
    position:{
    x: 700,
    y: 100
},
    velocity: {
        x:0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: '/images/Fighting Game Assets/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167
    },
    //Sprites For Player Two ------------------------------------------------
    sprites: {
        idle: {
            imageSrc: '/images/Fighting Game Assets/kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: '/images/Fighting Game Assets/kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: '/images/Fighting Game Assets/kenji/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: '/images/Fighting Game Assets/kenji/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: '/images/Fighting Game Assets/kenji/Attack1.png',
            framesMax: 4
        },
        attack2: {
            imageSrc: '/images/Fighting Game Assets/kenji/Attack2.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './images/Fighting Game Assets/kenji/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: '/images/Fighting Game Assets/kenji/Death.png',
            framesMax: 7
        },
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50,
        },
        width: 170,
        height: 50
    }
}) 
//--------------------------------------------------------End Of Player Two

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

decreaseTimer()

//animation function -----------------------------------------------------------------
function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0,0, canvas.width, canvas.height)
    background.update()
    shop.update()
    //Added an overlay to help with contrast of the players to background. 0.15 = transparency value
    c.fillStyle = 'rgba(255,255,255,0.15)'
    c.fillRect(0,0, canvas.width, canvas.height)
    player.update()
    enemy.update()


    player.velocity.x = 0
    enemy.velocity.x = 0


//Player Movement/ Player One ----------------------------------------------------------
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -6
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 6
        player.switchSprite('run')
    } else{
        player.switchSprite('idle')
    }

//For Jump Animation For Player One 
    if (player.velocity.y < 0){
        player.switchSprite('jump')
    } else if (player.velocity.y > 0){
        player.switchSprite('fall')
    }


//Enemy Movement / Player Two -----------------------------------------------------------
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }

    //For Jump Animation For Player Two----------------------
    if (enemy.velocity.y < 0){
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0){
        enemy.switchSprite('fall')
    }

//Detect For Collision && When A Player Gets Hit-----------------------------------------------------
    if (rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
    }) &&
        player.isAttacking && player.framesCurrent === 4)  {
        enemy.takeHit()
        player.isAttacking = false
        //GSAP is imported via CDN on index.html and is used for animations
        // in this case it is slowing down the health bar when a player gets hit
        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        })
    }


    //If Player One misses player two with the attack
    if (player.isAttacking && player.framesCurrent ===4){
        player.isAttacking = false
    }
//This is where the player gets hit
    if (rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
    }) &&
        enemy.isAttacking && 
        enemy.framesCurrent === 2)  
        {
        player.takeHit()
        enemy.isAttacking = false
        gsap.to('#playerHealth', {
            width: player.health + '%'
        })
    }

        //If Player two Misses player one with the attack
        if (enemy.isAttacking && enemy.framesCurrent === 2){
            enemy.isAttacking = false
        }

//end game based on health ---------------------------------------------------
    if (enemy.health <= 0 || player.health <= 0){
        determineWinner({player,enemy,timerId})
    }
}//end of animation

animate()

//Refresh page-------------------------------------------------------------------------

const refreshButton = document.querySelector('.refresh-button');

const refreshPage = () => {
    location.reload();
}
refreshButton.addEventListener('click',refreshPage)

//Event Listeners ------------------------------------------------------------

// grab the key we are currently pressing with event.key and if that key is equal
//to 'd' on the keyboard
// then call player.velocity on the x axis equal to 1 meaning we will be 
// moving 1 pixel for every frame we loop over within the 'animate' loop
window.addEventListener('keydown', (event) => {
    if (!player.dead) {

    switch(event.key){
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w':
            player.velocity.y = -20 
            player.lastKey = 'w'
            break
            //space bar to attack !
        case ' ':
            player.attack()
            break
        case 'm':
            player.attack2()
            break
    }
}
    if(!enemy.dead) {
        //Enemy Keys
        switch(event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.velocity.y = -20
            break
        case 'ArrowDown':
            // enemy.isAttacking = true
            enemy.attack()
        case '0':
            enemy.attack2()
            break
        }  
    }
})

//Key Up --------------------------------------------------------------------
window.addEventListener('keyup', (event) => {
    //player 
    switch(event.key){
        case 'd':
            keys.d.pressed = false
            break
            case 'a':
                keys.a.pressed = false
                break
    }
    //enemy
    switch(event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }

    console.log(event.key)
})