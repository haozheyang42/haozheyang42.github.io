let V, E, F;
let C, T;
let l = 6;
let CS = "white";
let ST = true;
let but, but1, but2, but3;
let won = false;
let turn = 'instruction1';
let sta = 'game';
let pt = 1800;
let P1 = [], P2 = [];
let GC1, GC2;
let V1 = [], V2 = [];

function setup() {
    Canvas = createCanvas(800, 730);
    Canvas.position(10, 10);
    textAlign(CENTER, CENTER);
    textSize(24);

    V = [];
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            V.push([i*100+70+Math.floor(Math.random()*60)+100, j*100+70+Math.floor(Math.random()*60)]);
        }
    }

    E = [];
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

    F = [];
    for (let i = 0; i < l-1; i++) {
        for (let j = 0; j < l-1; j++) {
            F.push([i*6+j, i*6+j+1, i*6+j+6]);
            F.push([i*6+j+1, i*6+j+6, i*6+j+7]);
        }
    }

    let r = 10;
    while (r > 0) {
        let x = Math.floor(Math.random()*l);
        let y = Math.floor(Math.random()*l);
        if (E[x*l+y].length <= 4) continue;
        let ind = Math.floor(Math.random()*(E[x*l+y].length));
        if (E[E[x*l+y][ind]].length <= 4) continue;
        let ind2;
        for (let i = 0; i < E[E[x*l+y][ind]].length; i++) {
            if (E[E[x*l+y][ind]][i] == x*l+y) {
                ind2 = i;
                break;
            }
        }

        let CV1 = E[x*l+y][ind];
        let CV2 = E[E[x*l+y][ind]][ind2];
        let CI1 = -1, CI2 = -1;
        for (let i = 0; i < F.length; i++) {
            if (F[i].includes(CV1) && F[i].includes(CV2)) {
                if (CI1 == -1) CI1 = i;
                else CI2 = i;
            }
        }

        let S1 = true, S2 = true;
        for (let i = 1; i < F[CI1].length; i++) {
            if (F[CI1][i] == CV1 && F[CI1][i-1] == CV2) S1 = false;
        } if (F[CI1][F[CI1].length-1] == CV2 && F[CI1][0] == CV1) S1 = false;
        for (let i = 1; i < F[CI2].length; i++) {
            if (F[CI2][i] == CV1 && F[CI2][i-1] == CV2) S2 = false;
        } if (F[CI2][F[CI2].length-1] == CV2 && F[CI2][0] == CV1) S2 = false;

        let tmp = [CV1];
        for (let i = 0; i < F[CI1].length; i++) {
            if (F[CI1][i] == CV1) {
                if (S1) {
                    for (let j = 0; j < F[CI1].length - 1; j++) {
                        let curP = i-j-1;
                        if (curP < 0) curP += F[CI1].length;
                        tmp.push(F[CI1][curP]);
                    }
                } else {
                    for (let j = 0; j < F[CI1].length - 1; j++) {
                        let curP = i+j+1;
                        if (curP >= F[CI1].length) curP -= F[CI1].length;
                        tmp.push(F[CI1][curP]);
                    }
                }
                break;
            }
        }
        for (let i = 0; i < F[CI2].length; i++) {
            if (F[CI2][i] == CV2) {
                if (S2) {
                    for (let j = 0; j < F[CI2].length - 2; j++) {
                        let curP = i+j+1;
                        if (curP >= F[CI2].length) curP -= F[CI2].length;
                        tmp.push(F[CI2][curP]);
                    }
                } else {
                    for (let j = 0; j < F[CI2].length - 2; j++) {
                        let curP = i-j-1;
                        if (curP < 0) curP += F[CI2].length;
                        tmp.push(F[CI2][curP]);
                    }
                }
                break;
            }
        }

        E[E[x*l+y][ind]].splice(ind2, 1);
        E[x*l+y].splice(ind, 1);
        if (CI1 > CI2) {
            F.splice(CI1, 1);
            F.splice(CI2, 1);
        } else {
            F.splice(CI2, 1);
            F.splice(CI1, 1);
        }
        F.push(tmp);
        r--;
    }
    
    let Ca = ['red', 'yellow', 'green', 'blue'];
    let i = Math.floor(Math.random()*4);
    GC1 = Ca[i]; Ca.splice(i, 1);
    GC2 = Ca[Math.floor(Math.random()*3)];

    but1 = createButton('start game');
    but1.position(400, 700);
    but1.mousePressed(but1P);
}

