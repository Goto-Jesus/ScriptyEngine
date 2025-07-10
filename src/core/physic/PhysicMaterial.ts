export enum PhysicCombineOptions {
  Average,
  Multiply,
  Minimum,
  Maximum,
};

export class PhysicMaterial {
  constructor(
    public friction = 0,
    public bounciness = 0,
    private frictionCombine = PhysicCombineOptions.Average,
    private bounceCombine = PhysicCombineOptions.Average,
  ) {
    this.friction = friction; // Трение
    this.bounciness = bounciness; // Упругость

    // Устанавливаем значения комбинирования по умолчанию
    this.frictionCombine = frictionCombine;
    this.bounceCombine = bounceCombine;
  }

  private combine(
    physicCombineOption: PhysicCombineOptions,
    physicProperty: number,
    otherProperty: number
  ): number {
    switch (physicCombineOption) {
      case PhysicCombineOptions.Average:
        return (physicProperty + otherProperty) / 2;
      case PhysicCombineOptions.Multiply:
        return physicProperty * otherProperty;
      case PhysicCombineOptions.Minimum:
        return Math.min(physicProperty, otherProperty);
      case PhysicCombineOptions.Maximum:
        return Math.max(physicProperty, otherProperty);
      default:
        return physicProperty;
    }
  }

  // Метод для вычисления комбинированного трения между двумя объектами
  combineFriction(otherMaterial: Pick<PhysicMaterial, 'friction'>): number {
    return this.combine(
      this.frictionCombine,
      this.friction,
      otherMaterial.friction
    );
  }

  // Метод для вычисления комбинированной упругости
  combineBounciness(otherMaterial: Pick<PhysicMaterial, 'bounciness'>): number {
    return this.combine(
      this.bounceCombine,
      this.bounciness,
      otherMaterial.bounciness
    );
  }
}
