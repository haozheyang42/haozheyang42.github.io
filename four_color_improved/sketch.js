let V, E, F;
let C, T;
let CS = "white";
let ST = true;
let but, but1, but2, but3;
let won = false;
let turn = 'instruction1';
let sta = 'game';
let pt = 1800;
let P1 = [], P2 = [];
let GC1;
let V1 = [], V2 = [];

function setup() {
    Canvas = createCanvas(800, 800);
    Canvas.position(10, 10);
    textAlign(CENTER, CENTER);
    textSize(24);

    fakeV = [], fakeE = [], fakeF = [];
    if (true) {
        let fakeVcor = false;
        while (!fakeVcor) {
            fakeV = [];
            while (fakeV.length < 40) {
                let tmp = [Math.floor(Math.random()*600)+100, Math.floor(Math.random()*600)+100];
                let add = true;
                for (let i = 0; i < fakeV.length; i++) {
                    let dsqr = (fakeV[i][0]-tmp[0])**2 + (fakeV[i][1]-tmp[1])**2;
                    if (dsqr < 1000) add = false;
                }
                if (add) fakeV.push(tmp);
            }

            fakeVcor = true;
            for (let i = 0; i < 39; i++) {
                for (let j = i+1; j < 40; j++) {
                    if (fakeV[i][1] == fakeV[j][1]) fakeVcor = false;
                }
            }
        }

        for (let i = 0; i < fakeV.length; i++) {
            let fakeEi = [];
            for (let j = 0; j < fakeV.length; j++) {
                if (i == j) continue;
                let m = -1/((fakeV[i][1]-fakeV[j][1])/(fakeV[i][0]-fakeV[j][0]));
                let x = (fakeV[i][0]+fakeV[j][0])/2
                let y = (fakeV[i][1]+fakeV[j][1])/2
                let b = y-x*m;
                fakeEi.push([m, b]);
            }
            fakeEi.push([0,50]);
            fakeEi.push([0,750]);
            fakeEi.push([1000000,-50*1000000]);
            fakeEi.push([1000000,-750*1000000]);
            fakeE.push(fakeEi);
        }

        for (let i = 0; i < fakeV.length; i++) {
            let fakeFi = [];

            let closestP = i+1; if (i+1 == fakeV.length) closestP = 0;
            for (let j = 0; j < fakeV.length; j++) {
                if (j == i) continue;
                let OD = (fakeV[closestP][0]-fakeV[i][0])**2+(fakeV[closestP][1]-fakeV[i][1])**2;
                let ND = (fakeV[j][0]-fakeV[i][0])**2+(fakeV[j][1]-fakeV[i][1])**2;
                if (ND < OD) closestP = j;
            }

            let Cang = Math.atan2(-(fakeV[closestP][1]-fakeV[i][1]), fakeV[closestP][0]-fakeV[i][0]);
            let EindCloP = closestP; if(closestP > i) EindCloP--;

            let minE = EindCloP+1; if (EindCloP+1 == fakeE[i].length) minE = 0;
            for (let j = 0; j < fakeE[i].length; j++) {
                if (j == EindCloP) continue;
                let intersec = intersection(fakeE[i][j][0], fakeE[i][j][1], fakeE[i][EindCloP][0], fakeE[i][EindCloP][1]);
                let Nang =  Math.atan2(-(intersec[1]-fakeV[i][1]), intersec[0]-fakeV[i][0]);
                let MINintersec = intersection(fakeE[i][minE][0], fakeE[i][minE][1], fakeE[i][EindCloP][0], fakeE[i][EindCloP][1]);
                let MINang = Math.atan2(-(MINintersec[1]-fakeV[i][1]), MINintersec[0]-fakeV[i][0]);
                if (angDiff(Cang, Nang) < angDiff(Cang, MINang)) minE = j;
            }

            let Pint = intersection(fakeE[i][minE][0], fakeE[i][minE][1], fakeE[i][EindCloP][0], fakeE[i][EindCloP][1]);
            fakeFi.push(Pint);
            Cang = Math.atan2(-(Pint[1]-fakeV[i][1]), Pint[0]-fakeV[i][0]);

            let linesUsed = [minE, EindCloP];
            let currentLine = minE;
            let offS = false;
            while (true) {
                minE = 0;
                while (linesUsed.includes(minE)) {
                    minE++;
                }
                for (let j = 0; j < fakeE[i].length; j++) {
                    if (linesUsed.includes(j)) continue;
                    let intersec = intersection(fakeE[i][j][0], fakeE[i][j][1], fakeE[i][currentLine][0], fakeE[i][currentLine][1]);
                    if (!isFinite(intersec[0]) || !isFinite(intersec[1])) continue;
                    let Nang = Math.atan2(-(intersec[1]-fakeV[i][1]), intersec[0]-fakeV[i][0]);
                    if (Number.isNaN(Nang)) continue;
                    let MINintersec = intersection(fakeE[i][minE][0], fakeE[i][minE][1], fakeE[i][currentLine][0], fakeE[i][currentLine][1]);
                    if (!isFinite(MINintersec[0]) || !isFinite(MINintersec[1])) {
                        minE = j;
                        continue;
                    }
                    let MINang = Math.atan2(-(MINintersec[1]-fakeV[i][1]), MINintersec[0]-fakeV[i][0]);
                    if (Number.isNaN(MINang)) {
                        minE = j;
                        continue;
                    }
                    if (angDiff(Cang, Nang) < angDiff(Cang, MINang))
                        minE = j;
                }

                Pint = intersection(fakeE[i][minE][0], fakeE[i][minE][1], fakeE[i][currentLine][0], fakeE[i][currentLine][1]);
                fakeFi.push(Pint);
                Cang = Math.atan2(-(Pint[1]-fakeV[i][1]), Pint[0]-fakeV[i][0]);
                linesUsed = [minE, currentLine];
                currentLine = minE;

                if (fakeFi[0][0] == fakeFi[fakeFi.length-1][0] && fakeFi[0][1] == fakeFi[fakeFi.length-1][1]) {
                    break;
                }
            }
            if (offS) fakeFi = [];

            fakeF.push(fakeFi);
        }

        for (let i = 0; i < fakeF.length; i++) {
            for (let j = 0; j < fakeF[i].length; j++) {
                fakeF[i][j][0] = Math.round(fakeF[i][j][0]);
                fakeF[i][j][1] = Math.round(fakeF[i][j][1]);
            }
        }
    }

    V = [];
    for (let i = 0; i < fakeF.length; i++) {
        for (let j = 0; j < fakeF[i].length; j++) {
            let tmp = fakeF[i][j];
            let sta = true;
            for (let k = 0; k < V.length; k++) {
                if (V[k][0] == tmp[0] && V[k][1] == tmp[1]) sta = false;
            }
            if (sta) V.push(tmp);
        }
    }
    
    F = [];
    for (let i = 0; i < fakeF.length; i++) {
        F.push([]);
        for (let j = 0; j < fakeF[i].length; j++) {
            let tmp = fakeF[i][j];
            let ind = 0;
            for (let k = 0; k < V.length; k++) {
                if (V[k][0] == tmp[0] && V[k][1] == tmp[1]) ind = k;
            }
            F[i].push(ind);
        }
    }

    E = [];
    for (let i = 0; i < V.length; i++) E.push([]);
    for (let i = 0; i < fakeF.length; i++) {
        for (let j = 0; j < fakeF[i].length-1; j++) {
            let tmp1 = fakeF[i][j];
            let tmp2 = fakeF[i][j+1];
            let ind1 = 0, ind2 = 0;
            for (let k = 0; k < V.length; k++) {
                if (V[k][0] == tmp1[0] && V[k][1] == tmp1[1]) ind1 = k;
                if (V[k][0] == tmp2[0] && V[k][1] == tmp2[1]) ind2 = k;
            }
            E[ind1].push(ind2);
            E[ind2].push(ind1);
        }
    }

    for (let i = 0; i < V.length; i++) {
        V[i][0] = (V[i][0]-50)/7*6+150;
        V[i][1] = (V[i][1]-50)/7*6+80;
    }

    let Ca = ['red', 'yellow', 'green', 'blue'];
    let i = Math.floor(Math.random()*4);
    GC1 = Ca[i]; Ca.splice(i, 1);

    but1 = createButton('start game');
    but1.position(400, 700);
    but1.mousePressed(but1P);
}

