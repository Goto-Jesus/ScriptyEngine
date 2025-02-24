export const PhysicCombineOptions = { 
  Average: "Average",
  Multiply: "Multiply",
  Minimum: "Minimum",
  Maximum: "Maximum",
};

export class PhysicMaterial {
  constructor(
    friction = 0,
    bounciness = 0,
    frictionCombine = PhysicCombineOptions.Average,
    bounceCombine = PhysicCombineOptions.Average
  ) {
    this.friction = friction; // Трение
    this.bounciness = bounciness; // Упругость

    // Устанавливаем значения комбинирования по умолчанию
    this.frictionCombine = frictionCombine;
    this.bounceCombine = bounceCombine;
  }

  combine(physicCombineOption, physicProperty, otherMaterial, otherPhysicProperty) {
    switch (physicCombineOption) {
      case PhysicCombineOptions.Average:
        return (physicProperty + otherMaterial[otherPhysicProperty]) / 2;
      case PhysicCombineOptions.Multiply:
        return physicProperty * otherMaterial[otherPhysicProperty];
      case PhysicCombineOptions.Minimum:
        return Math.min(physicProperty, otherMaterial[otherPhysicProperty]);
      case PhysicCombineOptions.Maximum:
        return Math.max(physicProperty, otherMaterial[otherPhysicProperty]);
      default:
        return physicProperty;
    }
  }

  // Метод для вычисления комбинированного трения между двумя объектами
  combineFriction(otherMaterial) {
    return this.combine(
      this.frictionCombine,
      this.friction,
      otherMaterial,
      "friction",
    );
  }

  // Метод для вычисления комбинированной упругости
  combineBounciness(otherMaterial) {
    return this.combine(
      this.bounceCombine,
      this.bounciness,
      otherMaterial,
      "bounciness",
    );
  }
}
