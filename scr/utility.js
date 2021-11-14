import Vec2 from './vec2.js';

function isConvex(pointA, pointB, pointC) {
	let ba = new Vec2(pointA.x - pointB.x, pointA.y - pointB.y);
	let bc = new Vec2(pointC.x - pointB.x, pointC.y - pointB.y);
	
	let cross = (ba.x * bc.y) - (bc.x * ba.y);
	
	if (cross < 0.0) {
		return 1;
	}
	else if (cross > 0.0) {
		return -1;
	}
	else {
		return 0;
	}
}

function isLeft(lineStart, lineEnd, point) {
	return ((lineEnd.x - lineStart.x) * (point.y - lineStart.y)) -
			((point.x - lineStart.x) * (lineEnd.y - lineStart.y));
}

function pointInPolygon(polygon, point) {
	let windingNum = 0;
	
	for (let i = 0; i < polygon.length; ++i) {
		let ii = 0;
		if (i + 1 < polygon.length) {
			ii = i + 1;
		}
		
		let vertCurr = polygon[i];
		let vertNext = polygon[(i + 1) % polygon.length];
		
		if (vertCurr.y <= point.y) {
			if (vertNext.y > point.y) {
				if (isLeft(vertCurr, vertNext, point) > 0) {
                    ++windingNum;
				}
			}
		}
		else {
			if (vertNext.y <= point.y) {
				if (isLeft(vertCurr, vertNext, point) < 0) {
                    --windingNum;
				}
			}
		}
	}
	
	return windingNum;
}

export {isConvex, isLeft, pointInPolygon};
