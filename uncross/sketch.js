let V, E;
let l = 2;
let Sc = -1;
let Csc = [];
let but, sel;

function init() {
    V = []; E = []; Sc = -1; Csc = [];
    let VS = [];
    if (l < 9) {
        for (let i = 0; i < l*l; i++) {
            let SV = [400+360*Math.sin(i/(l*l)*2*Math.PI), 400+360*Math.cos(i/(l*l)*2*Math.PI)];
            VS.push(SV);
        }
    } else {
        for (let i = 0; i < 64; i++) {
            let SV = [400+360*Math.sin(i/(64)*2*Math.PI), 400+360*Math.cos(i/(64)*2*Math.PI)];
            VS.push(SV);
        }
        for (let i = 0; i < l*l-64; i++) {
            let SV = [400+240*Math.sin(i/(l*l-64)*2*Math.PI), 400+240*Math.cos(i/(l*l-64)*2*Math.PI)];
            VS.push(SV);
        }
    }
    for (let i = 0; i < l*l; i++) {
        let tmp = Math.floor(Math.random()*VS.length);
        V.push(VS[tmp]);
        VS.splice(tmp, 1);
    }
    
    for (let i = 0; i < l*l; i++) {
        if (i == 0) E.push([1, l]);
        else if (i == l-1) E.push([i-1, i+l, i+l-1]);
        else if (i == l*(l-1)) E.push([i-l, i+1, i-l+1]);
        else if (i == l*l-1) E.push([i-l, i-1]);
        else if (i < l) E.push([i-1, i+l, i+l-1, i+1]);
        else if (i > l*(l-1)) E.push([i-1, i-l, i-l+1, i+1]);
        else if (i%l == 0) E.push([i+l, i-l, i-l+1, i+1]);
        else if (i%l == l-1) E.push([i+l, i-l, i+l-1, i-1]);
        else E.push([i+1, i-1, i+l, i-l, i+l-1, i-l+1]);
    }
}

function intersects(a,b,c,d,p,q,r,s) {
    let det = (c-a)*(s-q)-(r-p)*(d-b);
    if (det === 0) return false;
    else {
        let al = ((s-q)*(r-a)+(p-r)*(s-b))/det;
        let la = ((b-d)*(r-a)+(c-a)*(s-b))/det;
        return 0<al && al<1 && 0<la && la<1;
    }
}

function setup() {
    createCanvas(800, 800);
    but = createButton("New Game");
    but.mouseClicked(newGame);
    but.size(83,21);
    but.position(100, 29);

    sel = createSelect();
    for (let i = 1; i < 10; i++) sel.option(i);
    sel.changed(changeN);
    sel.position(50, 30);

    init();
}

function newGame(){
    init();
}

function changeN(){
    l = parseInt(sel.value()) + 1;
    init();
}

function cross(a, b) {
    for (let i = 0; i < l*l; i++) {
        if (i == a || i == b) continue;
        for (let j = 0; j < E[i].length; j++) {
            if (E[i][j] == a || E[i][j] == b) continue;
            if (intersects(V[a][0], V[a][1], V[b][0], V[b][1], V[i][0], V[i][1], V[E[i][j]][0], V[E[i][j]][1])) return true;
        }
    }
    return false;
}

function mousePressed() {
    for (let i = 0; i < l*l; i++) {
        if (Math.sqrt((mouseX-V[i][0])*(mouseX-V[i][0])+(mouseY-V[i][1])*(mouseY-V[i][1])) <= 10) {
            Sc = i;
            Csc = E[i];
        }
    }
}

function mouseDragged() {
    V[Sc][0] = mouseX;
    V[Sc][1] = mouseY;
}

function mouseReleased() {
    Sc = -1;
    Csc = [];
}

function draw() {
    background(255);
    let ct = 0;
    for (let i = 0; i < l*l; i++) {
        for (let j = 0; j < E[i].length; j++) {
            if (cross(i, E[i][j])) stroke('red');
            else {
                stroke('green');
                ct++;
            }
            line(V[i][0], V[i][1], V[E[i][j]][0], V[E[i][j]][1]);
        }
    }

    stroke('black');
    for (let i = 0; i < l*l; i++) {
        fill('blue');
        circle(V[i][0], V[i][1], 10);
        if (i == Sc) {
            fill('white');
            circle(V[i][0], V[i][1], 10);
        } if (Csc.includes(i)) {
            fill('yellow');
            circle(V[i][0], V[i][1], 10);
        }
    }

    stroke('black');
    fill('black');
    textSize(28);
    textAlign(CENTER, CENTER);
    text((ct/2).toString() + '/' + (3*l*l-4*l+1).toString() + ' uncrossed', 650, 25);
    if (ct == (3*l*l-4*l+1)*2) {
        fill(Math.floor(Math.random()*256), Math.floor(Math.random()*256), Math.floor(Math.random()*256));
        textSize(40);
        text("Congratulations you won!", 400, 400);
    }
}