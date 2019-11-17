class Vector {

  constructor(x = 0, y = x) {
    this.x = x
    this.y = y
  }

  /**
   * Get vector's normalize
   * @param {Vector} vector
   * @return {Number}
   */
  static norm(vector) {
    return Math.sqrt(
      vector.x * vector.x +
      vector.y * vector.y
    )
  }

  /**
   * Normalize the vector
    * Get vector's normalize
    * @param {Vector} vector
   * @return {Vector}
   */
  static normalize(vector) {
    var norm = vector.norm()
    return new Vector(
      vector.x / norm,
      vector.y / norm
    )
  }

  /**
   * Scale the vector
   * @param  {Vector} vector
   * @param  {Number} scale
   * @return {Vector}
   */
  static scale(vector, scale) {
    vector.normalize()
    return new Vector(
      vector.x * scale,
      vector.y * scale
    )
  }

  /**
   * Adds two vectors
   * @param {Vector} vector1
   * @param {Vector} vector2
   * @return {Vector}
   */
  static add(vector1, vector2) {
    return new Vector(
      vector1.x + vector2.x,
      vector1.y + vector2.y
    )
  }

  /**
   * Subtracts two vectors
   * @param {Vector} vector1
   * @param {Vector} vector2
   * @return {Vector}
   */
  static subtract(vector1, vector2) {
    return new Vector(
      vector1.x - vector2.x,
      vector1.y - vector2.y
    )
  }

  /**
   * Get dot product of two vectors
   * @param {Vector} vector1
   * @param {Vector} vector2
   * @return {Number}
   */
  static dot(vector1, vector2) {
    return vector1.x*vector2.x + vector1.y*vector2.y
  }

  /**
   * Get cosine of the angle of two vectors
   * @param  {Vector} vector1
   * @param  {Vector} vector2
   * @return {Number}
   */
  static getCos(vector1, vector2) {
    return vector1.dot(vector2) / (vector1.norm() * vector2.norm())
  }

  /**
   * Get the angle of two vectors
   * @param  {Vector} vector1
   * @param  {Vector} vector2
   * @param  {String} unit
   * @return {Number}
   */
  static getAngle(vector1, vector2, unit = 'rad') {
    var cos = vector1.getCos(vector2)
    var angle = Math.acos(cos)
    if (unit === 'deg') {
      angle *= 180/Math.PI
    }
    return angle
  }

  /**
   * Multiply two vectors coordinates
   * @param  {Vector} vector1
   * @param  {Vector} vector2
   * @return {Vector}
   */
  static multiply(vector1, vector2) {
    return new Vector(vector1.x * vector2.x, vector1.y * vector2.y)
  }

  /**
   * Checks if two vectors are equal
   * @param  {Vector]} vector1
   * @param  {Vector]} vector2
   * @return {Boolean}
   */
  static equals(vector1, vector2) {
    return vector1.x === vector2.x && vector1.y === vector2.y
  }

  /*
    Aliases
   */

  norm() { return Vector.norm(this) }
  normalize() { return Vector.normalize(this) }
  scale(scale) { return Vector.scale(this, scale) }
  plus(vector) { return Vector.add(this, vector) }
  minus(vector) { return Vector.subtract(this, vector) }
  dot(vector) { return Vector.dot(this, vector) }
  getCos(vector) { return Vector.getCos(this, vector) }
  getAngle(vector, unit = 'rad') { return Vector.getAngle(this, vector, unit) }
  getAxisAngle(unit = 'rad') { return Vector.getAngle(this, new Vector(1, 0), unit) }
  times(vector) { return Vector.multiply(this, vector) }
  equals(vector) { return Vector.equals(this, vector) }

}

let VectorFactory = function(x, y) {
  return new Vector(x, y);
}

VectorFactory.__proto__ = Vector;
VectorFactory.prototype = Vector.prototype;

module.exports = VectorFactory