function angDiff(ang1, ang2) {
    if (ang1 < 0) ang1 += Math.PI*2;
    if (ang2 < 0) ang2 += Math.PI*2;
    if (ang2 > ang1) return ang2-ang1;
    return 2*Math.PI-(ang1-ang2);
}

function intersection(m1, b1, m2, b2) {
    let x = (b1-b2)/(m2-m1);
    let y = b1+m1*x;
    return [x, y];
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
        text("Your color to minimize is "+GC1 + '\n', 400, 400);
        text("Player 1, press continue button below to start the game.\n The timer will start as soon as you press it!", 400, 600);
    }

    if (turn == 'instruction2') {
        text("Player 1 has finished one solution, hand your device over to player 2", 400, 200);
        text("Your color to minimize is "+GC1 + '\n', 400, 400);
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
            for (let i = 0; i < V.length; i++) {
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

            text('Your color to minimize is ' + GC1, 400, 720);

            if (won) {
                let c1 = 0;
                for (let i = 0; i < C.length; i++) {
                    if (C[i] == GC1) c1++;
                }
                P1.push([c1, Math.floor(T/60)]);
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
            for (let i = 0; i < V.length; i++) {
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

            text('Your color to minimize is ' + GC1, 400, 720);

            if (won) {
                let c1 = 0;
                for (let i = 0; i < C.length; i++) {
                    if (C[i] == GC1) c1++;
                }
                P2.push([c1, Math.floor(T/60)]);
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
        p1s += 'you took ' + P1[0][1] + ' seconds\n';
        text(p1s, 200, 200);

        let p2s = 'player 2: \n you used ' + P2[0][0] + ' ' + GC1 + ' blocks\n';
        p2s += 'you took ' + P2[0][1] + ' seconds\n';
        text(p2s, 600, 200);

        let winner = '';
        if (P1[0][0] < P2[0][0]) winner = 'player 1';
        else if (P1[0][0] > P2[0][0]) winner = 'player 2';
        else if (P1[0][1] < P2[0][1]) winner = 'player 1';
        else if (P1[0][1] > P2[0][1]) winner = 'player 2';
        else {
            winner = "tie";
            text("Wow, tie game? You guys must have the same brain!", 400, 300);
        }

        fill(Math.floor(Math.random()*256), Math.floor(Math.random()*256), Math.floor(Math.random()*256));
        if (winner != 'tie') text("Congratulations, " + winner + " won!", 400, 300);

        // display grid
        // change V
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
        for (let i = 0; i < V.length; i++) {
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
        for (let i = 0; i < V.length; i++) {
            for (let j = 0; j < E[i].length; j++) {
                line(V2[i][0], V2[i][1], V2[E[i][j]][0], V2[E[i][j]][1]);
            }
        }
    }
}