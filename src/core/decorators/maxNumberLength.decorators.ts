import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function MaxNumberLength(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: MaxNumberLengthConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'MaxNumberLength' })
export class MaxNumberLengthConstraint implements ValidatorConstraintInterface {
  validate(value: number, args: ValidationArguments) {
    return !(value.toString().length > 16);
  }
}