function but1P() {
    turn = 'player 1';
    but1.remove();
    initPlayer();
}

function but2P() {
    turn = 'player 2';
    but2.remove();
    initPlayer();
}

function but3P() {
    turn = 'end';
    but3.remove();
    for (let i = 0; i < V.length; i++) {
        V1.push([V[i][0]/2-50, V[i][1]/2+400]);
        V2.push([V[i][0]/2+400, V[i][1]/2+400]);
    }
}

function initPlayer() {
    C = [];
    for (let i = 0; i < F.length; i++) C.push('white');
    T = 0;
    won = false;
    CS = 'white';
    sta = 'game';
    ST = true;

    but = createButton("Hide timer");
    but.position(430, 29);
    but.mousePressed(hide);
}

function hide() {
    ST = false;
    but.remove();
    but = createButton("Show timer");
    but.position(270, 29);
    but.mousePressed(show);
}

function show() {
    ST = true;
    but.remove();
    but = createButton("Hide timer");
    but.position(430, 29);
    but.mousePressed(hide);
}

function mouseClicked() {
    if (mouseX < 100 && mouseX > 20) {
        if (mouseY > 20 && mouseY < 60) CS = 'yellow';
        if (mouseY > 120 && mouseY < 160) CS = 'blue';
        if (mouseY > 220 && mouseY < 260) CS = 'red';
        if (mouseY > 320 && mouseY < 360) CS = 'green';
        if (mouseY > 420 && mouseY < 460) CS = 'white';
        if (mouseY > 520 && mouseY < 560) {
            if (check()) won = true;
            else {
                sta = 'penalty';
                pt = 1800;
            }
        }
    }

    for (let i = 0; i < F.length; i++) {
        if (inside(mouseX, mouseY, F[i])) {
            C[i] = CS;
        }
    }
}

