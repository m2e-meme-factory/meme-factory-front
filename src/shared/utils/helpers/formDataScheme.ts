import * as z from 'zod';

export const formDataSchema = z.object({
  name: z.string().min(2, { message: 'Имя не может быть пустым' }),
  phone: z
    .string()
    .min(1, { message: 'Номер телефона не может быть пустым' })
    .regex(/^\+?\d{1,3}?[\s\-]?\(?(\d{3})\)?[\s\-]?(\d{3})[\s\-]?(\d{2})[\s\-]?(\d{2})$/, {
      message: 'Неверный формат номера телефона',
    }),
  email: z
    .string()
    .min(1, { message: 'Email не может быть пустым' })
    .email({ message: 'Неверный формат email' }),
});
