import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function MinNumberLength(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: MinNumberLengthConstraint,
      constraints: [],
    });
  };
}

@ValidatorConstraint({ name: 'MinNumberLength' })
export class MinNumberLengthConstraint implements ValidatorConstraintInterface {
  validate(value: number, args: ValidationArguments) {
    return !(value.toString().length < 14);
  }
}
