// Threshold can be adjusted to increase efficiency of indetified shape
<<<<<<< HEAD
let threshold = 0.03;
/*#threshold */
=======
let threshold = 0.19;
>>>>>>> optimize_shape_recognition

const parameterOfShape = (array) => {
  let p = 0;
  for (let i = 1; i < array.length; i++) {
    //dx              *    dx                    +       dy                *     dy
    p += Math.sqrt(
      (array[i].x - array[i - 1].x) * (array[i].x - array[i - 1].x) +
        (array[i].y - array[i - 1].y) * (array[i].y - array[i - 1].y)
    );
  }
  return p;
};

const areaOfTriangleWithThreeDots = (x1, y1, x2, y2, x3, y3) => {
  /// https://www.aplustopper.com/wp-content/uploads/2016/08/area-triangle-vertices.jpg
  ///reference to the equation
  const delta1 = x1 * y2 - x2 * y1;
  const delta2 = x2 * y3 - x3 * y2;
  const delta3 = x3 * y1 - x1 * y3;
  const area = 0.5 * Math.abs(delta1 + delta2 + delta3);
  return area;
};

const areaOfShape = (array, centerX, centerY) => {
  let result = 0;
  for (let i = 1; i < array.length; i++) {
    ///center
    ///array[i-1]
    ///array[i]
    let x1 = centerX;
    let y1 = centerY;
    let x2 = array[i - 1].x;
    let y2 = array[i - 1].y;
    let x3 = array[i].x;
    let y3 = array[i].y;

    result += areaOfTriangleWithThreeDots(x1, y1, x2, y2, x3, y3);

    //Area of rectangle with three dots
  }
  return result;
};

const centerOfShape = (array) => {
  let centerX = 0;
  let centerY = 0;
  for (let { x, y } of array) {
    centerX += x;
    centerY += y;
  }
  centerX /= array.length;
  centerY /= array.length;

  return [centerX, centerY];
};

export const evaluateCircle = (array, th = threshold) => {
  ///calculate the area of the shape
  ///calculate the parameter of the shope
  ///A/P^2  =1/(4*PI)

  const parameter = parameterOfShape(array);
  const [centerX, centerY] = centerOfShape(array);
  const area = areaOfShape(array, centerX, centerY);

  ///in perfect circle delta=1
  const delta = (area / (parameter * parameter)) * 4 * Math.PI;

<<<<<<< HEAD
  console.log(delta);
  /*#threshold circle */
  if (Math.abs(delta - 1) < threshold) {
=======
  if (Math.abs(delta - 1) < th) {
>>>>>>> optimize_shape_recognition
    return true;
  } else {
    return false;
  }
};

export const evaluateSquare = (array, th = threshold) => {
  ///calculate the area of the shape
  ///calculate the parameter of the shope
  ///A/P^2  =1/16

  const parameter = parameterOfShape(array);
  const [centerX, centerY] = centerOfShape(array);
  const area = areaOfShape(array, centerX, centerY);

  ///in perfect circle delta=1
  const delta = (area / (parameter * parameter)) * 16;
<<<<<<< HEAD
  /*#threshold square */
  if (Math.abs(delta - 1) < threshold * 3) {
    if (evaluateRectangle(array)) {
      return true;
    }
    return false;
  } else {
    return false;
  }
};

export const evaluateTriangle = (array) => {
  const parameter = parameterOfShape(array);
  const [centerX, centerY] = centerOfShape(array);
  const area = areaOfShape(array, centerX, centerY);

  ///in perfect circle delta=1
  const delta = ((area / (parameter * parameter)) * 36) / Math.sqrt(3);
  /*#threshold triangle */
  if (Math.abs(delta - 1) < threshold * 5) {
=======

  if (Math.abs(delta - 1) < th) {
>>>>>>> optimize_shape_recognition
    return true;
  } else {
    return false;
  }
};

export const evaluateTriangle = (array, th = threshold) => {
  const parameter = parameterOfShape(array);
  const [centerX, centerY] = centerOfShape(array);
  const area = areaOfShape(array, centerX, centerY);

  const delta = ((area / (parameter * parameter)) * 36) / Math.sqrt(3);

  if (Math.abs(delta - 1) < th) {
    return true;
  } else {
    return false;
  }
};
export const evaluateRectangle = (array, th = threshold) => {
  const parameter = parameterOfShape(array);
  const [centerX, centerY] = centerOfShape(array);
  const area = areaOfShape(array, centerX, centerY);

  let maxX = -Infinity;
  let minX = Infinity;
  let maxY = -Infinity;
  let minY = Infinity;

  for (let el of array) {
    if (el.x > maxX) {
      maxX = el.x;
    }
    if (el.y > maxY) {
      maxY = el.y;
    }
    if (el.x < minX) {
      minX = el.x;
    }
    if (el.y < minY) {
      minY = el.y;
    }
  }

  let width = maxX - minX;
  let height = maxY - minY;
  let boundArea = width * height;
  th = 0.2;
  if (boundArea > 0) {
    if (Math.abs(area / boundArea - 1) <= th) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};
