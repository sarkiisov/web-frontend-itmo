import * as yup from 'yup';

export const productObject = yup.object().shape({
  name: yup
    .string()
    .required('Не указано название продукта'),
  price: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .nullable(true)
    .required('Не указана цена продукта')
    .typeError('Цена является числовым значением')
    .moreThan(0, 'Цена должна быть больше 0'),
  quantity: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .nullable(true)
    .required('Не указано количество продукта')
    .typeError('Количество явяется числовым значением')
    .moreThan(0, 'Количество должно быть больше 0')
    .integer('Количество явяется целочисленным значенем'),
});