function check() {
    for (let i = 0; i < C.length; i++) {
        if (C[i] == "white") return false;
    }
    let cor = true;
    for (let i = 0; i < F.length; i++) {
        for (let j = i+1; j < F.length; j++) {

            for (let k = 0; k < F[i].length; k++) {
                let nxt = k+1;
                if (k+1 == F[i].length) nxt = 0;
                if (F[j].includes(F[i][k]) && F[j].includes(F[i][nxt])) {
                    if (C[i] == C[j]) {
                        C[i] = 'white';
                        C[j] = 'white';
                        cor = false;
                    }
                }
            }

        }
    }
    return cor;
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

function inside(x, y, arr) {
    let ct1 = 0;
    for (let i = 0; i < arr.length-1; i++) {
        if (intersects(x, y, x, 800, V[arr[i]][0], V[arr[i]][1], V[arr[i+1]][0], V[arr[i+1]][1]))
            ct1++;
    }
    if (intersects(x, y, x, 800, V[arr[0]][0], V[arr[0]][1], V[arr[arr.length-1]][0], V[arr[arr.length-1]][1]))
        ct1++;

    let ct2 = 0;
    for (let i = 0; i < arr.length-1; i++) {
        if (intersects(x, y, x, 0, V[arr[i]][0], V[arr[i]][1], V[arr[i+1]][0], V[arr[i+1]][1]))
            ct2++;
    }
    if (intersects(x, y, x, 0, V[arr[0]][0], V[arr[0]][1], V[arr[arr.length-1]][0], V[arr[arr.length-1]][1]))
        ct2++;

    if (ct1%2 == 0 || ct2%2 == 0) return false;
    return true;
}

function draw() {
    background(255);
    if (turn == 'instruction1') {
        text("First, read through the instructions below!", 400, 200);
        text("Your first color to minimize is "+GC1 + '\n' + "Your second color to minimize is "+GC2, 400, 400);
        text("Player 1, press continue button below to start the game.\n The timer will start as soon as you press it!", 400, 600);
    }

    if (turn == 'instruction2') {
        text("Player 1 has finished one solution, hand your device over to player 2", 400, 200);
        text("Your first color to minimize is "+GC1 + '\n' + "Your second color to minimize is "+GC2, 400, 400);
        text("Player 2, press continue button below to start the game.\n The timer will start as soon as you press it!", 400, 600);
    }

    if (turn == 'instruction3') {
        text("Now player 2 has finished one solution\nGet player 1 to see the result!", 400, 200);
        text("Press the button below to see the result!", 400, 400);
    }
    
    if (turn == 'player 1') {
        if (sta == 'game') {
            noStroke();
            for (let i = 0; i < F.length; i++) {
                fill(C[i]);
                beginShape();
                for (let j = 0; j < F[i].length; j++) {
                    vertex(V[F[i][j]][0], V[F[i][j]][1]);
                }
                endShape(CLOSE);
            }

            stroke('black');
            strokeWeight(2);
            for (let i = 0; i < l*l; i++) {
                for (let j = 0; j < E[i].length; j++) {
                    line(V[i][0], V[i][1], V[E[i][j]][0], V[E[i][j]][1]);
                }
            }
            
            fill('purple');
            noStroke();
            if (CS == "yellow") rect(10, 10, 100, 60);
            if (CS == "blue") rect(10, 110, 100, 60);
            if (CS == "red") rect(10, 210, 100, 60);
            if (CS == "green") rect(10, 310, 100, 60);
            if (CS == "white") rect(10, 410, 100, 60);

            stroke('black');
            strokeWeight(2);
            fill('yellow');
            rect(20,20,80,40);
            fill('blue');
            rect(20,120,80,40);
            fill('red');
            rect(20,220,80,40);
            fill('green');
            rect(20,320,80,40);
            fill('white');
            rect(20,420,80,40);
            rect(20,520,80,40);
            
            fill('black');
            noStroke();
            text('Erase', 60, 440);
            text('Submit', 60, 540);

            text('Your first color to minimize is ' + GC1, 400, 670);
            text('Your second color to minimize is ' + GC2, 400, 700);

            if (won) {
                let c1 = 0, c2 = 0;
                for (let i = 0; i < C.length; i++) {
                    if (C[i] == GC1) c1++;
                    if (C[i] == GC2) c2++;
                }
                P1.push([c1, c2, Math.floor(T/60)]);
                P1.push(C);

                but.remove();
                turn = 'instruction2';
                but2 = createButton('start game');
                but2.position(400, 700);
                but2.mousePressed(but2P);
            }
        } if (sta == 'penalty') {
            background(100);
            fill('black');
            noStroke();
            text('You have submitted a incorrect solution!\nPenalty time remaining: ' + Math.floor(pt/60) + ' seconds', 400, 400);
            pt--;
            if (pt == 0) sta = 'game';
        }

        T++;
        if (ST) text('Time: ' + Math.floor(T/60) + ' seconds', 300, 30);

        let Cd = 0;
        for (let i = 0; i < C.length; i++) {
            if (C[i] != 'white') Cd++;
        }
        text('Colored: ' + Cd + '/40', 600, 30);
    }

    if (turn == 'player 2') {
        if (sta == 'game') {
            noStroke();
            for (let i = 0; i < F.length; i++) {
                fill(C[i]);
                beginShape();
                for (let j = 0; j < F[i].length; j++) {
                    vertex(V[F[i][j]][0], V[F[i][j]][1]);
                }
                endShape(CLOSE);
            }

            stroke('black');
            strokeWeight(2);
            for (let i = 0; i < l*l; i++) {
                for (let j = 0; j < E[i].length; j++) {
                    line(V[i][0], V[i][1], V[E[i][j]][0], V[E[i][j]][1]);
                }
            }
            
            fill('purple');
            noStroke();
            if (CS == "yellow") rect(10, 10, 100, 60);
            if (CS == "blue") rect(10, 110, 100, 60);
            if (CS == "red") rect(10, 210, 100, 60);
            if (CS == "green") rect(10, 310, 100, 60);
            if (CS == "white") rect(10, 410, 100, 60);

            stroke('black');
            strokeWeight(2);
            fill('yellow');
            rect(20,20,80,40);
            fill('blue');
            rect(20,120,80,40);
            fill('red');
            rect(20,220,80,40);
            fill('green');
            rect(20,320,80,40);
            fill('white');
            rect(20,420,80,40);
            rect(20,520,80,40);
            
            fill('black');
            noStroke();
            text('Erase', 60, 440);
            text('Submit', 60, 540);

            text('Your first color to minimize is ' + GC1, 400, 670);
            text('Your second color to minimize is ' + GC2, 400, 700);

            if (won) {
                let c1 = 0, c2 = 0;
                for (let i = 0; i < C.length; i++) {
                    if (C[i] == GC1) c1++;
                    if (C[i] == GC2) c2++;
                }
                P2.push([c1, c2, Math.floor(T/60)]);
                P2.push(C);

                but.remove();
                turn = "instruction3";
                but3 = createButton("See Result");
                but3.position(400, 450);
                but3.mousePressed(but3P);
            }
        } if (sta == 'penalty') {
            background(100);
            fill('black');
            noStroke();
            text('You have submitted a incorrect solution!\nPenalty time remaining: ' + Math.floor(pt/60) + ' seconds', 400, 400);
            pt--;
            if (pt == 0) sta = 'game';
        }

        T++;
        if (ST) text('Time: ' + Math.floor(T/60) + ' seconds', 300, 30);

        let Cd = 0;
        for (let i = 0; i < C.length; i++) {
            if (C[i] != 'white') Cd++;
        }
        text('Colored: ' + Cd + '/40', 600, 30);
    }

    if (turn == 'end') {
        noStroke();
        fill('black');
        let p1s = 'player 1: \n you used ' + P1[0][0] + ' ' + GC1 + ' blocks\n';
        p1s += 'you used ' + P1[0][1] + ' ' + GC2 + ' blocks\n';
        p1s += 'you took ' + P1[0][2] + ' seconds\n';
        text(p1s, 200, 200);

        let p2s = 'player 2: \n you used ' + P2[0][0] + ' ' + GC1 + ' blocks\n';
        p2s += 'you used ' + P2[0][1] + ' ' + GC2 + ' blocks\n';
        p2s += 'you took ' + P2[0][2] + ' seconds\n';
        text(p2s, 600, 200);

        let winner = '';
        if (P1[0][0] < P2[0][0]) winner = 'player 1';
        else if (P1[0][0] > P2[0][0]) winner = 'player 2';
        else if (P1[0][1] < P2[0][1]) winner = 'player 1';
        else if (P1[0][1] > P2[0][1]) winner = 'player 2';
        else if (P1[0][2] < P2[0][2]) winner = 'player 1';
        else if (P1[0][2] > P2[0][2]) winner = 'player 2';
        else {
            winner = "tie";
            text("Wow, tie game? You guys must have the same brain!", 400, 300);
        }

        fill(Math.floor(Math.random()*256), Math.floor(Math.random()*256), Math.floor(Math.random()*256));
        if (winner != 'tie') text("Congratulations, " + winner + " won!", 400, 300);

        noStroke();
        for (let i = 0; i < F.length; i++) {
            fill(P1[1][i]);
            beginShape();
            for (let j = 0; j < F[i].length; j++) {
                vertex(V1[F[i][j]][0], V1[F[i][j]][1]);
            }
            endShape(CLOSE);
        }

        stroke('black');
        strokeWeight(2);
        for (let i = 0; i < l*l; i++) {
            for (let j = 0; j < E[i].length; j++) {
                line(V1[i][0], V1[i][1], V1[E[i][j]][0], V1[E[i][j]][1]);
            }
        }

        noStroke();
        for (let i = 0; i < F.length; i++) {
            fill(P2[1][i]);
            beginShape();
            for (let j = 0; j < F[i].length; j++) {
                vertex(V2[F[i][j]][0], V2[F[i][j]][1]);
            }
            endShape(CLOSE);
        }

        stroke('black');
        strokeWeight(2);
        for (let i = 0; i < l*l; i++) {
            for (let j = 0; j < E[i].length; j++) {
                line(V2[i][0], V2[i][1], V2[E[i][j]][0], V2[E[i][j]][1]);
            }
        }
    }
}