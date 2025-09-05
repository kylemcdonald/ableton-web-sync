import { transport, getPlaybackTime, startWebSync } from './ableton-web-sync.js';

// const transport = {
//     state: true
// }
// function startWebSync() {}
// function getPlaybackTime() {
//     return performance.now();
// }

startWebSync();

let img;
let dump;

let ppt = null;

window.preload = function () {
    // console.log('preload');
    img = loadImage('annotated.png');
    dump = loadJSON('dump.json');
}

window.setup = function () {
    // console.log('setup');
    const smaller = min(windowWidth, windowHeight);
    const cnv = createCanvas(smaller, smaller);
    cnv.parent('container');
    textAlign(CENTER, CENTER);
}

window.draw = function () {

    if (transport && !transport.state) {
        return;
    }

    const w = 15;
    const h = 1;

    const fps = 60.;
    const now = getPlaybackTime();
    const row = Math.floor(fps * now / 1000.);// + 1024 * 50;
    const x = Math.floor(row / img.height);
    const y = row - (x * img.height);

    const ignore = 8;
    const sub_image = img.get(x * w + ignore, y, w - ignore, h);

    stroke(255);
    fill(255);
    // text(now, 40, 20);
    // text(x, 40, 40);
    // text(parseInt(y), 40, 60);

    const elt = dump[row];
    const pt = elt[0];
    const label = elt[1];
    let darken;
    if (label != '') {
        push();
        const sf = width / 255;
        scale(sf, sf);

        if (ppt == null) {
            ppt = pt;
        } else {
            stroke(255,32);
            line(pt[0],pt[1],ppt[0],ppt[1]);
        }

        const small = 4;
        // textSize(small);
        // text(label, pt[0], pt[1]);

        // blendMode(ADD);
        translate(pt[0], pt[1]);
        rotate(PI/4);
        image(sub_image, -small, -small, small*2, small*2);
        pop();

        // line(0,0,width,height);
        // line(width,0,0,height);
        ppt = pt;
        darken = 8;

        // const big = 100;
        // textSize(big);
        // text(label, width/2, height/2);
    } else {
        ppt = null;
        darken = 64;
    }

    // noStroke();
    // fill(0,darken);
    // rect(0,0,width,height);

    // this fixes the edges
    image(sub_image, 0, 0, width, 16);

    // this has bad edges
    // image(img, 0, 0, width, 16, x * w, y, w, h);
}