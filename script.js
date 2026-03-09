const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")
ctx.scale(20,20)

const arenaWidth = 12
const arenaHeight = 20

let arena
let animationId
let gameOver = false

const player = {
pos:{x:0,y:0},
matrix:null
}

function createMatrix(w,h){
const matrix=[]
while(h--){
matrix.push(new Array(w).fill(0))
}
return matrix
}

function createPiece(type){
if(type==="T"){return[[0,1,0],[1,1,1],[0,0,0]]}
if(type==="O"){return[[2,2],[2,2]]}
if(type==="L"){return[[0,0,3],[3,3,3],[0,0,0]]}
if(type==="J"){return[[4,0,0],[4,4,4],[0,0,0]]}
if(type==="I"){return[[0,5,0,0],[0,5,0,0],[0,5,0,0],[0,5,0,0]]}
if(type==="S"){return[[0,6,6],[6,6,0],[0,0,0]]}
if(type==="Z"){return[[7,7,0],[0,7,7],[0,0,0]]}
}

function collide(arena,player){
for(let y=0;y<player.matrix.length;y++){
for(let x=0;x<player.matrix[y].length;x++){
if(player.matrix[y][x]!==0 &&
(arena[y+player.pos.y] &&
arena[y+player.pos.y][x+player.pos.x])!==0){
return true
}
}
}
return false
}

function merge(arena,player){
player.matrix.forEach((row,y)=>{
row.forEach((value,x)=>{
if(value!==0){
arena[y+player.pos.y][x+player.pos.x]=value
}
})
})
}

function drawMatrix(matrix,offset,ghost=false){
matrix.forEach((row,y)=>{
row.forEach((value,x)=>{
if(value!==0){
ctx.fillStyle = ghost ? "rgba(255,255,255,0.3)" : `hsl(${value*50},80%,60%)`
ctx.fillRect(x+offset.x,y+offset.y,1,1)
}
})
})
}

function draw(){
ctx.fillStyle="#000"
ctx.fillRect(0,0,canvas.width,canvas.height)

drawMatrix(arena,{x:0,y:0})
drawGhost()
drawMatrix(player.matrix,player.pos)
}

function drawGhost(){
let ghostY = player.pos.y

while(!collide(arena,{matrix:player.matrix,pos:{x:player.pos.x,y:ghostY}})){
ghostY++
}

ghostY--

drawMatrix(player.matrix,{x:player.pos.x,y:ghostY},true)
}

function playerReset(){
const pieces="TJLOSZI"
player.matrix=createPiece(pieces[Math.floor(Math.random()*pieces.length)])

player.pos.y=0
player.pos.x=(arena[0].length/2|0)-(player.matrix[0].length/2)

if(collide(arena,player)){
loseGame()
}
}

function loseGame(){
gameOver = true
cancelAnimationFrame(animationId)
document.getElementById("loseScreen").style.display="flex"
}

function move(dir){
if(gameOver) return
player.pos.x+=dir
if(collide(arena,player)){
player.pos.x-=dir
}
}

function rotate(){
if(gameOver) return
const m=player.matrix
for(let y=0;y<m.length;y++){
for(let x=0;x<y;x++){
[m[x][y],m[y][x]]=[m[y][x],m[x][y]]
}
}
m.forEach(row=>row.reverse())
}

function drop(){
if(gameOver) return

player.pos.y++

if(collide(arena,player)){
player.pos.y--
merge(arena,player)
playerReset()
}

dropCounter=0
}

let dropCounter=0
let dropInterval=700
let lastTime=0

function update(time=0){
const delta=time-lastTime
lastTime=time

dropCounter+=delta
if(dropCounter>dropInterval){
drop()
}

draw()
animationId = requestAnimationFrame(update)
}

function restart(){
arena = createMatrix(arenaWidth,arenaHeight)
gameOver = false
document.getElementById("loseScreen").style.display="none"
playerReset()
update()
}

document.addEventListener("keydown",event=>{
if(event.key==="ArrowLeft") move(-1)
else if(event.key==="ArrowRight") move(1)
else if(event.key==="ArrowDown") drop()
else if(event.key==="ArrowUp") rotate()
})

arena = createMatrix(arenaWidth,arenaHeight)
playerReset()
update()


