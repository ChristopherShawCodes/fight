const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576


c.fillRect(0,0, canvas.width, canvas.height)

const gravity = 0.7

class Sprite {
    constructor({position,velocity}) {
        this.position = position
        this.velocity = velocity 
        this.height = 150
        this.lastKey
    }

    draw(){
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, 50, this.height)
    }

    update(){
        this.draw()

        this.position.x += this.velocity.x
        this.position.y = this.position.y + this.velocity.y
        
        if (this.position.y + this.height + this.velocity.y >= canvas.height){
            this.velocity.y = 0
        } else this.velocity.y += gravity
    
    }
}


const player = new Sprite({
    position:{
    x: 0,
    y: 0
},
    velocity: {
        x: 0,
        y: 10
    }
}) 

const enemy = new Sprite({
    position:{
    x: 400,
    y: 100
},
    velocity: {
        x:0,
        y: 0
    }
}) 

console.log(player)

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

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0,0, canvas.width, canvas.height)
    player.update()
    enemy.update()


    player.velocity.x = 0
    enemy.velocity.x = 0


//Player  Movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
    }

    //Enemy Movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
    }
}

animate()


//Event Listeners

// grab the key we are currently pressing with event.key and if that key is equal
//to 'd' on the keyboard
// then call player.velocity on the x axis equal to 1 meaning we will be 
// moving 1 pixel for every frame we loop over within the 'animate' loop
window.addEventListener('keydown', (event) => {
    console.log(event.key)
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
        //Enemy Keys
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
    }
    console.log(event.key)
})


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